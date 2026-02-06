# Quick Start Guide

Get your Laptop Asset QR Code Generator running in 5 minutes.

## Installation

```bash
# Clone or download the project
cd laptop-asset-qr-generator

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

## First QR Code in 60 Seconds

### Step 1: Fill the Form

Open the application and enter sample data:

```
Laptop Model: Dell Latitude 7420
Serial Number: SN123456789
Employee ID: EMP001
Contact Number: +1234567890
Employee Email: john.doe@company.com
Support Contact: +1987654321
Company Link: https://example.com/support
```

### Step 2: Generate

Click **"Generate QR Code"**

You'll see:
- Large QR code preview
- Asset details summary
- Download buttons

### Step 3: Download

Choose your format:
- **PNG**: For digital use
- **SVG**: For design software
- **PDF**: For printing stickers

### Step 4: Test

1. Download the QR code
2. Open it on your computer screen
3. Scan with your phone camera
4. View asset details instantly!

## Understanding the Two Modes

### Frontend-Only Mode (Default)

**When to use**: Simple deployment, no backend needed

**How it works**: QR code contains all data embedded in URL

**Pros**:
- Zero setup
- No backend costs
- Works immediately

**Cons**:
- Longer QR codes
- Can't update data after generation

**URL Example**:
```
https://yoursite.com/view.html?data=eyJsYXB0b3BEZXRhaWxzIjoiRGVsbC...
```

### Backend Storage Mode

**When to use**: Need shorter QR codes or want to track assets

**How it works**: QR code contains short ID, data stored in database

**Pros**:
- Shorter QR codes (easier to scan)
- Can query all assets
- Professional reporting

**Cons**:
- Requires Supabase setup (already done!)
- Uses database storage

**URL Example**:
```
https://yoursite.com/view.html?id=abc123xyz
```

**To enable**: Check "Store in database" before generating

## Common Use Cases

### IT Department Onboarding

```
1. Employee receives new laptop
2. IT fills form with laptop details
3. Generate QR code with PDF export
4. Print and attach sticker to laptop
5. Employee can scan anytime for support info
```

### Asset Audit

```
1. Walk through office
2. Scan QR codes on laptops
3. Verify employee assignments
4. Update records if needed
```

### Support Helpdesk

```
1. Employee has laptop issue
2. Scan QR code on laptop
3. Get employee contact info
4. Get serial number for warranty
5. Access company support link
```

## Customization Tips

### Change Company Name

Edit `public/generator.js` line 304:
```javascript
pdf.text('Your Company Name - Laptop Asset', pageWidth / 2, 20);
```

### Change Colors

Edit `public/styles.css`:
```css
:root {
  --primary-color: #2563eb;  /* Change to your brand color */
}
```

### Add Company Logo

Add to PDF export in `generator.js`:
```javascript
const logo = 'data:image/png;base64,...';  // Your logo
pdf.addImage(logo, 'PNG', 10, 10, 30, 30);
```

## Deployment in 5 Minutes

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Build project
npm run build

# Deploy
vercel --prod
```

Done! You'll get a URL like `your-project.vercel.app`

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

Done! You'll get a URL like `your-project.netlify.app`

## Enabling Backend Storage

Already configured! The database and API are ready to use.

Just check "Store in database" when generating QR codes.

### Verify Backend Works

1. Generate QR with "Store in database" checked
2. Note the short URL (e.g., `view.html?id=abc123`)
3. Scan the QR code
4. Should display asset details from database

### View Database

1. Go to Supabase Dashboard
2. Select your project
3. Click "Table Editor"
4. View "laptop_assets" table
5. See all generated assets

## Troubleshooting

### QR Code Not Generating

**Check**: Browser console for errors
**Fix**: Ensure QRCode.js library is loading

### Database Storage Not Working

**Check**: Network tab for API errors
**Fix**: Verify Supabase credentials are correct

### QR Code Not Scannable

**Fix**:
- Increase QR code size
- Print larger (min 2cm x 2cm)
- Ensure good lighting when scanning

## Next Steps

1. **Read README.md**: Full feature documentation
2. **Read DEPLOYMENT.md**: Production deployment guide
3. **Read ARCHITECTURE.md**: Technical deep dive

## Support

- Check browser console for detailed errors
- Review error messages on viewer page
- Verify all form fields are filled correctly

## Production Checklist

Before deploying to production:

- [ ] Update Supabase credentials (if using backend)
- [ ] Configure custom domain
- [ ] Test QR codes print at correct size
- [ ] Verify mobile scanning works
- [ ] Test all download formats
- [ ] Add company branding (optional)
- [ ] Set up analytics (optional)
- [ ] Configure backup strategy (if using backend)

## Quick Reference

**Generate QR**: Fill form → Click "Generate QR Code"

**Frontend Mode**: Default (long URL)

**Backend Mode**: Check "Store in database" (short URL)

**Download**: PNG (digital) | SVG (design) | PDF (print)

**Scan**: Phone camera → View asset details

**Deploy**: `npm run build` → Deploy dist folder

**Costs**: $0 (free tier) to $25/month (production scale)

---

You're now ready to generate professional laptop asset QR codes!

For detailed documentation, see:
- README.md - Full documentation
- DEPLOYMENT.md - Deployment guide
- ARCHITECTURE.md - Technical details
