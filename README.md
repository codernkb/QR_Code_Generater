# Laptop Asset QR Code Generator

A production-ready, single-page application for generating QR code stickers for company laptop assets. Scan any generated QR code to instantly view asset details on any mobile device.

## Features

- **Frontend-Only Mode**: Generate QR codes with embedded data (no backend required)
- **Backend Storage Mode**: Store assets in Supabase database for shorter QR codes
- **Comprehensive Validation**: Email, phone number, URL, and required field validation
- **Multiple Export Formats**: Download QR codes as PNG, SVG, or PDF
- **Mobile-Optimized Viewer**: Scan QR codes and view details on any device
- **Print-Ready PDFs**: A4 format with asset details for physical stickers
- **Professional UI**: Clean, responsive design suitable for corporate use

## User Flow

1. **Generate QR Code**
   - Open the website
   - Fill in laptop asset details (model, serial number, employee info, etc.)
   - Choose between frontend-only or database storage
   - Click "Generate QR Code"

2. **Download Sticker**
   - Preview the QR code
   - Download in your preferred format (PNG, SVG, or PDF)
   - Print and attach to laptop

3. **Scan QR Code**
   - Anyone can scan the QR code with their phone camera
   - Automatically opens a mobile-friendly page showing all asset details
   - Click-to-call phone numbers and click-to-email addresses

## Project Structure

```
project/
├── index.html              # Main QR generator page
├── view.html               # QR scan result viewer page
├── public/
│   ├── styles.css          # Professional CSS styling
│   ├── generator.js        # Form validation & QR generation
│   └── viewer.js           # QR data decoder & display
├── supabase/
│   └── functions/
│       └── assets/
│           └── index.ts    # Backend API for asset storage
└── .env                    # Supabase configuration
```

## Technology Stack

- **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript
- **QR Generation**: QRCode.js library
- **PDF Export**: jsPDF library
- **Backend**: Supabase Edge Functions
- **Database**: Supabase PostgreSQL
- **Build Tool**: Vite

## Quick Start

### Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The application will be available at `http://localhost:5173`

## Two Implementation Modes

### Mode 1: Frontend-Only (Default)

QR codes contain base64-encoded JSON data directly in the URL.

**Advantages:**
- No backend required
- Works immediately
- No database costs
- Data cannot be changed after generation

**URL Format:**
```
https://yourdomain.com/view.html?data=<base64EncodedJSON>
```

### Mode 2: Database Storage (Optional)

QR codes contain a short ID that references a database record.

**Advantages:**
- Shorter QR codes (easier to scan)
- Smaller printed stickers
- Can query/report on assets

**URL Format:**
```
https://yourdomain.com/view.html?id=abc123xyz
```

**To Use:**
Simply check the "Store in database" checkbox before generating the QR code.

## Data Structure

All asset records follow this JSON structure:

```json
{
  "laptopDetails": "Dell Latitude 7420",
  "serialNumber": "SN123456789",
  "employeeId": "EMP001",
  "contactNumber": "+1234567890",
  "employeeEmail": "john.doe@company.com",
  "supportContact": "+1987654321",
  "companyLink": "https://company.com/support",
  "generatedAt": "2024-01-15T10:30:00.000Z"
}
```

## Form Validation Rules

- **Laptop Details**: Required, non-empty
- **Serial Number**: Required, minimum 4 characters
- **Employee ID**: Required, non-empty
- **Contact Number**: Required, valid phone (10-15 digits)
- **Employee Email**: Required, valid email format
- **Support Contact**: Required, valid phone (10-15 digits)
- **Company Link**: Required, valid URL format

## QR Code Specifications

- **Resolution**: 512x512 pixels
- **Error Correction**: High (Level H)
- **Colors**: Black on white background
- **Format**: Supports high-density printing
- **Scannable From**: Paper, screens, and stickers

## PDF Export Details

Generated PDFs include:
- Company header
- High-resolution QR code
- Key asset information:
  - Laptop Model
  - Serial Number
  - Employee ID
  - Support Contact
- Generation timestamp

**Format**: A4 portrait, print-ready

## Backend Setup (Optional)

### Database Schema

The `laptop_assets` table is already created with this structure:

```sql
CREATE TABLE laptop_assets (
  id text PRIMARY KEY,
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
```

### API Endpoints

**Create Asset:**
```
POST /functions/v1/assets
Body: {JSON asset data}
Returns: { id: "abc123xyz" }
```

**Get Asset:**
```
GET /functions/v1/assets/{id}
Returns: {JSON asset data}
```

### Edge Function Deployment

The Supabase Edge Function is already deployed and configured.

## Security Features

- **XSS Prevention**: All user inputs are sanitized before display
- **Input Validation**: Comprehensive client-side validation
- **No Authentication**: Public access by design (for QR scanning)
- **RLS Enabled**: Row-level security configured on database
- **Public Policies**: Read and insert allowed for all users

## Mobile Optimization

The viewer page is fully optimized for mobile devices:
- Responsive card layout
- Click-to-call phone numbers (`tel:` links)
- Click-to-email addresses (`mailto:` links)
- Touch-friendly buttons
- Fast loading times

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### Deploy to Vercel/Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider

3. Ensure these files are publicly accessible:
   - `index.html` (generator)
   - `view.html` (viewer)
   - All assets in the `dist` folder

### Environment Variables

The Supabase connection details are already configured in `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Usage Tips

1. **For IT Departments:**
   - Use database storage mode for inventory tracking
   - Export PDFs for professional sticker printing
   - Include your company's support URL in the company link field

2. **For Asset Management:**
   - Use consistent serial number format
   - Include full contact information
   - Generate QR codes during laptop onboarding

3. **For Printing:**
   - Use the PDF export for professional results
   - Print on adhesive sticker paper
   - Ensure QR codes are at least 2cm x 2cm for reliable scanning

## Error Handling

The application gracefully handles:
- Invalid QR codes
- Corrupted base64 data
- Missing database records
- Network failures
- Invalid input data

All errors display user-friendly messages with technical details for debugging.

## Performance

- **Frontend-only QR generation**: Instant
- **Database-backed QR generation**: < 1 second
- **QR code scanning**: Instant
- **Page load time**: < 2 seconds

## License

This project is ready for production use in any company environment.

## Support

For issues or questions about the application, refer to the technical documentation in the code comments.
