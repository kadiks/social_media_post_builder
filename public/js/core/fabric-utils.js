const fabricUtils = {};

fabricUtils.loadCanvasImage = ({ url, id }) =>
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

fabricUtils.loadImage = ({ url }) =>
  new Promise(resolve => {
    new fabric.Image.fromURL(url, img => {
      resolve(img);
    });
  });

fabricUtils.loadProxyImage = ({ url }) =>
  new Promise(resolve => {
    new fabric.Image.fromURL("http://localhost:3000/proxy?url=" + url, img => {
      resolve(img);
    });
  });

// https://stackoverflow.com/a/18616032/185771
fabricUtils.loadIcon = ({ name }) =>
  new Promise(resolve => {
    console.log("#loadIcon name", name);
    fabric.loadSVGFromURL(`/svg/${name}.svg`, (objects, options) => {
      console.log("#loadIcon objects", objects);
      changeSVGColor({ obj: objects, color: iconColors[name] });
      const icon = fabric.util.groupSVGElements(objects, options);
      icon.set({ id: "icon" });
      changeSVGSize({ icon });
      resolve(icon);
    });
  });
