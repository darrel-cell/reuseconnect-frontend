# Logo Setup Guide

## 📁 Place Your Logo Here

Put your platform logo in this directory (`frontend/public/`):

```
frontend/public/
  ├── logo.avif         ← YOUR MAIN LOGO (required)
  ├── logo-icon.avif    ← Icon-only version (optional)
  ├── favicon.ico       ← Browser tab icon (recommended)
  └── ...
```

## ✅ What's Already Configured

The code is already set up to use `/logo.avif` in:
- **Login Page** - Large logo (h-16)
- **Sidebar** - Responsive logo (h-10 expanded, h-8 collapsed)
- **Tenant Theme Context** - Default fallback

## 🎨 Logo Requirements

### Main Logo (`logo.avif`)
- **Format**: AVIF (modern, high compression) or PNG/SVG
- **Dimensions**: 
  - Height: 40-64px
  - Width: Auto (will scale proportionally)
- **Background**: Transparent (if supported by AVIF encoder)
- **Colors**: Should work on both light and dark backgrounds
- **Quality**: 80-90 (AVIF compression setting)

### Favicon (`favicon.ico`)
- **Format**: ICO
- **Sizes**: 16x16, 32x32, 48x48 (multi-resolution)
- **Tool**: Use https://realfavicongenerator.net/

## 🚀 Quick Start

1. **Add your logo:**
   ```bash
   # Copy your logo file here
   cp /path/to/your/logo.avif frontend/public/logo.avif
   ```

2. **Convert to AVIF** (if you have PNG/JPG):
   ```bash
   # Using online tools:
   # - https://avif.io/
   # - https://squoosh.app/
   
   # Or using CLI:
   npm install -g @squoosh/cli
   squoosh-cli --avif '{"quality":85}' logo.png
   ```

3. **Update favicon** (optional):
   ```bash
   cp /path/to/your/favicon.ico frontend/public/favicon.ico
   ```

3. **Restart dev server** (if running):
   ```bash
   # In frontend directory
   npm run dev
   ```

4. **Check it works:**
   - Open http://localhost:5173/login
   - Logo should appear on login page and sidebar

## 🖼️ Why AVIF?

- **Smaller file size**: 50% smaller than JPEG, 20% smaller than WebP
- **Better quality**: Superior compression at same quality level
- **Modern format**: Supported by all modern browsers (2021+)
- **Transparency**: Supports alpha channel like PNG
- **Fallback**: Code automatically shows placeholder if not supported

## 🔄 Fallback Behavior

If logo file is missing or fails to load:
- Shows first letter of tenant name in a colored circle
- Example: "R" for "Reuse ITAD Platform"

## 🏢 Multi-Tenant Support

For tenant-specific logos:
- Tenant logos override the default `/logo.svg`
- Configure in tenant settings (when backend is ready)
- Format: URL or base64 encoded image

## 📝 Notes

- Logo is automatically responsive
- Works in both light and dark themes
- Cached by browser (update filename to force refresh)
- SVG recommended for crisp display at any size

---

**Need help?** Check the components:
- `frontend/src/contexts/TenantThemeContext.tsx`
- `frontend/src/pages/app/Login.tsx`
- `frontend/src/components/layout/AppSidebar.tsx`

