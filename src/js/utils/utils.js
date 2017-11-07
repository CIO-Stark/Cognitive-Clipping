exports.captalize = function (string) {
  let first = string.charAt(0).toUpperCase();

  return first + string.slice(1);
};

exports.indexOfObject = function (array, value, property) {
  let i = -1;

  array.some((entry, index) => {
    if (entry[property] === value) {
      i = index;
      return true;
    }

    return false;
  });

  return i;
};

exports.getStringDateMilliseconds = function (stringDate) {
    let splitted = stringDate.split('-');

    if (splitted.length === 3) {
        return new Date(splitted[0], splitted[1], splitted[2]).getTime();
    }

    return null;
};