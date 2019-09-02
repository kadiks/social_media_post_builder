class VideoAnimationEditor extends Dispatcher {
  constructor() {
    super();

    this.els = {};

    this.attachElements();
    this.addEventListeners();
    this.init();
  }

  addEventListeners() {
    this.els.addproperty.click(() => {
      //   console.log("this.els.addproperty.click");
      const tpl = this.getPropertyTemplate();
      this.els.propertyform.append(tpl);
      // this.dispatch("textsadd", { text });
    });
    this.els.transitionduration.keyup(() => {
      const duration = parseInt(this.els.transitionduration.val());

      this.dispatch("transitionduration", {
        duration
      });
    });
    this.els.propertyform.on("keyup", "input", ({ currentTarget }) => {
      const el = $(currentTarget);

      const index = this.els.propertyform
        .find(".property")
        .index(el.parents(".property"));

      const details = this.getDetailsByIndex({ index, isTransition: false });
      if (isNaN(details.start) === false && isNaN(details.end) === false) {
        this.dispatch("positionchange", {
          details
        });
      }
    });
    this.els.transitionpropertyform.on(
      "keyup",
      "input",
      ({ currentTarget }) => {
        const el = $(currentTarget);

        const index = this.els.transitionpropertyform
          .find(".property")
          .index(el.parents(".property"));

        const details = this.getDetailsByIndex({ index });
        if (isNaN(details.start) === false && isNaN(details.end) === false) {
          this.dispatch("transitionchange", { index, details });
        }
      }
    );
    this.els.transitionpropertyform.on(
      "change",
      "select",
      ({ currentTarget }) => {
        const el = $(currentTarget);

        const index = this.els.transitionpropertyform
          .find(".property")
          .index(el.parents(".property"));

        const details = this.getDetailsByIndex({ index });

        if (isNaN(details.start) === false && isNaN(details.end) === false) {
          this.dispatch("transitionchange", { index, details });
        }
      }
    );
    this.els.delay.keyup(() => {
      const delay = parseInt(this.els.delay.val());

      this.dispatch("delaychange", { delay });
    });
    this.els.duration.keyup(() => {
      const duration = parseInt(this.els.duration.val());

      this.dispatch("durationchange", { duration });
    });
    this.els.easing.change(() => {
      const easing = this.els.easing.val();

      this.dispatch("easingchange", { easing });
    });
  }

  attachElements() {
    const containerEl = $("#collapseVideoAnimationEditor");

    this.els.propertyform = containerEl.find("#video-animation-propertyform");
    this.els.duration = containerEl.find("#video-animation-duration");
    this.els.easing = containerEl.find("#video-animation-easing");
    this.els.delay = containerEl.find("#video-animation-delay");

    this.els.addproperty = containerEl.find(
      "#video-animation-transitionaddproperty"
    );
    this.els.transitionpropertyform = containerEl.find(
      "#video-animation-transitionpropertyform"
    );
    this.els.transitionduration = containerEl.find(
      "#video-animation-transitionduration"
    );
  }

  clean() {
    this.els.transitionpropertyform.empty();
  }

  getDetailsByIndex({ index, isTransition = true }) {
    const details = {};

    const elName = isTransition ? "transitionpropertyform" : "propertyform";

    const el = $(this.els[elName].find(".property")[index]);

    details.property = el.find("select").val();
    details.start = parseFloat(el.find("input.start").val());
    details.end = parseFloat(el.find("input.end").val());

    console.log("VideoTransitionEditor#getDetailsByIndex details", details);

    return details;
  }

  getPropertyTemplate({ property = null, start = null, end = null } = {}) {
    const propertyName = property;
    const properties = ["x", "y", "opacity"];

    const rowEl = document.createElement("div");
    const colPropertyEl = document.createElement("div");
    const colStartEl = document.createElement("div");
    const colEndEl = document.createElement("div");
    const propertyListEl = document.createElement("select");
    const inputStartEl = document.createElement("input");
    const inputEndEl = document.createElement("input");

    rowEl.setAttribute("class", "row property");
    colPropertyEl.setAttribute("class", "col-4");
    colStartEl.setAttribute("class", "col-4");
    colEndEl.setAttribute("class", "col-4");
    inputStartEl.setAttribute("type", "text");
    inputStartEl.setAttribute("class", "form-control start");
    inputEndEl.setAttribute("type", "text");
    inputEndEl.setAttribute("class", "form-control end");

    if (start !== null) {
      inputStartEl.setAttribute("value", start);
    }
    if (end !== null) {
      inputEndEl.setAttribute("value", end);
    }

    properties.forEach(property => {
      const propertyEl = document.createElement("option");
      propertyEl.setAttribute("value", property);
      propertyEl.textContent = property;
      if (propertyName !== null) {
        propertyEl.setAttribute("selected", true);
      }
      propertyListEl.append(propertyEl);
    });

    colPropertyEl.append(propertyListEl);
    colStartEl.append(inputStartEl);
    colEndEl.append(inputEndEl);

    rowEl.append(colPropertyEl, colStartEl, colEndEl);

    return rowEl;
  }

  init() {
    const easings = Object.keys(fabric.util.ease);
    const easingOptionEls = easings.map(easing => {
      const optionEl = document.createElement("option");
      optionEl.setAttribute("value", easing);
      optionEl.textContent = easing;
      return optionEl;
    });
    this.els.easing.append(easingOptionEls);
  }

  refreshDelay({ delay }) {
    this.els.delay.val(delay);
  }

  refreshDuration({ duration }) {
    this.els.duration.val(duration);
  }

  refreshEasing({ easing }) {
    this.els.easing.val(easing);
  }

  refreshPosition({ position }) {
    const startKeys = Object.keys(position.start);

    const properties = startKeys.map(startKey => {
      return {
        property: startKey,
        start: position.start[startKey],
        end: position.end[startKey]
      };
    });

    console.log("VideoAnimationEditor#refreshPosition properties", properties);

    properties.forEach(({ property, start, end }) => {
      const index = property === "left" ? 0 : 1;
      const line = $(this.els.propertyform.find(".property")[index]);
      line.find("input.start").val(start);
      line.find("input.end").val(end);
    });
    // this.els.propertyform.find('.property:nth-child()')(propertyEls);
  }

  refreshProperties({ details }) {
    // console.log(
    //   "VideoTransitionEditor#refreshProperties transitionDetails",
    //   details
    // );

    this.clean();

    const startKeys = Object.keys(details.start);
    // const endKeys = Object.keys(details.end);

    const properties = startKeys.map(startKey => {
      return {
        property: startKey,
        start: details.start[startKey],
        end: details.end[startKey]
      };
    });

    // console.log(
    //   "VideoTransitionEditor#refreshProperties properties",
    //   properties
    // );

    const propertyEls = properties.map(property => {
      return this.getPropertyTemplate(property);
    });

    this.els.transitionpropertyform.append(propertyEls);
  }

  refreshTransitionDuration({ duration }) {
    // console.log("VideoTransitionEditor#refreshDuration duration", duration);
    this.els.transitionduration.val(duration);
  }
}
