const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const assetDetails = document.getElementById('assetDetails');
const errorDetails = document.getElementById('errorDetails');

function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showError(message, details = '') {
  loadingState.style.display = 'none';
  errorState.style.display = 'block';
  assetDetails.style.display = 'none';

  if (details) {
    errorDetails.textContent = details;
    errorDetails.style.display = 'block';
  }
}

function showAssetDetails(data) {
  loadingState.style.display = 'none';
  errorState.style.display = 'none';
  assetDetails.style.display = 'block';

  document.getElementById('viewLaptopDetails').textContent = data.laptopDetails || 'N/A';
  document.getElementById('viewSerialNumber').textContent = data.serialNumber || 'N/A';
  document.getElementById('viewEmployeeId').textContent = data.employeeId || 'N/A';

  const contactLink = document.getElementById('viewContactNumber');
  contactLink.textContent = data.contactNumber || 'N/A';
  contactLink.href = `tel:${data.contactNumber}`;

  const emailLink = document.getElementById('viewEmployeeEmail');
  emailLink.textContent = data.employeeEmail || 'N/A';
  emailLink.href = `mailto:${data.employeeEmail}`;

  const supportLink = document.getElementById('viewSupportContact');
  supportLink.textContent = data.supportContact || 'N/A';
  supportLink.href = `tel:${data.supportContact}`;

  const companyLink = document.getElementById('viewCompanyLink');
  companyLink.textContent = data.companyLink || 'N/A';
  companyLink.href = data.companyLink;

  const generatedDate = data.generatedAt ? new Date(data.generatedAt).toLocaleString() : 'N/A';
  document.getElementById('viewGeneratedAt').textContent = generatedDate;
}

function decodeBase64Data(encodedData) {
  try {
    const decoded = decodeURIComponent(encodedData);
    const jsonString = decodeURIComponent(escape(atob(decoded)));
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error('Failed to decode data: ' + error.message);
  }
}

async function fetchAssetById(assetId) {
  try {
    const supabaseUrl = 'https://owkwddfrytmprtphxgor.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93a3dkZGZyeXRtcHJ0cGh4Z29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNTI0MDUsImV4cCI6MjA4NTkyODQwNX0.awgPP9-CFxJG5pJgLZjgU8nT4bRkkXLg8OhYMYUKrJw';

    const response = await fetch(`${supabaseUrl}/functions/v1/assets/${assetId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Asset not found');
      }
      throw new Error('Failed to fetch asset data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Backend error: ' + error.message);
  }
}

function validateAssetData(data) {
  const requiredFields = [
    'laptopDetails',
    'serialNumber',
    'employeeId',
    'contactNumber',
    'employeeEmail',
    'supportContact',
    'companyLink',
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  return true;
}

async function loadAssetData() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const assetId = urlParams.get('id');
    const encodedData = urlParams.get('data');

    if (!assetId && !encodedData) {
      throw new Error('No asset data found in URL');
    }

    let assetData;

    if (assetId) {
      assetData = await fetchAssetById(assetId);
    } else {
      assetData = decodeBase64Data(encodedData);
    }

    validateAssetData(assetData);
    showAssetDetails(assetData);
  } catch (error) {
    console.error('Error loading asset:', error);
    showError('Invalid or corrupted QR Code', error.message);
  }
}

document.addEventListener('DOMContentLoaded', loadAssetData);
