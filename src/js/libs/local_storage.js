/**
 * Simple Browser Local Storage Wrapper
 * 
 */

/**
 * Recovers a value based on the given key
 * @param {string} key - key identifier of the value saved
 * @return {any} value
 */
exports.getItem = key => {
  let value = localStorage.getItem(key);
  try {
    value = JSON.parse(value);
  } catch (e) {
    value = localStorage.getItem(key);
  }
  return value;
};

/**
 * Store a pair-value item 
 * @param {string} key - key identifier of the value saved
 * @param {any} value - value to be saved
 */
exports.setItem = (key, value) => {
  if (typeof value === 'object') {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    localStorage.setItem(key, value);
  }
};

/**
 * Delete a storaged item
 * @param {string} key - key identifier of the value saved
 */
exports.deleteItem = key => {
  localStorage.removeItem(key);
};

/**
 * Delete all data storaged
 * @param {string} key - key identifier of the value saved
 */
exports.clear = key => {
  localStorage.clear();
};