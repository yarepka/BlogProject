class UI {
  showForm(form) {
    if (form.classList.contains("no-display")) {
      // hide scrollbar
      if (!document.body.classList.contains("hide-scrollbar")) {
        document.body.classList.add("hide-scrollbar");
      }
      // unhide login form
      form.classList.remove("no-display");
    }
  }

  hideForm(form) {
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
  showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = "form-control error";
    const small = formControl.querySelector("small");
    small.innerText = message;
  }

  // Show success outline
  showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = "form-control success";
  }
}