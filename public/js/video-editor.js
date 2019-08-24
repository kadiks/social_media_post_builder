$(async () => {
  let unplash = null;
  let dataEl = null;
  let photos = null;
  let canvasEl = null;
  const slides = [];
  let curSlide = null;
  const els = {
    videoplay: $("#video-play"),
    addslide: $("#video-add-slide"),
    videonav: $("#video-nav")
  };

  const slideDefault = {
    image: {
      details: {
        x: -900,
        y: 0,
        scale: 0.75,
        source:
          "https://images.unsplash.com/photo-1473172707857-f9e276582ab6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2350&q=100"
      },
      animation: {
        master: {
          delay: 0,
          options: {
            duration: 10000,
            easing: "easeOutQuad"
          }
        },
        start: {
          left: -900
        },
        end: {
          left: -600
        }
      }
    },
    texts: {
      master: {
        fontFamily: "Montserrat",
        fontWeight: "bold",
        fontSize: 70,
        fill: "#FFF",
        opacity: 0
      },
      group: {
        top: 1100,
        left: 10
      },
      animation: {
        master: {
          delay: 250,
          options: {
            easing: "easeOutQuad",
            duration: 1000
          }
        },
        start: {
          opacity: 0,
          left: 0
        },
        end: {
          opacity: 1,
          left: 10
        }
      },
      contents: [
        {
          text: "Your",
          relativeTop: 0
        },
        {
          text: "Text",
          relativeTop: 90
        },
        {
          text: "Here",
          relativeTop: 180
        }
      ]
    }
  };

  const CANVAS_SCREEN_WIDTH = 400;
  const CANVAS_SCREEN_HEIGHT = 500;
  const canvas = {
    els: {},
    screen: {
      width: CANVAS_SCREEN_WIDTH,
      height: CANVAS_SCREEN_HEIGHT
    },
    dim: {
      width: CANVAS_SCREEN_WIDTH * 3,
      height: CANVAS_SCREEN_HEIGHT * 3
    }
  };

  const addEventListeners = () => {
    els.videoplay.click(() => {
      playSlide({ slide: curSlide });
    });
    els.addslide.click(() => {
      addSlide({ index: slides.length });
    });
  };

  const addSlide = async ({ index = 0, slide = slideDefault } = {}) => {
    const image = await getSlideImage({ opts: slide.image });
    const texts = await getSlideTexts({ opts: slide.texts });
    const animations = await getSlideAnimations({
      opts: slide
    });

    // console.log("#addSlide texts", texts);

    emptyScene();

    canvasEl.add(image);
    canvasEl.add(texts);

    const fullSlide = {
      slide,
      animations
    };

    slides.splice(index, 0, fullSlide);

    refreshSlidesCounter({ num: index + 1, total: index + 1 });

    return fullSlide;
  };

  const drawScene = () => {
    fabric.devicePixelRatio = 2;

    canvasEl.setWidth(canvas.screen.width);
    canvasEl.setHeight(canvas.screen.height);

    canvasEl.setZoom(canvas.screen.width / canvas.dim.width);
  };

  const emptyScene = () => {
    canvasEl.getObjects().forEach(object => {
      canvasEl.remove(object);
    });
  };

  const getSlideAnimations = async ({ opts }) => {
    const animations = {};
    animations.image = await getImageAnimation({ opts: opts.image });
    animations.texts = await getTextAnimations({ opts: opts.texts });
    return animations;
  };

  const getSlideImage = async ({ opts }) => {
    const image = await fabricUtils.loadProxyImage({
      url: opts.details.source
    });
    // console.log("#getSlideImage image", image);
    image.set({
      top: opts.details.y,
      left: opts.details.x
    });
    image.scale(opts.details.scale);
    return image;
  };

  const getSlideTexts = ({ opts }) => {
    const group = new fabric.Group([]);

    const texts = opts.contents.map(content => {
      const text = new fabric.IText(content.text, {
        ...opts.master,
        top: content.relativeTop
      });
      return text;
    });

    texts.forEach(text => {
      group.addWithUpdate(text);
    });

    group.set({
      top: opts.group.top,
      left: opts.group.left
    });
    return group;
  };

  const getImageAnimation = async ({ opts }) => {
    const values = opts.animation.end;
    const options = opts.animation.master.options;
    const delay = opts.animation.master.delay;
    return {
      values,
      options: {
        duration: options.duration,
        easing: options.easing ? fabric.util.ease[options.easing] : null
      },
      delay
    };
  };

  const getTextAnimations = async ({ opts }) => {
    return opts.contents.map((content, index) => {
      //   console.log("#getTextAnimations opts", opts);
      const options = opts.animation.master.options;
      const values = opts.animation.end;
      return {
        values,
        options: {
          duration: options.duration,
          easing: options.easing ? fabric.util.ease[options.easing] : null
        },
        delay: opts.animation.master.delay * index + 3000
      };
    });
  };

  const init = () => {
    canvasEl = new fabric.Canvas("canvas", {
      preserveObjectStacking: true
    });
    dataEl = $("#data");
    unsplash = new Unsplash({ apiKey: dataEl.attr("data-unsplash-api-key") });
    unsplashImageSelector = new UnsplashImageSelector({ unsplash });
    unsplashImageSelector.loadImages({ isDisplayed: false });
  };

  const playSlide = ({ slide }) => {
    const imageAnim = slide.animations.image;
    // console.log("#video-play onclick imageAnim", imageAnim);
    setTimeout(() => {
      canvasEl.getObjects("image")[0].animate(imageAnim.values, {
        ...imageAnim.options,
        onChange: canvasEl.renderAll.bind(canvasEl)
      });
    }, imageAnim.delay);

    canvasEl
      .getObjects("group")[0]
      .getObjects()
      .forEach((text, index) => {
        const animation = slide.animations.texts[index];
        // console.log("#video-play onclick curSlide", curSlide);
        //   console.log("#video-play onclick text", text);
        //   console.log("#video-play onclick animation", animation);
        setTimeout(() => {
          text.animate(animation.values, {
            ...animation.options,
            onChange: canvasEl.renderAll.bind(canvasEl)
          });
        }, animation.delay);
      });
  };

  const render = () => {
    canvasEl.renderAll();
  };

  const refreshSlidesCounter = ({ num, total }) => {
    els.videonav.text(`${num} / ${total}`);
  };

  init();
  drawScene();
  addEventListeners();
  curSlide = await addSlide();
  render();
});
