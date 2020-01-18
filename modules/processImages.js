const config = require("./config");
const Jimp = require("jimp");
const path = require("path");

module.exports = data => {
  return new Promise(async (res, rej) => {
    console.log("\nProcessing images...");
    let font = {};
    const getFont = font => {
      return Jimp.loadFont(font);
    };
    if (data.req.body.title) {
      await getFont(Jimp.FONT_SANS_64_WHITE).then(loadedFont => {
        font.portrait = loadedFont;
        font.square = loadedFont;
      });
      await getFont(Jimp.FONT_SANS_32_WHITE).then(loadedFont => {
        font.landscape = loadedFont;
      });
    }
    const getOrientation = jimp => {
      if (jimp.img.bitmap.width > jimp.img.bitmap.height) {
        return "landscape";
      } else if (jimp.img.bitmap.width < jimp.img.bitmap.height) {
        return "portrait";
      } else {
        return "square";
      }
    };

    const resize = (jimp, orientation) => {
      jimp.cover(
        config.image_size[orientation].width,
        config.image_size[orientation].height
      );
      return jimp;
    };

    const getTextDimensions = (font, text, orientation)=>{
      return {
        width: Jimp.measureText(font, text),
        height: Jimp.measureTextHeight(font, text)
      }
    }

    const addCaption = async (
      jimp,
      orientation,
      text,
      textBGColor,
      textColor = "#ffffff"
    ) => {
      return new Promise(async (resolve, reject) => {
        // console.log('inside promise...')
        const createTextBox = async dims => {
          return new Promise((res, rej) => {
            new Jimp(
              dims.width + config.padding[orientation],
              dims.height + config.padding[orientation],
              textBGColor,
              (err, img) => {
                if (err) rej(err);
                res(img);
              }
            );
          });
        };
        const textBoxDimensions = getTextDimensions(font[orientation], text, orientation);
        await createTextBox({
          width: textBoxDimensions.width,
          height: textBoxDimensions.height
        })
          .then(img => {
            img.print(
              font[orientation],
              config.padding[orientation] / 2,
              config.padding[orientation] / 2,
              text
            );
            positionItem(jimp, img, orientation);
            resolve();
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
      });
    };

    const positionItem = (jimp, overlayJimp, orientation, heightOffset = 0) => {
      console.log("positionItem fired....");
      jimp.composite(
        overlayJimp,
        jimp.bitmap.width -
          overlayJimp.bitmap.width -
          config.padding[orientation],
        jimp.bitmap.height -
          overlayJimp.bitmap.height -
          config.padding[orientation] -
          heightOffset
      );
    };

    const addLogo = (jimp, logo, orientation, heightOffset = 0) => {
      logo.resize(config.logo_size[orientation], Jimp.AUTO);
      if(data.req.body.title){
        const textDimensions = getTextDimensions(font[orientation], data.req.body.title, orientation)
        heightOffset = config.padding[orientation] + textDimensions.height
      }

      positionItem(jimp.img, logo, orientation, heightOffset)
    };

    const makeNewFilename = originalFilename => {
      const fileExt = originalFilename.match(/\.\w*$/g);
      const fileName = originalFilename.match(/^.*(?=\.)/g);

      return `${fileName}_processed${fileExt}`;
    };

    for (let jimp of data.jimps.images) {
      const orientation = getOrientation(jimp);
      resize(jimp.img, orientation);
      if (data.req.body.title) {
        await addCaption(
          jimp.img,
          orientation,
          data.req.body.title,
          data.req.body.titleBgColor
        );
      }
      const logoClone = data.jimps.logo.clone();
      addLogo(jimp, logoClone, orientation);
      const newFilename = makeNewFilename(jimp.filename);
      jimp.img.writeAsync(
        path.join(__dirname, "../", "temp", "processed", newFilename)
      );
    }
    res(data);
  });
};
