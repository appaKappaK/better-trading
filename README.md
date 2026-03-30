![logo](https://user-images.githubusercontent.com/4255460/70675096-29118280-1c56-11ea-8e58-c8e74423d0eb.png)

# Better trading

A Firefox-focused fork of Better Trading that enhances the pathofexile.com trade site experience for Path of Exile and Path of Exile 2.

<img src="./.github/readme/firefox-button.png" alt="Firefox-focused fork">

## Firefox-first fork

- This fork targets Firefox instead of trying to stay dual-browser.
- The current install path is aimed at advanced users on Firefox Developer Edition or other Firefox builds that allow unsigned extensions.
- Firefox support still relies on a compatibility patch for the generated Ember vendor bundle, so this should be treated as a focused port rather than a clean browser-agnostic implementation.

## Features

- Bookmarks manager
- Equivalent pricing calculator (powered by [poe.ninja](https://poe.ninja/))
- Searched mods highlighting
- Pinned items
- Search history

## Development

1. Use Node.js 18 and npm.
2. Install dependencies with `npm install --legacy-peer-deps`.
3. Run `npm run dev`.
4. Load `./dist/dev/manifest.json` from `about:debugging`.

## Packaging

1. Run `npm run package`.
2. Install `dist-packages/better-trading-firefox.xpi` in Firefox Developer Edition.
3. If Firefox blocks unsigned installs on your setup, set `xpinstall.signatures.required` to `false` in `about:config`.

## Useful resources

- [Firefox about:debugging](https://extensionworkshop.com/documentation/develop/debugging/)
- [Firefox Add-on signing overview](https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/)
