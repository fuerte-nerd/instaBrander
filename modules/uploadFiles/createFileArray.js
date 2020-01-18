module.exports = files => {
  return new Promise((res, rej) => {
    const fileArr = [];
    files.constructor === Array
      ? files.map(i => {
          fileArr.push(i);
        })
      : fileArr.push(files);
    res(fileArr);
  });
};
