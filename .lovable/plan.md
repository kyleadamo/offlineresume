

## Add Favicon

Copy the uploaded image to the public directory and update `index.html` to reference it as the favicon.

### Changes

**1. Copy asset**
- Copy `user-uploads://offlineresume_favicon.png` to `public/favicon.png`
- Delete `public/favicon.ico` if it exists

**2. `index.html`**
- Add `<link rel="icon" href="/favicon.png" type="image/png">` in the `<head>`

