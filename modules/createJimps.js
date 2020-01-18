const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");

module.exports = req => {
  return new Promise(async (res, rej) => {
    console.log('\nCreating Jimps...')
    const jimps = {
      images: [],
      logo: null
    };

    const makeJimp = (path, logo = false) => {
      return Jimp.read(path);
    };

    const rawDir = fs.readdirSync("./temp/raw");

    for (let rawFile of rawDir) {
      await makeJimp(path.join(__dirname, "../", "temp", "raw", rawFile))
        .then(img => {
          jimps.images.push({
              filename: rawFile,
              img
          });
        })
        .catch(err => {
          rej(err);
        });
    }

    await makeJimp(
      path.join(__dirname, "../", "temp", "logo", req.files.logo.name)
    )
      .then(img => {
        jimps.logo = img;
      })
      .catch(err => {
        rej(err);
      });
    res({ req, jimps });
  });
};
