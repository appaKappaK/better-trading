/* eslint-env node */
/* eslint-disable no-console */

/**
 * Packages the extension as a Firefox-ready .xpi file.
 * Run with: npm run package-firefox
 *
 * To install permanently in Firefox Developer Edition:
 *   1. Set xpinstall.signatures.required = false in about:config
 *   2. Go to about:addons -> gear -> Install Add-on From File
 *   3. Select dist-packages/better-trading-firefox.xpi
 */

const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');
const {version} = require('../package.json');

const EMBER_BUILD_DIR = './dist/ember-build';
const STAGED_DIR = './dist/staged';
const STAGED_ASSETS_DIR = './dist/staged/assets';
const OUTPUT_DIR = './dist-packages';
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'better-trading-firefox.xpi');

function run(cmd, opts = {}) {
  console.log(`> ${cmd}`);
  execSync(cmd, {stdio: 'inherit', env: {...process.env, TARGET_BROWSER: 'firefox', NODE_OPTIONS: '--openssl-legacy-provider'}, ...opts});
}

// Clean
if (fs.existsSync('./dist')) fs.rmSync('./dist', {recursive: true});
if (fs.existsSync(OUTPUT_FILE)) fs.rmSync(OUTPUT_FILE);

// Build
run('npx ember build --environment production --output-path ' + EMBER_BUILD_DIR);

// Stage assets
fs.mkdirSync(STAGED_ASSETS_DIR, {recursive: true});
for (const file of ['better-trading.js', 'better-trading.css', 'vendor.js', 'vendor.css']) {
  fs.copyFileSync(path.join(EMBER_BUILD_DIR, 'assets', file), path.join(STAGED_ASSETS_DIR, file));
}
const imagesDir = path.join(EMBER_BUILD_DIR, 'assets', 'images');
if (fs.existsSync(imagesDir)) {
  fs.cpSync(imagesDir, path.join(STAGED_ASSETS_DIR, 'images'), {recursive: true});
}

// Generate manifest + copy extension files
run('node ./scripts/scaffold-extension.js production');

// Patch vendor.js for Firefox
run('node ./scripts/patch-vendor-firefox.js production');

// Zip into .xpi
fs.mkdirSync(OUTPUT_DIR, {recursive: true});

// Use 7z (available via scoop) — PowerShell Compress-Archive uses backslash paths
// which Firefox rejects. 7z creates proper forward-slash ZIP entries.
const {spawnSync} = require('child_process');
const stagedAbsolute = path.resolve(STAGED_DIR);
const xpiAbsolute = path.resolve(OUTPUT_FILE);
console.log(`> 7z a -tzip "${OUTPUT_FILE}" *`);
const result = spawnSync('7z', ['a', '-tzip', xpiAbsolute, '*'], {
  cwd: stagedAbsolute,
  stdio: 'inherit',
  env: {...process.env},
});
if (result.status !== 0) {
  console.error('7z failed. Make sure 7-Zip is installed (scoop install 7zip).');
  process.exit(1);
}

console.log(`\nDone! Firefox package: ${OUTPUT_FILE} (v${version})`);
console.log('\nTo install permanently:');
console.log('  1. Install Firefox Developer Edition');
console.log('  2. Go to about:config -> set xpinstall.signatures.required = false');
console.log('  3. Go to about:addons -> gear icon -> Install Add-on From File');
console.log(`  4. Select: ${xpiAbsolute}`);
