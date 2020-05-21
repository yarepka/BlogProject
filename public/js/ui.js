class UI {
  static showForm(form) {
    if (form.classList.contains("no-display")) {
      // hide scrollbar
      if (!document.body.classList.contains("hide-scrollbar")) {
        document.body.classList.add("hide-scrollbar");
      }
      // unhide login form
      form.classList.remove("no-display");
    }
  }

  static hideForm(form) {
    if (!form.classList.contains("no-display")) {
      // hide form
      form.classList.add("no-display");

      // unhide scrollbar
      if (document.body.classList.contains("hide-scrollbar")) {
        document.body.classList.remove("hide-scrollbar");
      }
    }
  }

  // Show input error message
  static showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = "form-control error";
    const small = formControl.querySelector("small");
    small.innerText = message;
  }

  // Show success outline
  static showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = "form-control success";
  }

  // Deletes error and success message
  static cleanSubmitForm(inputs) {
    inputs.forEach(input => {
      const formControl = input.parentElement;
      if (formControl.classList.contains("error")) {
        formControl.classList.remove("error");
      }

      if (formControl.classList.contains("success")) {
        formControl.classList.remove("success");
      }

      input.value = "";
    });
  }

  static appendPosts(postsContainer, currentLayout, posts) {
    // loop through every posts
    posts.forEach((post, index) => {
      // create post wrapper element
      const postWrapper = document.createElement("div");

      // append classes to post wrapper
      postWrapper.className = `post-wrapper post-${currentLayout}`;

      postWrapper.innerHTML =
        `<div class="rating">
          <i class="fa fa-arrow-up"></i>
          <p class="rating-quantity">${post.rating}</p>
          <i class="fa fa-arrow-down"></i>
        </div>

        <div class="post-content">
          <div class="post-info">
            <p><a href="/community" class="community bold">${post.community}</a> Posted by <a
              href="/profile" class="posted-by">${post.postedBy}</span> </a> <span
              class="hours-ago">21
              hours ago</span>
          </div>

          <h3 class="post-title">${post.title}</h3>
          <img src="https://picsum.photos/700/700?random=${index}">

          <div class="comments">
            <a class="comments-link" href="/blog">
              <i class="fas fa-comment-alt"></i>
              <span class="comments-quantity">${post.commentsQuantity} Comments</span>
            </a>

            <p class="comments-quantity"></p>
          </div>
        </div>`;

      // append post to parent
      postsContainer.append(postWrapper);
    });
  }
}