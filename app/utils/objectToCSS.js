const objectToCSSBlock = (scope, obj) => {
  const props = Object.keys(obj).map((k) => `${k}: ${obj[k]}; `);
  return `${scope} { ${props.join('')} } `;
};

const objectToCSS = (obj) => {
  const cssString = Object.keys(obj)
    .reduce((acc, key) => acc + objectToCSSBlock(key, obj[key]), '');
  return cssString;
};

export default objectToCSS;
