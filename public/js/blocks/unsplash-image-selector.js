class UnsplashImageSelector extends Dispatcher {
  constructor({ unsplash }) {
    super();
    this.unsplash = unsplash;
    this.els = {};
    this.attachElements();
    this.addEventListeners();
  }

  addEventListeners() {
    this.els.selectimage.click(() => {
      console.log("js/blocks/unsplash-image-selector block click");
      //   this.dispatch("selectimage", {
      //     details: "abc"
      //   });
      const selector = `.carousel-inner > .carousel-item.active img`;
      console.log("carousel on click select selector", selector);
      const imgSrc = this.els.carousel.find(selector).attr("data-canvas-url");

      this.dispatch("selected", {
        unsplashId: this.els.carousel.find(selector).attr("alt"),
        sourceUrl: imgSrc
      });
    });
    this.els.imagescale.keyup(() => {
      this.dispatch("scaled", {
        scale: parseFloat(this.els.imagescale.val())
      });
    });
    this.els.carousel.on("slide.bs.carousel", evt => {
      const selector = `.carousel-inner > .carousel-item:nth-child(${evt.to +
        1}) img`;
      console.log("carousel on slide selector", selector);
      //   const imgSrc = this.els.carousel.find(selector).attr("data-canvas-url");
      const id = this.els.carousel.find(selector).attr("alt");
      this.els.imageid.attr("href", `https://unsplash.com/photos/${id}`);
      this.els.imageid.text(`${id}`);
    });

    this.els.search.keyup(evt => {
      if (evt.keyCode === 13) {
        this.reloadImages({ searchTerm: this.els.search.val() });
      }
    });
  }

  attachElements() {
    const containerEl = $("#collapseUnsplashImageSelector");

    this.els.selectimage = containerEl.find(
      "#unsplash-image-selector-selectimage"
    );
    this.els.imageid = containerEl.find(
      "#unsplash-image-selector-selectedimageid"
    );
    this.els.imagescale = containerEl.find(
      "#unsplash-image-selector-imagescale"
    );
    this.els.carousel = containerEl.find("#unsplash-image-selector-carousel");
    this.els.search = containerEl.find("#unsplash-image-selector-search");
  }

  // TODO add a callback or a promise so the firstImageLink can be reused in the main thread code
  async loadImages({
    fn = unsplash.getPhotos,
    fnParams = {},
    isDisplayed = true
  } = {}) {
    let photos = await fn(fnParams);
    // console.log("photos", photos);
    const html = photos.map(({ id, urls }, index) => {
      const div = document.createElement("div");
      const img = document.createElement("img");
      if (index === 0) {
        div.setAttribute("class", "carousel-item active");
      } else {
        div.setAttribute("class", "carousel-item");
      }
      img.setAttribute("class", "d-block w-100");
      img.setAttribute("src", urls.small);
      img.setAttribute("data-canvas-url", `${urls.raw}?q=100&w=2300`);
      img.setAttribute("alt", id);
      div.append(img);
      return div;
    });
    this.els.carousel.find(".carousel-inner").append(html);
    if (isDisplayed === true) {
      const firstImageLink = `${photos[0].urls.raw}?q=100&w=2300`;
      fabric.Image.fromURL(firstImageLink, img => {
        canvasObj["image"].setSrc(img.getSrc());
        canvasObj["image"].set("width", img.getScaledWidth());
        canvasObj["image"].set("height", img.getScaledHeight());
        // canvas.renderAll();
        sharedSettings.imageScale = null;
        console.log("unsplashImgSel#loadImages firstImageLink default");
        render({ imageScale: null });
      });
    }
    this.dispatch("loadedimages", { images: photos });
    // await loadImage(firstImageLink);
  }

  async reloadImages({ searchTerm }) {
    this.els.carousel.find(".carousel-inner").empty();
    await this.loadImages({
      fn: unsplash.searchPhotos,
      fnParams: { searchTerm },
      isDisplayed: false
    });
  }

  refreshScale({ scale }) {
    this.els.imagescale.val(scale);
  }
}
