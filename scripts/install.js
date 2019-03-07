#!/usr/bin/env node

'use strict';

const fs = require('fs-extra');
const cp = require('child_process');
const emoji = require('node-emoji');
const { Select, Input } = require('enquirer');

const getExistingThemes = require('./get-existing-themes');
const logger = require('./logger');
const { baseDir, scssSource } = require('./constants');

const replace = require('replace-in-file');

checkEnvironment(); // Ensure the script is being called from the right place

const themesOptions = getExistingThemes();

const selectTheme = new Select({
    name: 'theme',
    message: 'Select theme name',
    choices: [
        ...themesOptions,
        'Other'
    ]
});

/**
 * Check that the user is running the install command in the right directory
 *
 * @returns {Boolean}
 */
function checkEnvironment() {
    if (!fs.existsSync(baseDir)) {
        logger('Please run from base of Magento 2 project', 'error');
        process.exit();
    }
}

/**
 * Get the path to the theme that the repository is being installed in to
 *
 * @returns {string}
 */
async function getThemeDirectory() {
    let selectedTheme = 'Other'; // Default to 'Other' so that the user is asked to enter a theme name if none already exist

    // If there are existing themes, allow the user to optionally select one
    if (themesOptions.length > 0) {
        selectedTheme = await selectTheme.run();
    }

    if (selectedTheme === 'Other') {
        const createNewTheme = new Input({
            message: 'Please enter new theme name in format [Vendor]/[Theme]'
        });

        selectedTheme = await createNewTheme.run();
    }

    logger('Theme directory selected', 'log');
    logger(`New theme will be created in ${baseDir}${selectedTheme}`, 'log');
    return `${baseDir}${selectedTheme}`;
}

/**
 * Get the source directory for SCSS files
 *
 * @param {string} themeDirectory The base theme directory that we're working from
 *
 * @returns {string}
 */
function getSCSSSourceDirectory (themeDirectory) {
    return `${themeDirectory}/${scssSource}`;
}

async function createThemeStructure (themeDirectory) {
    logger('Downloading Aligent Seed Theme repository', 'log');
    // Download a zip of the archive
    cp.execSync('git archive --remote=ssh://git@github.com:thilinaaligent/test.git --format=zip --output="themeseed.zip" master');
    logger('Aligent Seed Theme successfully downloaded', 'success');
    cp.execSync(`unzip themeseed.zip -d '${themeDirectory}'`); // Extract to the SCSS source directory
    cp.execSync('rm themeseed.zip'); // Remove the downloaded zip
    // Remove all files/folder that aren't the `src` directory
    // cp.execSync(`find ${themeDirectory} -mindepth 1 ! -regex \'^${themeDirectory}/${scssSource}/src\\(/.*\\)?\' -delete`);
    // cp.execSync(`mv ${themeDirectory}/src/* ${themeDirectory}`); // Move everything in the `src` directory up one level, to be in the root of the SCSS source directory
    // cp.execSync(`rm -rf ${themeDirectory}/src`); // Remove the now empty `src` directory

    // try {
    //     const changes = await replace({
    //         files: `${themeDirectory}`,
    //         from: '[Vendor]/[Theme]',
    //         to: `${themeDirectory}`,
    //     });
    //     console.log('Modified files:', changes.join(', '));
    // }
    // catch (error) {
    //     console.error('Error occurred:', error);
    // }

    logger(`Added required theme files to ${themeDirectory}`, 'log');
}

function downloadInstallRepository(themeDirectory) {
    logger('Downloading Aligent SCSS Outline repository', 'log');
    // Download a zip of the archive
    cp.execSync('git archive --remote=ssh://git@bitbucket.org/aligent/scssoutline.git --format=zip --output="scssoutline.zip" master');
    logger('Aligent SCSS Outline successfully downloaded', 'success');
    cp.execSync(`unzip scssoutline.zip -d '${themeDirectory}/${scssSource}'`); // Extract to the SCSS source directory
    cp.execSync('rm scssoutline.zip'); // Remove the downloaded zip
    // Remove all files/folder that aren't the `src` directory
    cp.execSync(`find ${themeDirectory}/${scssSource} -mindepth 1 ! -regex \'^${themeDirectory}/${scssSource}/src\\(/.*\\)?\' -delete`);
    cp.execSync(`mv ${themeDirectory}/${scssSource}/src/* ${themeDirectory}/${scssSource}`); // Move everything in the `src` directory up one level, to be in the root of the SCSS source directory
    cp.execSync(`rm -rf ${themeDirectory}/${scssSource}/src`); // Remove the now empty `src` directory
    logger('Aligent SCSS Outline successfully installed', 'success');
}

/**
 * Install the Aligent SCSS Placeholder repository, which is required for the Aligent SCSS Outline to compile
 *
 * @returns {Buffer}
 */
function installDependency() {
    logger('Installing dependencies', 'log');
    return cp.execSync('npm i -S git+ssh://git@bitbucket.org/aligent/scssplaceholder.git#master');
}

try {
    (async () => {
        const themeDirectory = await getThemeDirectory();
        createThemeStructure(themeDirectory);
        const scssSource = getSCSSSourceDirectory(themeDirectory);
        logger('Checking for SCSS source directory', 'log');
        fs.ensureDirSync(scssSource); // Checks that there is a SCSS source directory, and creates it if not
        //downloadInstallRepository(themeDirectory);
        //installDependency();
        logger('Dependencies installed', 'success');
        logger(`Now is a good time to create a pull request ${emoji.get('fire')}`, 'log');
    })();

} catch (err) {
    logger('There was an error installing the package', 'error');
}


