const path = require("path");

module.exports = fileArr => {
  return new Promise(async (res, rej) => {
    const moveFile = file => {
      return file.mv(path.join("./temp/raw", file.name), err => {
        rej(err);
      });
    };
    for (let file of fileArr) {
      await moveFile(file);
    }
    res()
  });
};
