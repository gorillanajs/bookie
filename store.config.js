// App Store listing for `eas metadata:push` (selected via `metadataPath` in eas.json).
// Public listing content lives in store.config.json. App Review contact details
// (name, phone) are personal, so they're kept in store.review.local.json, which is
// gitignored, and merged in here.
const fs = require('fs');
const path = require('path');

const config = require('./store.config.json');

const reviewPath = path.join(__dirname, 'store.review.local.json');
if (fs.existsSync(reviewPath)) {
  const contact = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
  config.apple.review = { ...config.apple.review, ...contact };
} else {
  console.warn(
    'store.review.local.json not found: App Review contact details will be missing. ' +
      'Create it with { "firstName", "lastName", "email", "phone" }.',
  );
}

module.exports = config;
