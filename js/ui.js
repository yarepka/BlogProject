class UI {

  showForm(form) {
    console.log(">>>FORM: ", form.id);
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
}