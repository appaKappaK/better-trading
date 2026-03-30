/* eslint-env node */
/* eslint-disable no-console */

/**
 * Patches vendor.js to fix Ember.js's DOM environment check in Firefox extensions.
 *
 * Firefox extension content scripts do have DOM access, but Ember's `hasDOM`
 * check inspects `self.constructor === Window` which can fail in Firefox's
 * extension runtime. This patch forces the check to always return true.
 */

const fs = require('fs');
const path = require('path');

const [target] = process.argv.slice(2);

const vendorPaths = {
  dev: './dist/dev/ember-build/assets/vendor.js',
  production: './dist/staged/assets/vendor.js',
};

const vendorPath = vendorPaths[target];

if (!vendorPath) {
  console.error('Usage: node patch-vendor-firefox.js [dev|production]');
  process.exit(1);
}

const fullPath = path.resolve(vendorPath);

if (!fs.existsSync(fullPath)) {
  console.error(`vendor.js not found at: ${fullPath}`);
  console.error('Make sure the extension has been built before running this script.');
  process.exit(1);
}

let content = fs.readFileSync(fullPath, 'utf8');
let patched = false;

// Minified form (production builds)
const minifiedBefore =
  /var t="object"==typeof self&&null!==self&&self\.Object===Object&&"undefined"!=typeof Window&&self\.constructor===Window&&"object"==typeof document&&null!==document&&self\.document===document&&"object"==typeof location&&null!==location&&self\.location===location&&"object"==typeof history&&null!==history&&self\.history===history&&"object"==typeof navigator&&null!==navigator&&self\.navigator===navigator&&"string"==typeof navigator\.userAgent/g;

if (minifiedBefore.test(content)) {
  content = content.replace(minifiedBefore, 'var t=true');
  patched = true;
}

// Unminified form (development builds)
const unminifiedBefore =
  /var hasDom = typeof self === 'object' && self !== null && self\.Object === Object && typeof Window !== 'undefined' && self\.constructor === Window && typeof document === 'object' && document !== null && self\.document === document && typeof location === 'object' && location !== null && self\.location === location && typeof history === 'object' && history !== null && self\.history === history && typeof navigator === 'object' && navigator !== null && self\.navigator === navigator && typeof navigator\.userAgent === 'string'/g;

if (unminifiedBefore.test(content)) {
  content = content.replace(unminifiedBefore, 'var hasDom=true');
  patched = true;
}

// core-js global detection uses Function('return this')() as a fallback when
// self.Math !== Math (which happens in Firefox extension isolated worlds).
// Replace with globalThis which is safe and CSP-compliant.
const coreJsGlobalPattern = /\/\/ eslint-disable-next-line no-new-func\s*\n\s*: Function\('return this'\)\(\);/g;

if (coreJsGlobalPattern.test(content)) {
  content = content.replace(
    coreJsGlobalPattern,
    ': (typeof globalThis !== \'undefined\' ? globalThis : self);'
  );
  patched = true;
}

if (patched) {
  fs.writeFileSync(fullPath, content);
  console.log('vendor.js patched for Firefox compatibility.');
} else {
  const alreadyPatched =
    content.includes('var t=true') ||
    content.includes('var hasDom=true') ||
    content.includes(": (typeof globalThis !== 'undefined' ? globalThis : self);");

  if (alreadyPatched) {
    console.log('vendor.js already patched for Firefox compatibility.');
    process.exit(0);
  }

  console.error('vendor.js patch failed: expected Firefox compatibility patterns were not found.');
  process.exit(1);
}
