const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");

module.exports = req => {
  return new Promise((res, rej) => {
    const createDirs = () => {
      fs.mkdirSync(tempPath);
      fs.mkdirSync(path.join(tempPath, "raw"));
      fs.mkdirSync(path.join(tempPath, "processed"));
      fs.mkdirSync(path.join(tempPath, "logo"));
      res(req);
    };

    const tempPath = path.join("./", "temp");
    if (fs.existsSync(tempPath)) {
      rimraf(tempPath, err => {
        if (err) rej(err);
        createDirs();
      });
    } else {
      createDirs();
    }
  });
};
