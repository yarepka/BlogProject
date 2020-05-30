const passport = require("passport");
const User = require("../models/user");
const Profile = require("../models/profile");
const LocalStrategy = require("passport-local").Strategy;

// tells passport how to
// store the user in the session
passport.serializeUser((user, done) => {
  // whenever you want to store user in the session,
  // serialize it by id.
  done(null, user.id);
});

// retrive the user whenever i need it,
// throuh this stored(in the session) id.
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// creating the user
passport.use(
  "local.signup",
  new LocalStrategy(
    {
      // we want to tell this local passport package
      // that usernameField is "email" and passwordField
      // is "password"
      usernameField: "username",
      passwordField: "password",

      // req object will be past as a parameter
      // to the callback function below
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      let newUser = new User();
      newUser.username = username;
      newUser.password = newUser.encryptPassword(password);
      newUser.createdOn = new Date();
      let profile = new Profile();
      profile.userId = newUser._id;
      newUser.save((err, result) => {
        if (err) {
          return done(err);
        }
        profile.save();
        return done(null, newUser);
      });
    }
  )
);

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      // we want to tell this local passport package
      // that usernameField is "email" and passwordField
      // is "password"
      usernameField: "username",
      passwordField: "password",

      // req object will be past as a parameter
      // to the callback function below
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      // will try to find user
      User.findOne({ username: username }, (err, user) => {
        if (err) {
          return done(err);
        }

        if (!user) {
          // flash message will be stored in the session,
          // which can be outputed to the view
          // 1st param - no errors
          // 2nd param - no any retrived objects (telling that is is not succesfull)
          // 3rd param - flash message
          return done(null, false, req.flash("usernameError", { message: "Username is not registered" }));
        }

        if (!user.validPassword(password)) {
          // password is wrong
          return done(null, false, req.flash("passwordError", { message: "Wrong password" }));
        }

        return done(null, user);
      });
    }
  )
);