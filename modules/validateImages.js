const config = require("./config");

const validateImages = data => {
  return new Promise((res, rej) => {
    console.log('\nValidating images...')
    const checkSize = (jimp, orientation) => {
      if (
        jimp.img.bitmap.width < config.image_size[orientation].width ||
        jimp.img.bitmap.height < config.image_size[orientation].height
      ) {
        rej(`${jimp.filename} is not large enough. Please remove it and try again.`);
      }

    };
    for (let jimp of data.jimps.images) {
      if (jimp.img.bitmap.width > jimp.img.bitmap.height) {
        checkSize(jimp, "landscape");
      } else if (jimp.img.bitmap.width < jimp.img.bitmap.height) {
        checkSize(jimp, "portrait");
      } else {
        checkSize(jimp, "square");
      }
    }

    if(data.jimps.logo.bitmap.width < config.min_logo_size && data.jimps.logo.bitmap.height < config.min_logo_size){
        rej('Your logo image is too small.')
    }
    res(data);
  });
};

module.exports = validateImages;
