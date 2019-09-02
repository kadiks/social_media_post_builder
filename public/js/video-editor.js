$(async () => {
  let unplash = null;
  let unsplashImageSelector = null;
  let videoTextEditor = null;
  let dataEl = null;
  let photos = null;
  let canvasEl = null;
  const slides = [];
  let rec = null;
  //   const slides = JSON.parse(
  //     '[{"slide":{"image":{"details":{"x":-900,"y":0,"scale":0.75,"source":"https://images.unsplash.com/photo-1473172707857-f9e276582ab6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2350&q=100"},"animation":{"master":{"delay":0,"options":{"duration":10000,"easing":"easeOutQuad"}},"transition":{"start":{"opacity":0},"end":{"opacity":1},"duration":1000},"start":{"left":-900},"end":{"left":-600}}},"texts":{"master":{"fontFamily":"Montserrat","fontWeight":"bold","fontSize":70,"fill":"#FFF","opacity":1,"textAlign":"left"},"group":{"top":1100,"left":0},"animation":{"master":{"delayStart":2000,"delayBetween":250,"options":{"easing":"easeOutQuad","duration":1000}},"start":{"opacity":0,"left":0},"end":{"opacity":1,"left":20}},"contents":[{"text":"Y","relativeTop":0},{"text":"Text","relativeTop":90},{"text":"Here","relativeTop":180}]}},"animations":{"image":{"start":{"left":-900},"transition":{"start":{"opacity":0},"end":{"opacity":1},"duration":1000},"values":{"left":-600},"options":{"duration":10000},"delay":0},"texts":[{"start":{"opacity":0,"left":0},"values":{"opacity":1,"left":20},"options":{"duration":1000},"delay":2000},{"start":{"opacity":0,"left":0},"values":{"opacity":1,"left":20},"options":{"duration":1000},"delay":2250},{"start":{"opacity":0,"left":0},"values":{"opacity":1,"left":20},"options":{"duration":1000},"delay":2500}]}},{"slide":{"image":{"details":{"x":-900,"y":0,"scale":0.75,"source":"https://images.unsplash.com/photo-1473172707857-f9e276582ab6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2350&q=100"},"animation":{"master":{"delay":0,"options":{"duration":10000,"easing":"easeOutQuad"}},"transition":{"start":{"opacity":0},"end":{"opacity":1},"duration":1000},"start":{"left":-900},"end":{"left":-600}}},"texts":{"master":{"fontFamily":"Montserrat","fontWeight":"bold","fontSize":70,"fill":"#FFF","opacity":1,"textAlign":"left"},"group":{"top":1100,"left":0},"animation":{"master":{"delayStart":2000,"delayBetween":250,"options":{"easing":"easeOutQuad","duration":1000}},"start":{"opacity":0,"left":0},"end":{"opacity":1,"left":20}},"contents":[{"text":"Yo","relativeTop":0},{"text":"Text","relativeTop":90},{"text":"Here","relativeTop":180}]}},"animations":{"image":{"start":{"left":-900},"transition":{"start":{"opacity":0},"end":{"opacity":1},"duration":1000},"values":{"left":-600},"options":{"duration":10000},"delay":0},"texts":[{"start":{"opacity":0,"left":0},"values":{"opacity":1,"left":20},"options":{"duration":1000},"delay":2000},{"start":{"opacity":0,"left":0},"values":{"opacity":1,"left":20},"options":{"duration":1000},"delay":2250},{"start":{"opacity":0,"left":0},"values":{"opacity":1,"left":20},"options":{"duration":1000},"delay":2500}]}},{"slide":{"image":{"details":{"x":-900,"y":0,"scale":0.75,"source":"https://images.unsplash.com/photo-1473172707857-f9e276582ab6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2350&q=100"},"animation":{"master":{"delay":0,"options":{"duration":10000,"easing":"easeOutQuad"}},"transition":{"start":{"opacity":0},"end":{"opacity":1},"duration":1000},"start":{"left":-900},"end":{"left":-600}}},"texts":{"master":{"fontFamily":"Montserrat","fontWeight":"bold","fontSize":70,"fill":"#FFF","opacity":1,"textAlign":"left"},"group":{"top":1100,"left":0},"animation":{"master":{"delayStart":2000,"delayBetween":250,"options":{"easing":"easeOutQuad","duration":1000}},"start":{"opacity":0,"left":0},"end":{"opacity":1,"left":20}},"contents":[{"text":"You","relativeTop":0},{"text":"Text","relativeTop":90},{"text":"Here","relativeTop":180}]}},"animations":{"image":{"start":{"left":-900},"transition":{"start":{"opacity":0},"end":{"opacity":1},"duration":1000},"values":{"left":-600},"options":{"duration":10000},"delay":0},"texts":[{"start":{"opacity":0,"left":0},"values":{"opacity":1,"left":20},"options":{"duration":1000},"delay":2000},{"start":{"opacity":0,"left":0},"values":{"opacity":1,"left":20},"options":{"duration":1000},"delay":2250},{"start":{"opacity":0,"left":0},"values":{"opacity":1,"left":20},"options":{"duration":1000},"delay":2500}]}}]'
  //   );
  let curSlideIndex = 0;
  let curSlide = null;
  const chainTransitionDelay = 500;
  const els = {
    videoplay: $("#video-play"),
    addslide: $("#video-add-slide"),
    videonav: $("#video-nav"),
    videonavnext: $("#video-nav-next"),
    videonavprev: $("#video-nav-prev"),
    videoplayall: $("#video-play-all"),
    video: null,
    submit: $("#submit"),
    exportlink: $("#exportlink")
  };

  window.canvasEl = canvasEl;
  window.slides = slides;
  window.curSlide = curSlide;

  const slideDefault = {
    image: {
      details: {
        left: -900,
        top: 0,
        scale: 1,
        source:
          //   "https://images.unsplash.com/photo-1473172707857-f9e276582ab6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2350&q=100"
          "http://localhost:3000/img/testphoto.jpeg"
      },
      animation: {
        master: {
          delay: 0,
          options: {
            duration: 10000,
            easing: "easeOutQuad"
          }
        },
        transition: {
          start: {
            opacity: 0
          },
          end: {
            opacity: 1
          },
          duration: 500
        },
        start: {
          left: -900,
          top: 0
        },
        end: {
          left: -600,
          top: 0
        }
      }
    },
    texts: {
      master: {
        fontFamily: "Montserrat",
        fontWeight: "bold",
        fontSize: 70,
        fill: "#FFF",
        opacity: 1,
        textAlign: "left"
      },
      group: {
        top: 1100,
        left: 0
      },
      animation: {
        master: {
          delayStart: 2000,
          delayBetween: 500,
          options: {
            easing: "easeOutQuad",
            duration: 1500
          }
        },
        start: {
          opacity: 0,
          left: 0
        },
        end: {
          opacity: 1,
          left: 20
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
          relativeTop: 90
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

  const addCanvasEventListeners = () => {
    canvas.els.image.on("moved", evt => {
      const { x, y } = evt.target.aCoords.tl;
      curSlide.slide.image.details.left = x;
      curSlide.slide.image.details.top = y;
      curSlide.slide.image.animation.start.left = x;
      curSlide.slide.image.animation.start.top = y;
      videoAnimationEditor.refreshPosition({
        position: curSlide.slide.image.animation
      });
    });
  };

  const addEventListeners = () => {
    els.videoplay.click(() => {
      playSlide({ index: 0, slide: curSlide });
    });
    els.addslide.click(() => {
      addSlide({ index: slides.length });
    });
    els.videoplayall.click(() => {
      playAllSlides({ slides });
    });
    els.submit.click(() => {
      els.video = document.createElement("video");
      els.exportlink.parent().append(els.video);
      startRecording();
      playAllSlides({ slides });
    });
    videoTextEditor.on("textschange", ({ text, index }) => {
      //   console.log("#addEventListeners on textschange text", text);
      //   console.log("#addEventListeners on textschange index", index);
      updateSlideChangeText({
        index,
        text
      });
    });
    videoTextEditor.on("textsremove", ({ index }) => {
      //   console.log("#addEventListeners on textschange text", text);
      console.log("#addEventListeners on textschange index", index);
      updateSlideRemoveText({
        index
      });
      // updateSlideText({
      //   index,
      //   text
      // });
    });
    videoTextEditor.on("textsadd", ({ text }) => {
      //   console.log("#addEventListeners on textschange text", text);
      console.log("#addEventListeners on textsadd text", text);
      updateSlideAddText({ text });
    });
    videoAnimationEditor.on("transitionduration", ({ duration }) => {
      // console.log(
      //   "videoTransitionEditor.on transitionduration curSlide",
      //   curSlide
      // );
      curSlide.slide.image.animation.transition.duration = duration;
    });
    videoAnimationEditor.on("delaychange", ({ delay }) => {
      curSlide.slide.image.animation.delay = delay;
    });
    videoAnimationEditor.on("durationchange", ({ duration }) => {
      curSlide.slide.image.animation.master.options.duration = duration;
    });
    videoAnimationEditor.on("easingchange", ({ easing }) => {
      curSlide.slide.image.animation.master.options.easing = easing;
    });
    videoAnimationEditor.on("positionchange", ({ details }) => {
      // console.log("videoAnimationEditor on positionchange details", details);
      curSlide.slide.image.details[details.property] = details.start;
      curSlide.slide.image.animation.start[details.property] = details.start;
      curSlide.slide.image.animation.end[details.property] = details.end;
    });
    els.videonavprev.click(() => {
      // console.log(">> #addEventListeners els.videonavprev.click");
      const index = curSlideIndex - 1;
      changeSlide({ index, slide: slides[index].slide });
    });
    els.videonavnext.click(() => {
      // console.log(">> #addEventListeners els.videonavnext.click");
      const index = curSlideIndex + 1;
      changeSlide({ index, slide: slides[index].slide });
    });
    unsplashImageSelector.on("scaled", ({ scale }) => {
      getCurSlideImage().scale(scale);
      curSlide.slide.image.details.scale = scale;
      // refreshImageScale({ scale });
      render();
    });

    unsplashImageSelector.on("selected", async ({ sourceUrl }) => {
      console.log(">> video-editor.js unsplashImgSel#onSelected");
      //   const img = await fabricUtils.loadProxyImage({ url: sourceUrl });
      curSlide.slide.image.details.source = sourceUrl;

      const img = await fabricUtils.loadImage({ url: sourceUrl });
      const image = getCurSlideImage();
      canvas.els.image = image;
      image.setSrc(img.getSrc());
      image.set({
        width: img.getScaledWidth(),
        height: img.getScaledHeight()
      });
      console.log("image", image);
      unsplashImageSelector.refreshScale({ scale: image.scaleX });
      render();
    });
    addCanvasEventListeners();
  };

  const addSlide = async ({
    index = 0,
    slide = JSON.parse(JSON.stringify(slideDefault))
  } = {}) => {
    const fullSlide = await changeSlide({ index, slide });

    slides.splice(index, 0, fullSlide);

    return fullSlide;
  };

  const changeSlide = async ({ index, slide }) => {
    curSlideIndex = index;

    emptyScene();

    await drawSlide({ slide });

    const animations = getSlideAnimations({
      opts: slide
    });

    const fullSlide = {
      slide,
      animations
    };

    refreshSlidesCounter({ num: index + 1, total: index + 1 });
    videoTextEditor.refreshAlignment({
      alignment: slide.texts.master.textAlign
    });
    videoTextEditor.refreshDelayBetween({
      delayBetween: slide.texts.animation.master.delayBetween
    });
    videoTextEditor.refreshDelayStart({
      delayStart: slide.texts.animation.master.delayStart
    });
    videoTextEditor.refreshEasing({
      easing: slide.texts.animation.master.options.easing
    });
    videoTextEditor.refreshDuration({
      duration: slide.texts.animation.master.options.duration
    });
    videoTextEditor.refreshContents({
      contents: slide.texts.contents
    });
    videoAnimationEditor.refreshTransitionDuration({
      duration: slide.image.animation.transition.duration
    });
    videoAnimationEditor.refreshProperties({
      details: slide.image.animation.transition
    });
    videoAnimationEditor.refreshDuration({
      duration: slide.image.animation.master.options.duration
    });
    videoAnimationEditor.refreshEasing({
      easing: slide.image.animation.master.options.easing
    });
    videoAnimationEditor.refreshDelay({
      delay: slide.image.animation.master.delay
    });
    videoAnimationEditor.refreshPosition({
      position: slide.image.animation
    });
    unsplashImageSelector.refreshScale({
      scale: slide.image.details.scale
    });

    curSlide = fullSlide;

    return fullSlide;
  };

  const drawAllSlides = async ({ slides }) => {
    for (const slide of slides) {
      await drawSlide({ slide: slide.slide });
    }
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

  const drawSlide = async ({ slide }) => {
    const image = await getSlideImage({ opts: slide.image });
    const texts = await getSlideTexts({ opts: slide.texts });

    // console.log("#addSlide texts", texts);

    canvas.els.image = image;

    addCanvasEventListeners();

    canvasEl.add(image);
    canvasEl.add(texts);
  };

  const getSlideAnimations = ({ opts, slideDelay = 0 }) => {
    const animations = {};
    animations.image = getImageAnimation({
      opts: opts.image,
      slideDelay
    });
    animations.texts = getTextAnimations({
      opts: opts.texts,
      slideDelay
    });
    return animations;
  };

  const getSlideImage = async ({ opts }) => {
    // const image = await fabricUtils.loadProxyImage({
    //   url: opts.details.source
    // });
    const image = await fabricUtils.loadImage({
      url: opts.details.source
    });
    // console.log("#getSlideImage image", image);
    image.set({
      top: opts.details.top,
      left: opts.details.left
    });
    image.scale(opts.details.scale);
    return image;
  };

  const getCurSlideImage = () => {
    // return canvasEl.getObjects("image")[curSlideIndex];
    return getSlideImageByIndex({ index: curSlideIndex });
  };

  const getCurSlideTexts = () => {
    // return canvasEl.getObjects("group")[curSlideIndex];
    return getSlideTextsByIndex({ index: curSlideIndex });
  };

  const getSlideImageByIndex = ({ index }) => {
    // console.log("#getSlideImageByIndex index", index);
    // console.log(
    //   "#getSlideImageByIndex canvasEl.getObjects(image)",
    //   canvasEl.getObjects("image")
    // );
    const image = canvasEl.getObjects("image")[index];
    // console.log("#getSlideImageByIndex image", image);
    return image;
  };
  const getSlideTextsByIndex = ({ index }) => {
    return canvasEl.getObjects("group")[index];
  };

  const getCurSlideTextByIndex = ({ index } = {}) => {
    return getCurSlideTexts().getObjects()[index];
  };

  const getImageAnimation = ({ opts, slideDelay }) => {
    const values = opts.animation.end;
    const options = opts.animation.master.options;
    const delay = opts.animation.master.delay + slideDelay;
    return {
      start: {
        ...opts.animation.start
      },
      transition: opts.animation.transition,
      values,
      options: {
        duration: options.duration,
        easing: options.easing ? fabric.util.ease[options.easing] : null
      },
      delay
    };
  };

  const getSlideTexts = ({ opts }) => {
    const group = new fabric.Group([], {
      width: canvas.dim.width
    });

    setSlideTexts({ group, opts });

    return group;
  };

  const getTextAnimations = ({ opts, slideDelay }) => {
    return opts.contents.map((content, index) => {
      //   console.log("#getTextAnimations opts", opts);
      const options = opts.animation.master.options;
      const values = opts.animation.end;
      return {
        start: {
          ...opts.animation.start
        },
        values,
        options: {
          duration: options.duration,
          easing: options.easing ? fabric.util.ease[options.easing] : null
        },
        delay:
          opts.animation.master.delayBetween * index +
          opts.animation.master.delayStart +
          slideDelay
      };
    });
  };

  const init = () => {
    canvasEl = new fabric.Canvas("canvas", {
      preserveObjectStacking: true
    });
    window.canvasEl = canvasEl;
    dataEl = $("#data");
    unsplash = new Unsplash({ apiKey: dataEl.attr("data-unsplash-api-key") });
    unsplashImageSelector = new UnsplashImageSelector({ unsplash });
    videoTextEditor = new VideoTextEditor();
    videoAnimationEditor = new VideoAnimationEditor();

    unsplashImageSelector.loadImages({ isDisplayed: false });
  };

  const playAllSlides = async ({ slides }) => {
    emptyScene();
    await drawAllSlides({ slides });
    // console.log("canvasEl.getObjects", canvasEl.getObjects());
    setSlidesAnimations({ slides });
    const buffering = 500;
    slides.forEach((slide, index) => {
      playSlide({ index, slide, buffering });
    });
  };

  const playSlide = ({ index, slide, buffering = 0 }) => {
    console.log("#playSlide slide", slide);
    slide.animations = getSlideAnimations({ opts: slide.slide });
    const imageAnim = slide.animations.image;
    // console.log("#video-play onclick imageAnim", imageAnim);

    if (index === 0) {
      imageAnim.transition.start = {};
    }

    const imageObj = getSlideImageByIndex({ index });
    imageObj.set({
      ...imageAnim.start,
      ...imageAnim.transition.start
    });
    setTimeout(() => {
      imageObj.animate(
        { ...imageAnim.values },
        {
          ...imageAnim.options,
          onChange: canvasEl.renderAll.bind(canvasEl),
          onComplete:
            index === slides.length - 1
              ? () => {
                  //   console.log("last slide played rec.isPlaying", rec.isPlaying);
                  //   console.log(
                  //     "last slide played rec.isPlaying()",
                  //     rec.isPlaying()
                  //   );
                  //   console.log("last slide played rec", rec);
                  //   console.log("last slide played rec.paused", rec.paused);
                  //   if (rec.isPlaying === true) {
                  if (rec !== null) {
                    rec.stop();
                  }
                  //   }
                }
              : () => {}
        }
      );
      imageObj.animate(
        {
          ...imageAnim.transition.end
        },
        {
          duration: imageAnim.transition.duration,
          onChange: canvasEl.renderAll.bind(canvasEl)
        }
      );
    }, imageAnim.delay);

    // const textsObj = getCurSlideTexts();
    getSlideTextsByIndex({ index })
      .getObjects()
      .forEach((text, index) => {
        const animation = slide.animations.texts[index];
        text.set({
          ...animation.start
        });
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

  const refreshImageScale = ({ scale }) => {
    unsplashImageSelector.refreshScale(scale);
  };

  const refreshSlidesCounter = ({ num, total }) => {
    els.videonav.text(`${num} / ${total}`);
  };

  const setSlidesAnimations = ({ slides }) => {
    let slideDelayTotal = 0;
    slides.forEach(({ slide }, index) => {
      const animations = getSlideAnimations({
        opts: slide,
        slideDelay: slideDelayTotal
      });
      //   console.log("#setSlidesAnimations forEach animations", animations);
      const slideTotalDuration =
        animations.image.options.duration - chainTransitionDelay;
      slideDelayTotal += slideTotalDuration;
      slides[index].animations = animations;
    });
  };

  const setSlideTexts = ({ group, opts }) => {
    let cumulatedTop = 0;

    const texts = opts.contents.map(content => {
      cumulatedTop += content.relativeTop;
      const text = new fabric.IText(content.text, {
        ...opts.master,
        top: cumulatedTop,
        width: canvas.dim.width,
        originX: "left",
        left: -500
      });
      return text;
    });

    texts.forEach(text => {
      group.addWithUpdate(text);
    });

    group.set({
      originX: "left",
      top: opts.group.top,
      // left: opts.group.left,
      width: canvas.dim.width,
      textAlign: "left"
      // backgroundColor: "#000"
    });
    // group.originY = "left";
  };

  const updateSlideAddText = async ({ text }) => {
    curSlide.slide.texts.contents.push({
      text,
      relativeTop: 90
    });
    canvasEl.remove(getCurSlideTexts());
    const texts = await getSlideTexts({ opts: curSlide.slide.texts });
    canvasEl.add(texts);
  };

  const updateSlideChangeText = ({ index, text }) => {
    curSlide.slide.texts.contents[index].text = text;
    getCurSlideTexts()
      .getObjects()
      [index].set({ text });

    canvasEl.renderAll();
  };

  const updateSlideRemoveText = async ({ index }) => {
    console.log(
      "#updateSlideRemoveText canvasEl.getObjects()",
      canvasEl.getObjects(),
      getCurSlideTexts(),
      curSlideIndex
    );
    curSlide.slide.texts.contents.splice(index, 1);
    console.log(
      "#updateSlideRemoveText canvasEl.getObjects()",
      canvasEl.getObjects(),
      getCurSlideTexts(),
      curSlideIndex
    );
    // getCurSlideTexts().removeWithUpdate(getCurSlideTexts().getObjects()[index]);
    canvasEl.remove(getCurSlideTexts());
    console.log(
      "#updateSlideRemoveText canvasEl.getObjects()",
      canvasEl.getObjects(),
      getCurSlideTexts(),
      curSlideIndex
    );
    const texts = await getSlideTexts({ opts: curSlide.slide.texts });
    console.log(
      "#updateSlideRemoveText canvasEl.getObjects()",
      canvasEl.getObjects(),
      getCurSlideTexts(),
      curSlideIndex
    );
    canvasEl.add(texts);
    canvasEl.renderAll();
  };

  // https://stackoverflow.com/a/50683349/185771
  function startRecording() {
    const chunks = []; // here we will store our recorded media chunks (Blobs)
    const stream = canvasEl.getElement().captureStream(25); // grab our canvas MediaStream
    rec = new MediaRecorder(stream); // init the recorder
    // every time the recorder has new data, we will store it in our array
    rec.ondataavailable = e => chunks.push(e.data);
    // only when the recorder stops, we construct a complete Blob from all the chunks
    rec.onstop = e => exportVid(new Blob(chunks, { type: "video/mp4" }));

    rec.start();
    // setTimeout(() => rec.stop(), 3000); // stop recording in 3s
  }

  function exportVid(blob) {
    const vid = els.video;
    vid.src = URL.createObjectURL(blob);
    vid.controls = true;
    document.body.appendChild(vid);
    const a = document.createElement("a");
    a.download = "myvid.mp4";
    a.href = vid.src;
    a.textContent = "download the video";
    document.body.appendChild(a);
  }

  init();
  drawScene();
  await addSlide();
  addEventListeners();
  render();
});
