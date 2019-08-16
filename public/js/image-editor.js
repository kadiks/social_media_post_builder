var canvas = null;
var imageInputEl = null;
var textAreaEl = null;
var submitBtnEl = null;
var canvasImageUrl = null;
var canvasImage = null;
var canvasTextString = null;
var canvasText = null;
var isAddedEventListeners = false;
var dataEl = null;
var unsplash = null;
var carouselEl = null;
var carouselGsheetsEl = null;
var unsplashSearchInputEl = null;
var canvasIcon = null;
let quotes = {
  all: [],
  filtered: []
};
let photos = [];
var authorEl = null;

var screenDim = {
  width: 400,
  height: 500
};

var canvasDim = {
  width: screenDim.width * 3,
  height: screenDim.height * 3
};

var els = {
  language: null,
  category: null,
  quotenumber: null,
  quotefontsize: null,
  isquoteshadow: null,
  imagescale: null,
  quotefontcolor: null,
  quoteshadowcolor: null,
  exportlink: null,
  quotewidth: null,
  selectimage: null,
  selectedimageid: null
};

const iconColors = {
  health: "#B90000",
  creativity: "#ef7d19",
  success: "#d8c600",
  relationships: "#1c9838",
  communication: "#0dbdc8",
  mindset: "#374976",
  spirituality: "#7614b5"
};

var canvasObj = {
  image: null,
  text: null,
  bg: null,
  icon: null,
  title: null,
  shadow: null
};

var sharedSettings = {
  imageX: 0,
  imageY: 0,
  imageScale: null,
  quoteFontSize: 70,
  quoteFontFamily: "Montserrat",
  quoteFontWeight: "bold",
  quoteLanguage: "en",
  quoteCategory: "health",
  quoteIndex: -1,
  quoteX: null,
  quoteY: null,
  quoteScale: 1,
  quoteText: "",
  quoteColor: "#FFF",
  quoteWidth: canvasDim.width - 50 * 2,
  isQuoteShadow: true,
  quoteShadowColor: "#272727",
  quoteShadowOffsetX: 5,
  quoteShadowOffsetY: 5,
  author: "",
  iconName: null,
  iconWidth: 100,
  iconHeight: 100,
  iconColor: "#B90000",
  iconOpacity: 0.9,
  authorX: null,
  authorY: null,
  authorFontSize: 40,
  authorFontFamily: "Montserrat",
  authorFontWeight: "bold",
  titleFontSize: 30,
  titleFontFamily: "Arial",
  titleFontWeight: "bold",
  titleFontSpacing: 600,
  titleText: "KYEDA.APP",
  titleOpacity: 0.7,
  titleX: null,
  titleY: null,
  unsplashId: ""
};

const onChangeQuoteColor = color => {
  els.quotefontcolor.val(color);
  els.quotefontcolor.css({
    backgroundColor: color
  });
  debounce(() => {
    render({
      quoteColor: color
    });
  })();
};
const onChangeShadowColor = color => {
  els.quoteshadowcolor.val(color);
  els.quoteshadowcolor.css({
    backgroundColor: color
  });
  // render({
  //   quoteShadowColor: color
  // });
  debounce(() => {
    render({
      quoteShadowColor: color
    });
  })();
};

// https://davidwalsh.name/javascript-debounce-function
const debounce = (func, wait = 250, immediate) => {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

$(() => {
  imageInputEl = $("#image");
  textAreaEl = $("#quote");
  authorEl = $("#author");
  submitBtnEl = $("#submit");
  dataEl = $("#data");
  carouselEl = $("#unsplash-carousel");
  carouselGsheetsEl = $("#gsheets-carousel");
  unsplashSearchInputEl = $("#unsplash-search");
  els.language = $("#language");
  els.category = $("#category");
  els.quotenumber = $("#quotenumber");
  els.quotefontsize = $("#quotefontsize");
  els.isquoteshadow = $("#isquoteshadow");
  els.imagescale = $("#imagescale");
  els.quotefontcolor = $("#quotefontcolor");
  els.quoteshadowcolor = $("#quoteshadowcolor");
  els.exportlink = $("#exportlink");
  els.quotewidth = $("#quotewidth");
  els.selectimage = $("#selectimage");
  els.selectedimageid = $("#selectedimageid");
  els.exportlink.css({ opacity: 0.3 });
  $("#quotefontcolorpicker").farbtastic(onChangeQuoteColor);
  $("#quoteshadowcolorpicker").farbtastic(onChangeShadowColor);
  unsplash = new Unsplash({ apiKey: dataEl.attr("data-unsplash-api-key") });
  drawScene();
  // addEventListeners();
});

const savePhoto = async ({ name }) => {
  els.exportlink.css({ opacity: 0.3 });
  const { width, height } = canvasDim;
  var url = `/generate`;
  const jsonCanvas = canvas.toJSON(["id"]);
  console.log("jsonCanvas", jsonCanvas);
  var quoteDetails = {};
  quotes.all.forEach(q => {
    console.log("q.index", parseInt(q.index));
    console.log("sharedSettings.quoteIndex", sharedSettings.quoteIndex);
    if (parseInt(q.index) === sharedSettings.quoteIndex) {
      quoteDetails = q;
    }
  });
  var unsplashUser = {};
  photos.forEach(p => {
    if (p.id === sharedSettings.unsplashId) {
      unsplashUser = p.user;
    }
  });
  sharedSettings.unsplashUser = unsplashUser;
  sharedSettings.quoteDetails = quoteDetails;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      canvas: jsonCanvas,
      settings: {
        ...sharedSettings,
        name,
        width,
        height
      }
    })
  });
  const json = await res.json();
  els.exportlink.attr("href", json.url);
  els.exportlink.css({ opacity: 1 });
  // window.location = json.url;
};

const addEventListeners = () => {
  isAddedEventListeners = true;
  submitBtnEl.click(async () => {
    const name = new Date().getTime();
    await savePhoto({ name });
    // await savePhoto({ name, isRemoveBackground: true });
    // console.log("On click #submit button", JSON.stringify(canvas));
  });

  imageInputEl.change(() => {
    // fabric.Image.fromURL(imageInputEl.val(), img => {
    console.log("change image");
    canvasObj["image"].setSrc(imageInputEl.val());
    sharedSettings.imageScale = null;
    render({ imageScale: null });
    // });
  });
  textAreaEl.keyup(() => {
    render({
      quoteText: textAreaEl.val()
    });
  });
  authorEl.keyup(() => {
    render({
      author: authorEl.val()
    });
  });
  canvasObj["image"].on("moved", evt => {
    console.log("moved", evt);
    const { x, y } = evt.target.aCoords.tl;
    render({
      imageX: x,
      imageY: y
    });
  });
  canvasObj["image"].on("scaled", evt => {
    console.log("scaled", evt);
    const { newScaleX, newScaleY } = evt.transform;
    render({
      imageScale: newScaleX
    });
  });
  canvasObj["text"].on("moved", evt => {
    console.log("moved", evt);
    const { x, y } = evt.target.aCoords.tl;
    render({
      quoteX: x,
      quoteY: y
    });
  });

  // carouselEl.on("slide.bs.carousel", evt => {
  //   const selector = `.carousel-inner > .carousel-item:nth-child(${evt.to +
  //     1}) img`;
  //   console.log("carousel on slide selector", selector);
  //   const imgSrc = carouselEl.find(selector).attr("data-canvas-url");
  //   sharedSettings.unsplashId = carouselEl.find(selector).attr("alt");
  //   fabric.Image.fromURL(imgSrc, img => {
  //     // console.log("okok");
  //     canvasObj["image"].setSrc(img.getSrc());
  //     canvasObj["image"].set("width", img.getScaledWidth());
  //     canvasObj["image"].set("height", img.getScaledHeight());
  //     canvas.renderAll();
  //     sharedSettings.imageScale = null;
  //     render({ imageScale: null });
  //   });
  carouselEl.on("slide.bs.carousel", evt => {
    const selector = `.carousel-inner > .carousel-item:nth-child(${evt.to +
      1}) img`;
    console.log("carousel on slide selector", selector);
    const imgSrc = carouselEl.find(selector).attr("data-canvas-url");
    const id = carouselEl.find(selector).attr("alt");
    els.selectedimageid.attr("href", `https://unsplash.com/photos/${id}`);
    els.selectedimageid.text(`${id}`);
    // fabric.Image.fromURL(imgSrc, img => {
    //   // console.log("okok");
    //   canvasObj["image"].setSrc(img.getSrc());
    //   canvasObj["image"].set("width", img.getScaledWidth());
    //   canvasObj["image"].set("height", img.getScaledHeight());
    //   canvas.renderAll();
    //   sharedSettings.imageScale = null;
    //   render({ imageScale: null });
  });

  els.selectimage.click(() => {
    const selector = `.carousel-inner > .carousel-item.active img`;
    console.log("carousel on slide selector", selector);
    const imgSrc = carouselEl.find(selector).attr("data-canvas-url");
    sharedSettings.unsplashId = carouselEl.find(selector).attr("alt");
    fabric.Image.fromURL(imgSrc, img => {
      // console.log("okok");
      canvasObj["image"].setSrc(img.getSrc());
      canvasObj["image"].set("width", img.getScaledWidth());
      canvasObj["image"].set("height", img.getScaledHeight());
      // canvas.renderAll();
      sharedSettings.imageScale = null;
      render({ imageScale: null });
    });

    // console.log("a", a, b, c, d);
    // canvasImage.setSrc();
  });

  carouselGsheetsEl.on("slide.bs.carousel", evt => {
    const selector = `.carousel-inner > .carousel-item:nth-child(${evt.to +
      1})`;
    console.log("carousel on slide selector", selector);
    const item = carouselGsheetsEl.find(selector);
    const author = item.attr("data-author");
    const quote = item.attr("data-quote");
    const type = item.attr("data-type");
    const quoteIndex = parseInt(item.attr("data-index"));

    // console.log("author", author);
    // console.log("authorEl", authorEl);
    textAreaEl.text(quote);
    authorEl.val(author);

    render({
      quoteText: quote,
      author,
      iconName: type,
      iconColor: iconColors[type],
      quoteIndex
    });

    // console.log("a", a, b, c, d);
    // canvasImage.setSrc();
  });

  unsplashSearchInputEl.keyup(async evt => {
    if (evt.keyCode === 13) {
      await reloadImages({ searchTerm: unsplashSearchInputEl.val() });
    }
  });

  els.language.change(() => {
    console.log("language", els.language.val());
    sharedSettings.quoteLanguage = els.language.val();
    reloadQuotes({ language: els.language.val() });
  });
  els.category.change(() => {
    console.log("category", els.category.val());
    sharedSettings.quoteCategory = els.category.val();
    reloadQuotes({ category: els.category.val() });
  });
  els.quotefontsize.keyup(() => {
    const fontSize = parseInt(els.quotefontsize.val());
    render({
      quoteFontSize: fontSize,
      authorFontSize: fontSize - 30
    });
  });
  els.isquoteshadow.change(() => {
    render({
      isQuoteShadow: els.isquoteshadow.prop("checked")
    });
  });
  els.imagescale.keyup(() => {
    render({
      imageScale: parseFloat(els.imagescale.val())
    });
  });
  // els.quotefontcolor.change(() => {
  //   console.log("OKOK");
  //   render({
  //     quoteColor: els.quotefontcolor.val()
  //   });
  // });
  // els.quotefontcolor.keyup(() => {
  //   console.log("OKOK");
  //   render({
  //     quoteColor: els.quotefontcolor.val()
  //   });
  // });
  // els.quotefontcolor.keydown(() => {
  //   console.log("OKOK");
  //   render({
  //     quoteColor: els.quotefontcolor.val()
  //   });
  // });

  els.quotewidth.keyup(() => {
    render({
      quoteWidth: parseInt(els.quotewidth.val())
    });
  });
};

const displayDefaultState = () => {
  els.quotefontsize.val(sharedSettings.quoteFontSize);
  els.isquoteshadow.prop("checked", sharedSettings.isQuoteShadow);
  console.log("sharedSettings.imageScale", sharedSettings.imageScale);
  els.imagescale.val(sharedSettings.imageScale);
  els.quotefontcolor.val(sharedSettings.quoteColor);
  els.quoteshadowcolor.val(sharedSettings.quoteShadowColor);
  els.language.val(sharedSettings.quoteLanguage);
  els.category.val(sharedSettings.quoteCategory);
  els.quotewidth.val(sharedSettings.quoteWidth);
};

const reloadQuotes = ({
  language = els.language.val(),
  category = els.category.val()
}) => {
  const filteredQuotes = filterQuotes({
    quotes: quotes.all,
    language,
    category
  });
  console.log("#reloadQuotes filteredQuotes", filteredQuotes);
  displayQuotes({ quotes: filteredQuotes });
};

const drawScene = async () => {
  fabric.devicePixelRatio = 2;

  canvas = new fabric.Canvas("canvas", {
    preserveObjectStacking: true
  });

  canvas.setWidth(screenDim.width);
  canvas.setHeight(screenDim.height);

  canvas.setZoom(screenDim.width / canvasDim.width);

  sharedSettings.quoteText = textAreaEl.val();
  sharedSettings.author = authorEl.val();

  var rect = new fabric.Rect({
    id: "bg",
    top: 0,
    left: 0,
    fill: "#000",
    ...canvasDim
  });

  canvasObj["shadow"] = new fabric.Shadow({
    offsetX: sharedSettings.quoteShadowOffsetX,
    offsetY: sharedSettings.quoteShadowOffsetY,
    color: sharedSettings.quoteShadowColor
  });

  canvasObj["text"] = new fabric.Textbox(sharedSettings.quoteText, {
    id: "quote",
    fontFamily: sharedSettings.quoteFontFamily,
    fontWeight: sharedSettings.quoteFontWeight,
    fontSize: sharedSettings.quoteFontSize,
    fill: "#FFF",
    textAlign: "center",
    width: sharedSettings.quoteWidth,
    shadow: canvasObj["shadow"]
  });

  canvasObj["author"] = new fabric.IText(sharedSettings.author, {
    id: "author",
    fontFamily: sharedSettings.authorFontFamily,
    fontWeight: sharedSettings.authorFontWeight,
    fontSize: sharedSettings.authorFontSize,
    fill: "#FFF",
    textAlign: "center",
    width: canvasDim.width,
    shadow: canvasObj["shadow"]
  });

  canvasObj["icon"] = await loadIcon({ name: "spirituality" });

  canvasObj["title"] = new fabric.IText(sharedSettings.titleText, {
    id: "title",
    fontFamily: sharedSettings.titleFontFamily,
    fontWeight: sharedSettings.titleFontWeight,
    fontSize: sharedSettings.titleFontSize,
    charSpacing: sharedSettings.titleFontSpacing,
    opacity: sharedSettings.titleOpacity,
    fill: "#FFF",
    textAlign: "center",
    width: canvasDim.width
  });

  await loadImage({
    url: imageInputEl.val(),
    id: "image"
  });

  canvas.add(
    rect,
    canvasObj.image,
    canvasObj.icon,
    canvasObj.title,
    canvasObj.text,
    canvasObj.author
  );
  addEventListeners();
  displayDefaultState();
  loadImages();
  loadQuotes();
  render({
    iconName: "spirituality"
  });
};

const loadImage = ({ url, id }) =>
  new Promise(resolve => {
    fabric.Image.fromURL(url, img => {
      if (canvasObj[id] === null) {
        canvasObj[id] = img;
      }
      canvasObj[id].setSrc(img.getSrc());
      canvasObj[id].set("id", id);
      canvasObj[id].set("width", img.getScaledWidth());
      canvasObj[id].set("height", img.getScaledHeight());
      resolve(canvasObj[id]);
    });
  });

// https://stackoverflow.com/a/18616032/185771
const loadIcon = ({ name }) =>
  new Promise(resolve => {
    fabric.loadSVGFromURL(`/svg/${name}.svg`, (objects, options) => {
      console.log("#loadIcon objects", objects);
      changeSVGColor({ obj: objects, color: iconColors[name] });
      const icon = fabric.util.groupSVGElements(objects, options);
      icon.set({ id: "icon" });
      changeSVGSize({ icon });
      resolve(icon);
    });
  });

const changeSVGColor = ({ obj, color = "#FFF" } = {}) => {
  obj.forEach(o => {
    o.fill = color;
    o.opacity = sharedSettings.iconOpacity;
  });
};

const changeSVGSize = ({
  icon,
  width = sharedSettings.iconWidth,
  height = sharedSettings.iconHeight
}) => {
  console.log("icon", icon);
  const shorterEdge = icon.height < icon.width ? "height" : "width";
  let ratio = height / icon.height;
  if (shorterEdge === "height") {
    ratio = width / icon.width;
  }
  // icon.width = icon.width * ratio;
  // icon.height = icon.height * ratio;
  icon.scale(ratio);
  // obj.forEach(o => {
  //   const shorterEdge = o.height < o.width ? "height" : "width";
  //   let ratio = height / o.height;
  //   if (shorterEdge === "height") {
  //     ratio = width / o.width;
  //   }
  //   o.width = o.width * ratio;
  //   o.height = o.height * ratio;
  // });
};

const reloadImages = async ({ searchTerm }) => {
  carouselEl.find(".carousel-inner").empty();
  await loadImages({ fn: unsplash.searchPhotos, fnParams: { searchTerm } });
};

const filterQuotes = ({ quotes, language, category }) => {
  console.log("#filterQuotes", language);
  const filterLanguageQuotes = quotes.filter(
    q => q[`quote_${language}`].length > 0
  );
  const filterCategoryQuotes = filterLanguageQuotes.filter(
    q => q.type === category
  );
  return filterCategoryQuotes;
};

const loadImages = async ({ fn = unsplash.getPhotos, fnParams = {} } = {}) => {
  photos = await fn(fnParams);
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
  carouselEl.find(".carousel-inner").append(html);
  const firstImageLink = `${photos[0].urls.raw}?q=100&w=2300`;
  fabric.Image.fromURL(firstImageLink, img => {
    canvasObj["image"].setSrc(img.getSrc());
    canvasObj["image"].set("width", img.getScaledWidth());
    canvasObj["image"].set("height", img.getScaledHeight());
    // canvas.renderAll();
    sharedSettings.imageScale = null;
    render({ imageScale: null });
  });
  // await loadImage(firstImageLink);
};

const loadQuotes = async () => {
  const res = await fetch("/data");
  quotes.all = await res.json();
  const language = els.language.val();
  const category = els.category.val();
  quotes.filtered = filterQuotes({
    quotes: quotes.all,
    language,
    category
  });

  console.log("quotes.filtered", quotes.filtered);
  console.log("category", category);
  console.log("language", language);

  displayQuotes({ quotes: quotes.filtered });
};

const displayQuotes = ({ quotes }) => {
  const html = quotes.map(
    ({ index, quote_en, quote_fr, quote_es, author, type }, idx) => {
      const div = document.createElement("div");
      const carQuoteEl = document.createElement("p");
      const carAuthorEl = document.createElement("p");
      if (idx === 0) {
        div.setAttribute("class", "carousel-item active");
      } else {
        div.setAttribute("class", "carousel-item");
      }
      div.setAttribute("style", "padding: 0 35px;");
      const quoteStr = quote_en ? quote_en : quote_fr ? quote_fr : quote_es;
      div.setAttribute("data-quote", quoteStr);
      div.setAttribute("data-author", author);
      div.setAttribute("data-type", type);
      div.setAttribute("data-index", index);
      carAuthorEl.setAttribute("style", "text-align: right");
      carQuoteEl.innerText = quoteStr;
      carAuthorEl.innerText = author;
      div.append(carQuoteEl, carAuthorEl);
      return div;
    }
  );
  carouselGsheetsEl.find(".carousel-inner").html(html);
  els.quotenumber.text(quotes.length);
};

const render = async ({
  imageX = sharedSettings.imageX,
  imageY = sharedSettings.imageY,
  imageScale = sharedSettings.imageScale,
  quoteX = sharedSettings.quoteX,
  quoteY = sharedSettings.quoteY,
  quoteScale = sharedSettings.quoteScale,
  quoteText = sharedSettings.quoteText,
  quoteWidth = sharedSettings.quoteWidth,
  author = sharedSettings.author,
  iconName = sharedSettings.iconName,
  iconColor = sharedSettings.iconColor,
  quoteFontSize = sharedSettings.quoteFontSize,
  quoteFontFamily = sharedSettings.quoteFontFamily,
  quoteFontWeight = sharedSettings.quoteFontWeight,
  quoteIndex = sharedSettings.quoteIndex,
  isQuoteShadow = sharedSettings.isQuoteShadow,
  quoteColor = sharedSettings.quoteColor,
  quoteShadowColor = sharedSettings.quoteShadowColor,
  quoteShadowOffsetX = sharedSettings.quoteShadowOffsetX,
  quoteShadowOffsetY = sharedSettings.quoteShadowOffsetY,
  iconWidth = sharedSettings.iconWidth,
  iconHeight = sharedSettings.iconHeight,
  authorX = sharedSettings.authorX,
  authorY = sharedSettings.authorY,
  authorFontSize = sharedSettings.authorFontSize,
  authorFontFamily = sharedSettings.authorFontFamily,
  authorFontWeight = sharedSettings.authorFontWeight,
  titleFontSize = sharedSettings.titleFontSize,
  titleFontFamily = sharedSettings.titleFontFamily,
  titleFontWeight = sharedSettings.titleFontWeight,
  titleFontSpacing = sharedSettings.titleFontSpacing,
  titleText = sharedSettings.titleText,
  titleOpacity = sharedSettings.titleOpacity,
  titleX = sharedSettings.titleX,
  titleY = sharedSettings.titleY
} = {}) => {
  // console.log("isQuoteShadow", isQuoteShadow);
  if (
    (sharedSettings.quoteX === null && sharedSettings.quoteY === null) ||
    quoteText !== sharedSettings.quoteText
  ) {
    quoteX = canvasDim.width * 0.5 - canvasObj["text"].getScaledWidth() * 0.5;
    quoteY = canvasDim.height * 0.5 - canvasObj["text"].getScaledHeight() * 0.5;
  }

  // console.log("quoteX", quoteX);
  // console.log("quoteY", quoteY);
  // console.log("quoteText", quoteText);
  // console.log("canvasObj["text"]", canvasObj["text"]);

  canvasObj["text"].top = quoteY;
  canvasObj["text"].left = quoteX;
  canvasObj["text"].set({
    text: quoteText.replace(/\\n/g, "\n"),
    fontSize: quoteFontSize,
    fill: quoteColor,
    width: quoteWidth
  });
  canvasObj["author"].set({
    text: author.replace(/\\n/g, "\n"),
    fontSize: authorFontSize,
    fill: quoteColor
  });

  console.log(" canvasObj[text].lineHeight ", canvasObj["text"].lineHeight);

  authorY =
    canvasObj["text"].getScaledHeight() +
    canvasObj["text"].lineHeight * quoteFontSize +
    canvasObj["text"].get("top");
  authorX =
    canvasObj["text"].getScaledWidth() +
    canvasObj["text"].get("left") -
    canvasObj["author"].getScaledWidth();

  canvasObj["author"].set({
    top: authorY,
    left: authorX
  });

  var dimensions = {
    width: canvasObj["image"].getScaledWidth(),
    height: canvasObj["image"].getScaledHeight()
  };
  var longestEdge = dimensions.width > dimensions.height ? "width" : "height";
  longestEdge = "height";
  if (imageScale === null) {
    imageScale = canvasDim[longestEdge] / dimensions[longestEdge];
  }
  console.log("imageScale", imageScale);
  canvasObj["image"].scale(imageScale);

  if (
    iconName !== sharedSettings.iconName ||
    sharedSettings.iconName === null
  ) {
    const newIcon = await loadIcon({ name: iconName });
    const left =
      (canvas.getWidth() / canvas.getZoom()) * 0.5 -
      sharedSettings.iconWidth * 0.5;
    // console.log("newIcon", newIcon);
    console.log("left", left);
    canvasObj["icon"].set({
      d: newIcon.d,
      path: newIcon.path,
      top: sharedSettings.iconHeight,
      left,
      fill: iconColor
    });
    // canvasObj["icon"].set("path", newIcon.path);
    // canvasObj['icon']
  }

  titleX =
    (canvas.getWidth() / canvas.getZoom()) * 0.5 -
    canvasObj["title"].getScaledWidth() * 0.5;
  titleY =
    canvas.getHeight() / canvas.getZoom() - sharedSettings.iconHeight * 1.5;

  canvasObj["title"].set({
    top: titleY,
    left: titleX
  });

  if (isQuoteShadow === true) {
    quoteShadowOffsetX = 5;
    quoteShadowOffsetY = 5;
  } else {
    quoteShadowOffsetX = 0;
    quoteShadowOffsetY = 0;
  }
  canvasObj["shadow"].offsetX = quoteShadowOffsetX;
  canvasObj["shadow"].offsetY = quoteShadowOffsetY;
  canvasObj["shadow"].fill = quoteShadowColor;

  canvas.renderAll();

  sharedSettings.quoteX = quoteX;
  sharedSettings.quoteY = quoteY;
  sharedSettings.quoteScale = quoteScale;
  sharedSettings.imageX = imageX;
  sharedSettings.imageY = imageY;
  sharedSettings.imageScale = imageScale;
  sharedSettings.quoteText = quoteText;
  sharedSettings.quoteWidth = quoteWidth;
  sharedSettings.author = author;
  sharedSettings.iconName = iconName;
  sharedSettings.iconColor = iconColor;
  sharedSettings.quoteFontSize = quoteFontSize;
  sharedSettings.quoteFontFamily = quoteFontFamily;
  sharedSettings.quoteFontWeight = quoteFontWeight;
  sharedSettings.quoteIndex = quoteIndex;
  sharedSettings.isQuoteShadow = isQuoteShadow;
  sharedSettings.quoteColor = quoteColor;
  sharedSettings.quoteShadowColor = quoteShadowColor;
  sharedSettings.quoteShadowOffsetX = quoteShadowOffsetX;
  sharedSettings.quoteShadowOffsetY = quoteShadowOffsetY;
  sharedSettings.iconWidth = iconWidth;
  sharedSettings.iconHeight = iconHeight;
  sharedSettings.authorX = authorX;
  sharedSettings.authorY = authorY;
  sharedSettings.authorFontSize = authorFontSize;
  sharedSettings.authorFontFamily = authorFontFamily;
  sharedSettings.authorFontWeight = authorFontWeight;
  sharedSettings.titleFontSize = titleFontSize;
  sharedSettings.titleFontFamily = titleFontFamily;
  sharedSettings.titleFontWeight = titleFontWeight;
  sharedSettings.titleFontSpacing = titleFontSpacing;
  sharedSettings.titleText = titleText;
  sharedSettings.titleOpacity = titleOpacity;
  sharedSettings.titleX = titleX;
  sharedSettings.titleY = titleY;

  displayDefaultState();
};
