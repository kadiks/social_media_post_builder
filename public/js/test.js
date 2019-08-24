(async function() {
  var canvas = (this.__canvas = new fabric.Canvas("canvas"));

  fabric.devicePixelRatio = 2;

  var loadImage = url =>
    new Promise(resolve => {
      new fabric.Image.fromURL(
        "http://localhost:3000/proxy?url=" + url,
        img => {
          resolve(img);
        }
      );
    });

  canvas.setDimensions({
    width: 400,
    height: 500
  });

  var rect = new fabric.Rect({
    width: 50,
    height: 50,
    left: 10,
    top: 100,
    stroke: "#aaf",
    strokeWidth: 5,
    fill: "#faa",
    selectable: false
  });

  var textOptions = {
    fontFamily: "Arial",
    fill: "#FFF",
    opacity: 0,
    stroke: "#000",
    strokeWidth: 1,
    left: 10
  };

  var text1 = new fabric.Text("The Old Man", {
    ...textOptions,
    top: 300
  });
  var text2 = new fabric.Text("and", {
    ...textOptions,
    top: 350
  });
  var text3 = new fabric.Text("the Sea", {
    ...textOptions,
    top: 400
  });

  var img = await loadImage(
    "http://images.unsplash.com/photo-1473172707857-f9e276582ab6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2350&q=100"
  );
  canvas.add(img, text1, text2, text3);

  img.scale(0.3);
  img.set({
    left: -370
  });

  canvas.renderAll();

  var exportBtn = document.getElementById("selectimage");
  exportBtn.onclick = function() {
    console.log(canvas.toJSON());
  };

  var rec = null;
  var videoEl = document.createElement("video");

  $("#exportlink")
    .parent()
    .append(videoEl);

  var animateBtn = document.getElementById("submit");

  // https://stackoverflow.com/a/50683349/185771
  function startRecording() {
    const chunks = []; // here we will store our recorded media chunks (Blobs)
    const stream = canvas.getElement().captureStream(25); // grab our canvas MediaStream
    rec = new MediaRecorder(stream); // init the recorder
    // every time the recorder has new data, we will store it in our array
    rec.ondataavailable = e => chunks.push(e.data);
    // only when the recorder stops, we construct a complete Blob from all the chunks
    rec.onstop = e => exportVid(new Blob(chunks, { type: "video/mp4" }));

    rec.start();
    // setTimeout(() => rec.stop(), 3000); // stop recording in 3s
  }

  function exportVid(blob) {
    const vid = videoEl;
    vid.src = URL.createObjectURL(blob);
    vid.controls = true;
    document.body.appendChild(vid);
    const a = document.createElement("a");
    a.download = "myvid.mp4";
    a.href = vid.src;
    a.textContent = "download the video";
    document.body.appendChild(a);
  }

  animateBtn.onclick = function() {
    startRecording();
    animateBtn.disabled = true;
    img.animate("left", -330, {
      duration: 10000,
      onChange: canvas.renderAll.bind(canvas),
      onComplete: function() {
        animateBtn.disabled = false;
        rec.stop();
      }
    });
    var textAnimateProps = {
      opacity: 1,
      left: 30
    };
    var textAnimateOptions = {
      duration: 1000,
      onChange: canvas.renderAll.bind(canvas)
    };
    setTimeout(() => {
      text1.animate(textAnimateProps, textAnimateOptions);
    }, 2000);
    setTimeout(() => {
      text2.animate(textAnimateProps, textAnimateOptions);
    }, 2250);
    setTimeout(() => {
      text3.animate(textAnimateProps, textAnimateOptions);
    }, 2500);
  };
})();
