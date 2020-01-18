const express = require("express");
const app = express();

const path = require("path");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const uploadFiles = require("./modules/uploadFiles");
const createJimps = require("./modules/createJimps");
const validateImages = require("./modules/validateImages");
const processImages = require("./modules/processImages");
const packageDownload = require("./modules/packageDownload");

app.use(cors());
app.use(fileUpload());

app.get("/download/:file", (req, res) => {
  res.download(path.join(__dirname, "temp", "download", req.params.file));
});

app.post("/upload", (req, res) => {
  console.log("\nRequest received");
  uploadFiles(req)
    .then(createJimps)
    .then(validateImages)
    .then(processImages)
    .then(packageDownload)
    .then(data => {
      res
        .status(200)
        .json({ success: true, msg: "Images processed. Downloading...", link: data.download });
    })
    .catch(err => {
      console.log(err);

      res.status(400).json({ success: false, err: err });
    });
});
if(process.env.NODE_ENV){
  app.use(express.static(path.join(__dirname, 'client/build')))

  app.get('*', (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

app.listen(5000, () => {
  console.log("App listening on port 5000");
});
