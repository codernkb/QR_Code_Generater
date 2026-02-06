# Deployment Guide

This guide provides step-by-step instructions for deploying the Laptop Asset QR Code Generator application.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (for backend features)

## Deployment Options

### Option 1: Frontend-Only Deployment (No Backend)

This is the simplest deployment option. QR codes will contain embedded data.

#### Step 1: Build the Application

```bash
npm install
npm run build
```

#### Step 2: Deploy to Static Host

The `dist` folder contains all files needed. Deploy to any static hosting service:

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**GitHub Pages:**
```bash
# Push dist folder to gh-pages branch
npm run build
git subtree push --prefix dist origin gh-pages
```

**AWS S3 + CloudFront:**
```bash
aws s3 sync dist/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

#### Step 3: Configure Domain (Optional)

Point your domain to your hosting provider following their DNS configuration guides.

### Option 2: Full Stack Deployment (With Backend)

Deploy both frontend and Supabase backend for database-backed QR codes.

#### Prerequisites for Backend

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Supabase Project**: Create a new project

#### Step 1: Configure Supabase

1. Create a new Supabase project
2. Note your project URL and anon key from Settings > API
3. Update `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. Update hardcoded URLs in JavaScript files:

**In `public/generator.js`** (line 119):
```javascript
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';
```

**In `public/viewer.js`** (line 63):
```javascript
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';
```

#### Step 2: Database Migration (Already Applied)

The database schema is already created. To verify:

```sql
-- Check if table exists
SELECT * FROM laptop_assets LIMIT 1;
```

To manually create (if needed):

```sql
CREATE TABLE IF NOT EXISTS laptop_assets (
  id text PRIMARY KEY DEFAULT substr(md5(random()::text || clock_timestamp()::text), 1, 10),
  laptop_details text NOT NULL,
  serial_number text NOT NULL,
  employee_id text NOT NULL,
  contact_number text NOT NULL,
  employee_email text NOT NULL,
  support_contact text NOT NULL,
  company_link text NOT NULL,
  generated_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE laptop_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read laptop assets"
  ON laptop_assets FOR SELECT USING (true);

CREATE POLICY "Anyone can insert laptop assets"
  ON laptop_assets FOR INSERT WITH CHECK (true);

CREATE INDEX idx_laptop_assets_serial_number ON laptop_assets(serial_number);
CREATE INDEX idx_laptop_assets_employee_id ON laptop_assets(employee_id);
```

#### Step 3: Deploy Edge Function (Already Deployed)

The Edge Function is already deployed. To verify or redeploy manually:

The function is located at: `supabase/functions/assets/index.ts`

It's already deployed and accessible at:
```
https://your-project.supabase.co/functions/v1/assets
```

#### Step 4: Build and Deploy Frontend

```bash
# Build with updated environment variables
npm run build

# Deploy to your preferred host
vercel --prod
# or
netlify deploy --prod --dir=dist
```

#### Step 5: Test the Deployment

1. Open your deployed URL
2. Fill in the form with test data
3. **Without database**: Generate QR code (long URL)
4. **With database**: Check "Store in database" and generate (short URL)
5. Scan QR code with phone to verify viewer page works

## Environment Variables for Production

Create a `.env.production` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**IMPORTANT**: The current implementation has hardcoded Supabase credentials in the JavaScript files. For production:

1. Use environment variables during build:
   ```bash
   VITE_SUPABASE_URL=https://your-url.supabase.co npm run build
   ```

2. Or update the hardcoded values in:
   - `public/generator.js` (line 119-120)
   - `public/viewer.js` (line 63-64)

## Monitoring and Analytics

### Supabase Dashboard

Monitor your backend through Supabase Dashboard:
- **Table Editor**: View all generated assets
- **Database**: Check query performance
- **Edge Functions**: View function logs and metrics
- **API Logs**: Monitor API requests

### Frontend Analytics

Add analytics by including tracking scripts in `index.html` and `view.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Security Considerations

### Production Checklist

- [ ] HTTPS enabled on domain
- [ ] CORS properly configured
- [ ] Rate limiting enabled (via Supabase or CDN)
- [ ] Input validation working correctly
- [ ] XSS protection verified
- [ ] Database RLS policies tested
- [ ] Edge function error handling tested
- [ ] Backup strategy in place

### Rate Limiting

Add rate limiting to prevent abuse:

**Via Cloudflare:**
1. Add site to Cloudflare
2. Enable rate limiting rules
3. Set limits: 10 requests per minute per IP

**Via Supabase:**
Rate limiting is handled automatically by Supabase for Edge Functions.

## Backup Strategy

### Database Backups

Supabase automatically backs up your database. To manually backup:

```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Or use pg_dump if you have database credentials
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql
```

### Restore from Backup

```bash
psql -h db.your-project.supabase.co -U postgres -d postgres < backup.sql
```

## Performance Optimization

### CDN Configuration

Serve static assets via CDN:
- Use Cloudflare, AWS CloudFront, or Vercel Edge Network
- Cache static files for 1 year
- Enable gzip/brotli compression

### Database Optimization

The schema includes indexes on commonly queried fields:
- `serial_number` (for lookups)
- `employee_id` (for reporting)

Add more indexes if needed:

```sql
CREATE INDEX idx_laptop_assets_created_at ON laptop_assets(created_at DESC);
```

## Troubleshooting

### QR Codes Not Generating

**Issue**: QR code doesn't appear after clicking "Generate"

**Solutions**:
1. Check browser console for JavaScript errors
2. Verify QRCode.js library is loading
3. Check that form validation is passing

### Database Storage Not Working

**Issue**: Error when checking "Store in database"

**Solutions**:
1. Verify Supabase URL and keys are correct
2. Check Edge Function is deployed: `https://your-project.supabase.co/functions/v1/assets`
3. Verify RLS policies allow public insert
4. Check browser network tab for API errors

### QR Codes Not Scannable

**Issue**: Phone camera doesn't recognize QR code

**Solutions**:
1. Increase QR code size (edit `width` and `height` in generator.js)
2. Ensure error correction level is High (already set)
3. Print QR codes larger (minimum 2cm x 2cm)
4. Verify URL in QR code is valid

### View Page Shows Error

**Issue**: Scanning QR shows "Invalid or Corrupted QR Code"

**Solutions**:
1. Verify the URL contains `data=` or `id=` parameter
2. Check base64 encoding/decoding
3. For database mode: verify asset ID exists in database
4. Check browser console for detailed error message

## Scaling Considerations

### High Traffic

For enterprise deployment with high traffic:

1. **CDN**: Use a global CDN for static assets
2. **Database**: Supabase handles scaling automatically
3. **Edge Functions**: Auto-scale with Supabase
4. **Monitoring**: Set up alerts for high error rates

### Large Asset Database

If storing thousands of assets:

1. **Pagination**: Add pagination to any admin interfaces
2. **Archiving**: Archive old/decommissioned assets
3. **Indexes**: Ensure proper indexing for fast lookups
4. **Backup**: Regular automated backups

## Custom Domain Setup

### Using Vercel

1. Deploy project to Vercel
2. Go to Project Settings > Domains
3. Add your custom domain
4. Update DNS records as instructed

### Using Netlify

1. Deploy to Netlify
2. Go to Domain Settings
3. Add custom domain
4. Configure DNS:
   ```
   A Record: @ -> 75.2.60.5
   CNAME: www -> your-site.netlify.app
   ```

## Cost Estimation

### Frontend-Only Mode
- **Hosting**: Free (Vercel/Netlify free tier)
- **Total**: $0/month

### With Backend (Supabase)
- **Supabase Free Tier**:
  - 500MB database
  - 2GB bandwidth
  - 50,000 Edge Function invocations
- **Hosting**: Free (Vercel/Netlify)
- **Total**: $0/month (within free tier limits)

### Production Scale
- **Supabase Pro**: $25/month
  - 8GB database
  - 50GB bandwidth
  - 2M Edge Function invocations
- **Hosting**: Free - $20/month
- **Total**: $25-45/month

## Support and Maintenance

### Regular Maintenance Tasks

1. **Weekly**: Check error logs
2. **Monthly**: Review database growth
3. **Quarterly**: Update dependencies
4. **Yearly**: Review security policies

### Updating the Application

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Run tests (if any)
npm test

# Build
npm run build

# Deploy
vercel --prod
```

## Rollback Procedure

If deployment has issues:

### Vercel
```bash
vercel rollback
```

### Netlify
Go to Deploys > Click on previous successful deploy > Publish deploy

### Database
```bash
# Restore from backup
psql -h db.your-project.supabase.co -U postgres -d postgres < backup.sql
```

## Contact and Support

For deployment assistance, refer to:
- Supabase Documentation: https://supabase.com/docs
- Vercel Documentation: https://vercel.com/docs
- Netlify Documentation: https://docs.netlify.com
