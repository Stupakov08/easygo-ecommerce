const returnError = res => err => {
  const { status, message, stack } = err;
  return res
    .status(status || 500)
    .json({ message, ...(process.env.NODE_MODE && { stack }) });
};

const returnAuthTokens = (res, req) => ({ accessToken, refreshToken }) => {
  return res.status(200).json({ accessToken, refreshToken });
};

const returnBody = (res, req) => body => {
  return res.status(200).json(body);
};
const returnData = (res, req) => ({ data, total }) => {
  res.setHeader('X-Total-Count', total);
  res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
  return res.status(200).json(data);
};

const isDevelopmentMode = () => {
  return process.env.NODE_MODE === 'development' ? true : false;
};
const addIdField = products => {
  return Array.isArray(products)
    ? products.map(i => ({ ...i, id: i._id }))
    : { ...products, id: products._id };
};
const makeImageUrl = p => {
  if (!p.images) return p;
  let images = p.images.map(i => {
    return i && { ...i, url: `http://localhost:8000/static/products/${i.url}` };
  });
  return { ...p, images };
};
const filterByProps = (res, arrayOfProps) => {
  if (Array.isArray(res)) {
    return (
      res &&
      res.map(r => {
        const newObj = {};
        arrayOfProps.map(prop => {
          newObj[prop] = r[prop];
        });
        return newObj;
      })
    );
  } else {
    const newObj = {};
    arrayOfProps.map(prop => {
      newObj[prop] = res[prop];
    });
    return newObj;
  }
};
const makeImageUrls = products => {
  if (Array.isArray(products)) {
    return products.map(makeImageUrl);
  }
  return makeImageUrl(products);
};
const decodeBase64Image = dataString => {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = Buffer.from(matches[2], 'base64');

  return response;
};

module.exports = {
  returnError,
  returnAuthTokens,
  isDevelopmentMode,
  returnBody,
  addIdField,
  returnData,
  decodeBase64Image,
  makeImageUrls,
  filterByProps,
};
