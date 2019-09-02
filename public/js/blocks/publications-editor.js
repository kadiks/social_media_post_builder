class PublicationsEditor extends Dispatcher {
  constructor({ platforms }) {
    super();

    this.els = {};
    this.platforms = [];
    this.setPlatforms({ platforms });

    this.attachElements();
    this.addEventListeners();
  }

  attachElements() {
    this.els.container = $("#publications");
    this.els.addnew = $("#publications-addnew");
  }

  addEventListeners() {
    this.els.addnew.click(() => {
      const tpl = this.getTemplate();
      this.els.container.append(tpl);
    });
    this.els.container.on("click", "button", ({ currentTarget }) => {
      const el = $(currentTarget);
      const index = this.els.container
        .find(".form-group")
        .index(el.parents(".form-group"));

      $(this.els.container.find(".form-group")[index]).remove();
      this.dispatch("remove", { index });
    });
  }

  getTemplate() {
    const container = document.createElement("div");
    const listPlatforms = document.createElement("select");
    const listLanguages = document.createElement("select");
    const date = document.createElement("input");
    const btn = document.createElement("button");

    container.setAttribute("class", "form-group");
    date.setAttribute("type", "datetime-local");
    date.setAttribute("class", "form-control");
    btn.setAttribute("class", "btn btn-primary");

    this.platforms.forEach(p => {
      const opts = document.createElement("option");
      opts.setAttribute("value", p);
      opts.text = p;
      listPlatforms.appendChild(opts);
    });
    ["en", "fr", "es"].forEach(p => {
      const opts = document.createElement("option");
      opts.setAttribute("value", p);
      opts.text = p;
      listLanguages.appendChild(opts);
    });

    // listPlatforms.append(platformEls);
    // listLanguages.append(languageEls);

    container.append(listPlatforms, listLanguages, date);

    return container;
  }

  setPlatforms({ platforms }) {
    this.platforms = platforms;
  }
}
