const objectToCSSBlock = function(scope, obj) {
  const props = Object.keys(obj).map((k) => `${k}: ${obj[k]}; `)
  return `${scope} { ${props.join("")} } `
};

const objectToCSS = function(obj) {
  return Object.keys(obj).reduce((acc, key) => acc += objectToCSSBlock(key, obj[key]), "");
};

export default objectToCSS;
