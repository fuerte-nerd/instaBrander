const fs = require("fs-extra");
const archiver = require("archiver");
const path = require("path");
module.exports = data => {
  return new Promise((res, rej) => {
    console.log("\nPackaging files...");

    const downloadPath = path.join(__dirname, "../", "temp", "download");
    fs.mkdirSync(downloadPath);
    if (data.jimps.images.length > 1) {
      const output = fs.createWriteStream(
        path.join(downloadPath, "download.zip")
      );

      const archive = archiver("zip", {
        zlib: { level: 9 }
      });

      archive.pipe(output);

      archive.directory(
        path.join(__dirname, "../", "temp", "processed"),
        false
      );

      archive.finalize().then(() => {
        res({ download: "download.zip" });
      });
    } else {
      const filePath = fs.readdirSync(
        path.join(__dirname, "../", "temp", "processed")
      );
      fs.readFile(
        path.join(__dirname, "../", "temp", "processed", filePath[0]),
        (err, data) => {
          if (err) rej(err);
          fs.writeFile(path.join(downloadPath, filePath[0]), data, err => {
            if (err) rej(err);
            res({ download: filePath[0] });
          });
        }
      );
    }
  });
};
