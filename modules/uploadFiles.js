const createTempDirs = require("./uploadFiles/createTempDirs");
const createFileArray = require("./uploadFiles/createFileArray");
const uploadImages = require("./uploadFiles/uploadImages");
const uploadLogo = require("./uploadFiles/uploadLogo");

module.exports = req => {
  return new Promise((res, rej) => {
    console.log('\nUploading files...')
    createTempDirs()
      .then(() => {
        return createFileArray(req.files.file);
      })
      .then(fileArr => {
        return uploadImages(fileArr);
      })
      .then(() => {
        uploadLogo(req.files.logo);
      })
      .then(() => {
        res(req);
      })
      .catch(err => {
        console.log(err);
        rej(err);
      });
  });
};
