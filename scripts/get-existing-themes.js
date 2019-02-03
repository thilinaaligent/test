const { readdirSync, statSync } = require('fs');
const { join } = require('path');
const { baseDir } = require('./constants');

/**
 * Read the subdirectories of a given directory
 *
 * @param {string} directory
 *
 * @returns {array}
 */
const readDir = (directory) => {
  return readdirSync(directory).filter(f => statSync(join(directory, f)).isDirectory());
};

/**
 * Flatten a multi-level array into a single level
 *
 * @param {array} array The array to flatten
 *
 * @returns {*[]}
 */
const flattenArray = (array) => {
  return [].concat.apply([], array)
};

/**
 * Find the themes that already exist in the current site
 *
 * @returns array
 */
module.exports = () => {
  const vendors = readDir(baseDir);
  const themes = vendors.map((vendor) => {
    const themeNames = readDir(`${baseDir}/${vendor}`);

    return {
      [vendor]: themeNames
    };
  }).filter(theme => Object.values(theme)[0].length > 0); // Remove vendors that don't have a theme folder inside

  const vendorThemes = themes.map((theme) => {
    const vendor = Object.keys(theme)[0];
    const vendorThemes = Object.values(theme)[0];

    return vendorThemes.map(vendorTheme => `${vendor}/${vendorTheme}`);
  });

  return flattenArray(vendorThemes);
};
