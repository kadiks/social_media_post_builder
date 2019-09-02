class VideoTextEditor extends Dispatcher {
  constructor() {
    super();

    this.els = {};

    this.attachElements();
    this.addEventListeners();
    this.init();
  }

  addEventListeners() {
    this.els.mastereasing.change(() => {});
    this.els.alignmentButtons.click(evt => {
      //   console.log(
      //     " >> VideoTextEditor#addEventListeners alignmentButtons.click"
      //   );
      const alignment = $(evt.currentTarget)
        .attr("id")
        .replace("video-text-align", "");
      this.refreshAlignment({
        alignment
      });
    });
    this.els.textforms.on("click", "button", ({ currentTarget }) => {
      const el = $(currentTarget);
      const index = this.els.textforms
        .find(".form-group")
        .index(el.parents(".text-form"));

      this.els.textforms.find(".text-form")[index].remove();

      this.dispatch("textsremove", { index });
    });
    this.els.textforms.on("keyup", "input", ({ currentTarget }) => {
      //   console.log(">> VideoTextEditor#addEventListeners textforms.keyup");
      //   console.log(
      //     "VideoTextEditor#addEventListeners textforms.keyup currentTarget",
      //     currentTarget
      //   );
      const el = $(currentTarget);
      const text = el.val();
      const index = this.els.textforms
        .find(".form-group")
        .index(el.parents(".text-form"));

      this.dispatch("textschange", {
        text,
        index
      });
    });
    this.els.addtextform.click(() => {
      const text = "New Text";
      const tpl = this.getTextFormTemplate({ value: text });
      this.els.textforms.append(tpl);
      this.dispatch("textsadd", { text });
    });
  }

  attachElements() {
    const containerEl = $("#collapseVideoTextEditor");

    this.els.alignmentButtons = containerEl.find("button.alignment");

    this.els.alignleft = containerEl.find("#video-text-alignleft");
    this.els.aligncenter = containerEl.find("#video-text-aligncenter");
    this.els.alignright = containerEl.find("#video-text-alignright");
    this.els.textforms = containerEl.find("#video-text-textforms");
    this.els.addtextform = containerEl.find("#video-text-addtextform");
    this.els.masterdelaybetween = containerEl.find(
      "#video-text-masterdelaybetween"
    );
    this.els.masterdelaystart = containerEl.find(
      "#video-text-masterdelaystart"
    );
    this.els.mastereasing = containerEl.find("#video-text-mastereasing");
    this.els.masterduration = containerEl.find("#video-text-masterduration");
  }

  clean() {
    this.els.textforms.empty();
  }

  getTextFormTemplate({ value = "" }) {
    const form = document.createElement("div");
    form.setAttribute("class", "form-group text-form");
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("class", "form-control");
    input.setAttribute("value", value);
    const buttonContainer = document.createElement("div");
    buttonContainer.setAttribute("class", "text-right");
    const button = document.createElement("button");
    button.setAttribute("class", "btn btn-primary");
    button.setAttribute("type", "button");
    button.textContent = "Remove";

    buttonContainer.appendChild(button);
    form.appendChild(input);
    form.appendChild(buttonContainer);

    return form;
  }

  init() {
    const easings = Object.keys(fabric.util.ease);
    const easingOptionEls = easings.map(easing => {
      const optionEl = document.createElement("option");
      optionEl.setAttribute("value", easing);
      optionEl.textContent = easing;
      return optionEl;
    });
    this.els.mastereasing.append(easingOptionEls);
  }

  refreshAlignment({ alignment }) {
    // console.log(">> VideoTextEditor#refreshAlignment");
    this.els.alignmentButtons.removeClass("btn-secondary");
    let el = "alignleft";
    if (alignment === "right") {
      el = "alignright";
    }
    if (alignment === "center") {
      el = "aligncenter";
    }
    this.els[el].addClass("btn-secondary");
  }

  refreshContents({ contents = [] }) {
    this.clean();
    // console.log("VideoTextEditor#refreshContents contents", contents);
    const textEls = contents.map(content => {
      return this.getTextFormTemplate({ value: content.text });
    });
    // console.log("VideoTextEditor#refreshContents textEls", textEls);

    this.els.textforms.append(textEls);
  }

  refreshDelayBetween({ delayBetween }) {
    this.els.masterdelaybetween.val(delayBetween);
  }
  refreshDelayStart({ delayStart }) {
    this.els.masterdelaystart.val(delayStart);
  }
  refreshDuration({ duration }) {
    this.els.masterduration.val(duration);
  }

  // TODO add a check to be sure it's an easing value or turn it to null if not (so it becomes linear)
  refreshEasing({ easing }) {
    this.els.mastereasing.val(easing);
  }
}
