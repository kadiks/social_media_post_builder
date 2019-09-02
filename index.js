require("dotenv").config();

const fs = require("fs-extra");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
const request = require("request-promise-native");
const _ = require("lodash");
const fabric = require("fabric").fabric;
const moment = require("moment");
const {
  CATEGORIES,
  AUTHORS_I18N,
  PUBLISHING_PLATFORMS
} = require("./src/constants");

const gsheets = require("./gsheets");

const { PORT, UNSPLASH_CLIENT_ID, GOOGLE_SHEETS_KEY } = process.env;

const app = express();
const hbs = exphbs.create({
  partialsDir: __dirname + "/views/partials/"
});

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/", express.static(__dirname + "/public"));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js/"));
app.use("/js", express.static(__dirname + "/node_modules/fabric/dist/"));
app.use("/js", express.static(__dirname + "/node_modules/jquery/dist/"));
app.use("/js", express.static(__dirname + "/node_modules/popper.js/dist/umd"));
app.use("/js", express.static(__dirname + "/node_modules/qs/dist"));
app.use("/js", express.static(__dirname + "/node_modules/farbstastic"));
app.use("/css", express.static(__dirname + "/node_modules/farbstastic"));

// https://stackoverflow.com/a/26983436/185771
app.get("/proxy", (req, res) => {
  const url = req.query.url;
  try {
    request.get(url).pipe(res);
  } catch (e) {
    console.log(`/proxy on url ${url} with error ${e}`);
  }
});

app.get("/", async (req, res) => {
  const exportPath = "public/exports";
  const folders = fs.readdirSync(exportPath);
  folders.splice(0, 1);
  // console.log("files", files);
  const foldersToInt = folders.map(f => parseInt(f));
  foldersToInt.sort((a, b) => {
    if (a < b) {
      return 1;
    } else {
      return -1;
    }
  });

  const settings = getAllSettings({ folders, exportPath });

  // console.log("settings", settings);
  const groupIndex = {};
  const orderById = [];
  settings.forEach(curSettings => {
    // console.log("route /, curSettings", curSettings);
    if (curSettings === null) {
      return;
    }
    if (curSettings.hasOwnProperty("quoteIndex") === true) {
      curSettings.quoteIndex = parseInt(curSettings.quoteIndex);
    }
    if (curSettings.hasOwnProperty("name") === true) {
      orderById.splice(
        foldersToInt.indexOf(curSettings.name),
        0,
        parseInt(curSettings.quoteIndex)
      );
    }
    if (groupIndex.hasOwnProperty(curSettings.quoteIndex) === false) {
      groupIndex[curSettings.quoteIndex] = {};
    }
    if (
      groupIndex[curSettings.quoteIndex].hasOwnProperty(
        curSettings.quoteLanguage
      ) === false
    ) {
      groupIndex[curSettings.quoteIndex][curSettings.quoteLanguage] = [];
    }
    // console.log("route /, groupIndex", groupIndex);
    const curTs = curSettings.name;
    let insertIndex = 0;
    groupIndex[curSettings.quoteIndex][curSettings.quoteLanguage].forEach(
      (compSettings, index) => {
        if (compSettings.name > curTs) {
          insertIndex = index;
        }
      }
    );
    groupIndex[curSettings.quoteIndex][curSettings.quoteLanguage].splice(
      insertIndex,
      0,
      curSettings
    );
  });

  const orderSettingsByTs = [];
  const addedIds = [];
  orderById.forEach((quoteIndex, index) => {
    if (
      groupIndex.hasOwnProperty(quoteIndex) === true &&
      addedIds.indexOf(quoteIndex) === -1
    ) {
      addedIds.push(quoteIndex);
      const group = JSON.parse(JSON.stringify(groupIndex[quoteIndex]));
      // console.log("group", Object.keys(group));
      let lang = "en";
      let ts = _.get(group, "en[0].name", new Date().getTime());
      if (_.get(group, "fr[0].name", 0) > ts) {
        lang = "fr";
        ts = group["fr"][0].name;
      }
      if (_.get(group, "es[0].name", 0) > ts) {
        lang = "es";
        ts = group["es"][0].name;
      }
      if (typeof group[lang] === "undefined") {
        return;
      }
      const latest = group[lang][0];
      group.info = {
        id: latest.name,
        title: latest.quoteText,
        row: latest.quoteDetails.index + 2,
        index: latest.quoteDetails.index,
        date: moment(latest.name).format("YYYY-MM-DD HH:mm:ss")
      };
      orderSettingsByTs.push(group);
    }
  });

  // res.json(orderSettingsByTs);

  res.render("homepage", {
    images: orderSettingsByTs
  });

  // res.json(orderById);

  // const images = foldersToInt.map(f => ({ id: f, ts: new Date(f) }));
  // res.render("homepage", {
  //   images
  // });
});

const getAllSettings = ({ folders, exportPath } = {}) => {
  return folders.map(f => getSettingsById({ exportPath, id: f }));
};

const getSettingsById = ({ exportPath, id } = {}) => {
  const settingsPath = path.join(exportPath, id, "settings.json");
  // console.log("settingsPath", settingsPath);
  try {
    const settingsStr = fs.readFileSync(settingsPath, "utf8");
    return JSON.parse(settingsStr);
  } catch (e) {
    return null;
  }
};

app.get("/authors", (req, res) => {
  res.json(AUTHORS_I18N);
});

app.get("/image", (req, res) => {
  res.render("image", {
    unsplashApiKey: UNSPLASH_CLIENT_ID,
    googleSheetsApiKey: GOOGLE_SHEETS_KEY,
    categories: Object.values(CATEGORIES).join(","),
    platforms: Object.values(PUBLISHING_PLATFORMS).join(",")
  });
});

app.get("/video", (req, res) => {
  res.render("video", {
    unsplashApiKey: UNSPLASH_CLIENT_ID,
    googleSheetsApiKey: GOOGLE_SHEETS_KEY,
    categories: Object.values(CATEGORIES)
  });
});

app.get("/data", async (req, res) => {
  // gsheets.authorize(gsheets.getData);
  const auth = await gsheets.authorize();
  // console.log("ayth", auth);
  const data = await gsheets.getData(auth);
  // console.log("data", data);
  res.json(data);
});

app.post("/generate", async (req, res) => {
  const settings = req.body.settings;
  const jsonCanvas = req.body.canvas;
  const ts = settings.name;
  const folderName = `/exports/${ts}`;
  const localFolderName = `/public${folderName}`;
  await fs.mkdir(__dirname + localFolderName);
  var canvas = new fabric.StaticCanvas(null, {
    width: settings.width,
    height: settings.height
  });

  let source = null;
  const caption = getCaption({ settings });

  settings.caption = caption;

  try {
    source = await hbs.render("views/export.handlebars", settings, {
      partialsDir: ""
    });
  } catch (e) {
    console.log("e", e);
  }

  // console.log("source", source);

  // console.log("canvas", req.body);

  await fs.writeFile(__dirname + `${localFolderName}/index.html`, source);
  await fs.writeFile(
    __dirname + `${localFolderName}/settings.json`,
    JSON.stringify(settings, null, 2)
  );
  await fs.writeFile(
    __dirname + `${localFolderName}/canvas.json`,
    JSON.stringify(jsonCanvas, null, 2)
  );

  const imagePath = await saveCanvas({
    canvas,
    jsonCanvas,
    folderName,
    localFolderName,
    ts
  });
  const imageNoShadowPath = await saveCanvas({
    canvas,
    jsonCanvas,
    folderName,
    localFolderName,
    ts,
    isDepth: false,
    isShadow: false
  });
  const depthPath = await saveCanvas({
    canvas,
    jsonCanvas,
    folderName,
    localFolderName,
    ts,
    isDepth: true
  });

  res.json({
    url: `${folderName}/index.html`
  });
});

const getCaption = ({ settings }) => {
  const { quoteDetails, unsplashUser } = settings;
  const googleCaption = quoteDetails[`caption_${settings.quoteLanguage}`];
  let shareMention = "If you liked it, please share it with your friends.";
  let sourceMention = "";
  let photoCredits = `Photo credits: ${unsplashUser.name}`;
  if (quoteDetails.source_website !== "") {
    sourceMention = `Source: ${quoteDetails.source_website}` + "\n";
  }
  if (unsplashUser.instagram_username !== null) {
    photoCredits += ` IG: @${unsplashUser.instagram_username}`;
  }
  if (unsplashUser.twitter_username !== null) {
    photoCredits += ` Tw: @${unsplashUser.twitter_username}`;
  }
  if (quoteDetails.suggested_by_name !== "") {
    shareMention = `This quote has been suggested by our member: ${quoteDetails.suggested_by_name} `;
    if (quoteDetails.suggested_by_fb !== "") {
      shareMention += `FB: ${quoteDetails.suggested_by_fb} `;
    }
    if (quoteDetails.suggested_by_ig !== "") {
      shareMention += `IG: ${quoteDetails.suggested_by_ig}`;
    }
  }

  return `${googleCaption}
  
${shareMention}

${photoCredits}`;
};

const saveCanvas = async ({
  canvas,
  jsonCanvas,
  localFolderName,
  folderName,
  ts,
  isDepth = false,
  isShadow = true
}) =>
  new Promise(resolve => {
    const ext = "jpg";
    let name = isDepth === false ? `${ts}_shadow` : `${ts}_depth`;
    if (isShadow === false) {
      name = `${ts}`;
    }
    var out = fs.createWriteStream(
      __dirname + `${localFolderName}/${name}.${ext}`
    );

    const version = jsonCanvas.version;
    let objects = jsonCanvas.objects;
    if (isDepth === true) {
      objects = _.reject(objects, { id: "image" });
      objects.forEach(object => {
        if (object.id === "author") {
          object.fill = "#777";
        }
        if (object.id === "icon") {
          object.fill = "#2d2d2d";
          object.opacity = 1;
        }
        if (object.id === "title") {
          object.fill = "#000";
        }
        if (object.id === "quote") {
          object.shadow = null;
        }
      });
    }

    if (isShadow === false) {
      objects.forEach(object => {
        if (object.id === "quote" || object.id === "author") {
          object.shadow = null;
        }
      });
    }

    const updatedJson = {
      version,
      objects
    };

    canvas.loadFromJSON(updatedJson, () => {
      canvas.renderAll();

      var stream = canvas.createJPEGStream({
        quality: 1,
        progressive: false,
        chromaSubsampling: false
      });
      stream.on("data", function(chunk) {
        out.write(chunk);
      });
      stream.on("end", function() {
        resolve(`${folderName}/${name}.${ext}`);
      });
    });
  });

app.listen(PORT, () => {
  console.log(`Server start on port ${PORT}`);
});
