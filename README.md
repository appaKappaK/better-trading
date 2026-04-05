# ⚠️ DISCONTINUED

**This fork is no longer maintained.** A native Firefox extension is now available.

👉 **[Better Trading for Firefox](https://addons.mozilla.org/en-US/firefox/addon/better-trading-for-firefox/)** – Built from scratch as a proper Firefox MV3 extension. No compatibility hacks, no unsigned installs, no developer edition required.

- **Install from [AMO](https://addons.mozilla.org/en-US/firefox/addon/better-trading-for-firefox/)**
- **View source on [GitHub](https://github.com/appaKappaK/better-trading-for-firefox)**

---

![logo](https://user-images.githubusercontent.com/4255460/70675096-29118280-1c56-11ea-8e58-c8e74423d0eb.png)

# Better Trading (Firefox port)

This was a Firefox-focused fork of Better Trading that enhanced the pathofexile.com trade site for Path of Exile and Path of Exile 2.

## Why this fork existed

The original Better Trading add-on is Chrome-first. This fork attempted to keep Firefox users in the loop through compatibility patches and manual workarounds.

## Why it's discontinued

The native [Better Trading for Firefox](https://addons.mozilla.org/en-US/firefox/addon/better-trading-for-firefox/) now offers:

- **Proper Firefox support** – Signed add-on, installs normally from AMO
- **Manifest V3** – Future-proof architecture
- **No compatibility hacks** – Built from scratch for Firefox
- **Seamless migration** – Import your existing bookmarks and data

## What happens to my data?

Your existing bookmarks and settings from this fork can be exported and imported into the new extension. See the migration guide in the new add-on's documentation.

## Original features (for reference)

- Bookmarks manager
- Equivalent pricing calculator (powered by [poe.ninja](https://poe.ninja/))
- Searched mods highlighting
- Pinned items
- Search history

## Development (archived)

For historical reference only – no further updates will be made.

1. Use Node.js 18 and npm.
2. Install dependencies with `npm install --legacy-peer-deps`.
3. Run `npm run dev`.
4. Load `./dist/dev/manifest.json` from `about:debugging`.

## Packaging (archived)

1. Run `npm run package`.
2. Install `dist-packages/better-trading-firefox.xpi` in Firefox Developer Edition.
3. If Firefox blocks unsigned installs on your setup, set `xpinstall.signatures.required` to `false` in `about:config`.

## Useful resources

- [Firefox about:debugging](https://extensionworkshop.com/documentation/develop/debugging/)
- [Firefox Add-on signing overview](https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/)
