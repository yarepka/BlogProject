const Community = require("../models/community");
var mongoose = require("mongoose");

// DB config
const db = require("../config/keys").MongoURI;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, });

let communities = [
  new Community({
    name: "y/animals",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/animals/animalsMain.jpg"
  }),
  new Community({
    name: "y/anime",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/anime/animeMain.jpg"
  }),
  new Community({
    name: "y/architecture",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/architecture/architectureMain.jpg"
  }),
  new Community({
    name: "y/art",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/art/artMain.jpg"
  }),
  new Community({
    name: "y/biology",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/biology/biologyMain.jpg"
  }),
  new Community({
    name: "y/books",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/books/booksMain.jpg"
  }),
  new Community({
    name: "y/building",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/building/buildingMain.jpg"
  }),
  new Community({
    name: "y/business",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/business/businessMain.jpg"
  }),
  new Community({
    name: "y/cars",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/cars/carsMain.jpg"
  }),
  new Community({
    name: "y/chemistry",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/chemistry/chemistryMain.jpg"
  }),
  new Community({
    name: "y/programming",
    amountOfSubscribers: 0,
    topImagePath: "./img/communities/programming/programmingTop.jpg",
  }),
  new Community({
    name: "y/cooking",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/cooking/cookingMain.jpg"
  }),
  new Community({
    name: "y/dancing",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/dancing/dancingMain.jpg"
  }),
  new Community({
    name: "y/education",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/education/educationMain.jpg"
  }),
  new Community({
    name: "y/electronics",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/electronics/electronicsMain.jpg"
  }),
  new Community({
    name: "y/films",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/films/filmsMain.jpg"
  }),
  new Community({
    name: "y/gadgets",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/gadgets/gadgetsMain.jpg"
  }),
  new Community({
    name: "y/gaming",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/gaming/gamingMain.jpg"
  }),
  new Community({
    name: "y/geography",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/geography/geographyMain.jpg"
  }),
  new Community({
    name: "y/history",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/history/historyMain.jpg"
  }),
  new Community({
    name: "y/garden",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/garden/gardenMain.jpg"
  }),
  new Community({
    name: "y/internet",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/internet/internetMain.jpg"
  }),
  new Community({
    name: "y/job",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/job/jobMain.jpg"
  }),
  new Community({
    name: "y/linguistics",
    mainImagePath: "./img/communities/linguistics/linguisticsMain.jpg"
  }),
  new Community({
    name: "y/math",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/math/mathMain.jpg"
  }),
  new Community({
    name: "y/medicine",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/medicine/medicineMain.jpg"
  }),
  new Community({
    name: "y/music",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/music/musicMain.jpg"
  }),
  new Community({
    name: "y/news",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/news/newsMain.jpg"
  }),
  new Community({
    name: "y/photography",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/photography/photographyMain.jpg"
  }),
  new Community({
    name: "y/physics",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/physics/physicsMain.jpg"
  }),
  new Community({
    name: "y/pictures",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/pictures/picturesMain.jpg"
  }),
  new Community({
    name: "y/politics",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/politics/politicsMain.jpg"
  }),
  new Community({
    name: "y/psychology",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/psychology/psychologyMain.jpg"
  }),
  new Community({
    name: "y/religion",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/religion/religionMain.jpg"
  }),
  new Community({
    name: "y/space",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/space/spaceMain.jpg"
  }),
  new Community({
    name: "y/sport",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/sport/sportMain.jpg"
  }),
  new Community({
    name: "y/tableGames",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/tableGames/tableGamesMain.jpg"
  }),
  new Community({
    name: "y/tech",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/tech/techMain.jpg"
  }),
  new Community({
    name: "y/traveling",
    amountOfSubscribers: 0,
    mainImagePath: "./img/communities/traveling/travelingMain.jpg"
  }),
];

let done = 0;
communities.forEach(community => {
  community.save((err, result) => {
    done++;
    if (done === communities.length) {
      exit();
    }
  });
});

function exit() {
  mongoose.disconnect();
}