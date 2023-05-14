export const groupBy = (arr, property, transform = (p) => p) => {
  return arr.reduce((result, obj) => {
    const key = transform(obj[property]);
    if (!result[key]) result[key] = [];
    result[key].push(obj);
    return result;
  }, {});
};
