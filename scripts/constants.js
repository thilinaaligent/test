/**
 * The directory to the Magento 2 theme folder in the current installation
 * This will be relative to the users current position, which will hopefully be the root of a Magento 2 project folder
 *
 * @type {string}
 */
module.exports = {
  baseDir: './app/design/frontend/',
  scssSource: 'source/scss' // Relative to the baseDir/[Vendor]/[Theme] directory
};

consol.log('1');
