/* eslint-env node */

const fs = require('fs');
const path = require('path');
const [target] = process.argv.slice(2);

const targetBrowser = process.env.TARGET_BROWSER || 'chrome';
const isFirefox = targetBrowser === 'firefox';

const outputDir = {
  dev: './dist/dev',
  production: './dist/staged',
}[target];

const packageJson = JSON.parse(fs.readFileSync('./package.json'));

const assetsPathFor = (assetsRelativePath) => {
  const path = `assets/${assetsRelativePath}`;

  if (target === 'production') return path;
  return `ember-build/${path}`;
};

// Firefox uses background.scripts; Chrome MV3 requires service_worker
const backgroundField = isFirefox
  ? {scripts: ['background.js']}
  : {service_worker: 'background.js'};

// Firefox requires a gecko id for storage to persist between sessions
const firefoxSpecificFields = isFirefox
  ? {
      browser_specific_settings: {
        gecko: {
          id: 'better-trading@exile-center',
          strict_min_version: '109.0',
        },
      },
    }
  : {};

const manifest = Object.assign(
  {
    version: packageJson.version,
    manifest_version: 3,
    content_scripts: [
      {
        matches: ['*://www.pathofexile.com/trade*', '*://pathofexile.com/trade*'],
        js: [assetsPathFor('vendor.js'), assetsPathFor('better-trading.js')],
        css: [assetsPathFor('vendor.css'), assetsPathFor('better-trading.css')],
      },
    ],
    background: backgroundField,
    permissions: ['storage'],
    host_permissions: ['*://poe.ninja/*'],
    web_accessible_resources: [
      {
        resources: [assetsPathFor('images/*')],
        matches: ['*://www.pathofexile.com/*', '*://pathofexile.com/*'],
      },
    ],
    icons: {
      16: 'icon16.png',
      48: 'icon48.png',
      64: 'icon64.png',
      128: 'icon128.png',
    },
    ...firefoxSpecificFields,
  },
  packageJson.manifest
);

fs.mkdirSync(outputDir, {recursive: true});
for (const file of fs.readdirSync('./extension')) {
  fs.copyFileSync(path.join('./extension', file), path.join(outputDir, file));
}
fs.writeFileSync(path.join(outputDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
