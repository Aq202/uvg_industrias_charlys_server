/* eslint-disable import/prefer-default-export */
const renderIndexPage = async (req, res) => {
  res.sendFile(`${global.dirname}\\public\\index.html`);
};

export { renderIndexPage };
