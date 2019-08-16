require("dotenv").config();

const fs = require("fs-extra");
const express = require("express");
const bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
const _ = require("lodash");
const fabric = require("fabric").fabric;

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

app.get("/", (req, res) => {
  res.render("homepage", {
    unsplashApiKey: UNSPLASH_CLIENT_ID,
    googleSheetsApiKey: GOOGLE_SHEETS_KEY,
    categories: [
      "health",
      "creativity",
      "success",
      "relationships",
      "communication",
      "mindset",
      "spirituality"
    ]
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
  const caption = settings.quoteDetails[`caption_${settings.quoteLanguage}`];
  const fullCaption = `${caption}
If you liked it, please share it with your friends.
${
  settings.quoteDetails.source_website
    ? `Source: ${settings.quoteDetails.source_website}` + "\n"
    : ""
}
${
  settings.unsplashUser.instagram_username
    ? `Photo credits: ${settings.unsplashUser.name} @${
        settings.unsplashUser.instagram_username
      }` + "\n"
    : ""
}`;

  settings.caption = fullCaption;

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
