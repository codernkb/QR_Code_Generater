let currentAssetData = null;
let currentQRUrl = null;

const form = document.getElementById('assetForm');
const formSection = document.getElementById('formSection');
const qrSection = document.getElementById('qrSection');
const backBtn = document.getElementById('backBtn');

const errorElements = {
  laptopDetails: document.getElementById('laptopDetailsError'),
  serialNumber: document.getElementById('serialNumberError'),
  employeeId: document.getElementById('employeeIdError'),
  contactNumber: document.getElementById('contactNumberError'),
  employeeEmail: document.getElementById('employeeEmailError'),
  supportContact: document.getElementById('supportContactError'),
  companyLink: document.getElementById('companyLinkError'),
};

function clearErrors() {
  Object.keys(errorElements).forEach(field => {
    const input = document.getElementById(field);
    const errorSpan = errorElements[field];
    if (input) input.classList.remove('error');
    if (errorSpan) errorSpan.textContent = '';
  });
}

function showError(field, message) {
  const input = document.getElementById(field);
  const errorSpan = errorElements[field];
  if (input) input.classList.add('error');
  if (errorSpan) errorSpan.textContent = message;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
}

function validateURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function validateForm(formData) {
  clearErrors();
  let isValid = true;

  if (!formData.laptopDetails.trim()) {
    showError('laptopDetails', 'Laptop details are required');
    isValid = false;
  }

  if (!formData.serialNumber.trim()) {
    showError('serialNumber', 'Serial number is required');
    isValid = false;
  } else if (formData.serialNumber.trim().length < 4) {
    showError('serialNumber', 'Serial number must be at least 4 characters');
    isValid = false;
  }

  if (!formData.employeeId.trim()) {
    showError('employeeId', 'Employee ID is required');
    isValid = false;
  }

  if (!formData.contactNumber.trim()) {
    showError('contactNumber', 'Contact number is required');
    isValid = false;
  } else if (!validatePhone(formData.contactNumber)) {
    showError('contactNumber', 'Please enter a valid phone number (10-15 digits)');
    isValid = false;
  }

  if (!formData.employeeEmail.trim()) {
    showError('employeeEmail', 'Employee email is required');
    isValid = false;
  } else if (!validateEmail(formData.employeeEmail)) {
    showError('employeeEmail', 'Please enter a valid email address');
    isValid = false;
  }

  if (!formData.supportContact.trim()) {
    showError('supportContact', 'Support contact is required');
    isValid = false;
  } else if (!validatePhone(formData.supportContact)) {
    showError('supportContact', 'Please enter a valid phone number (10-15 digits)');
    isValid = false;
  }

  if (!formData.companyLink.trim()) {
    showError('companyLink', 'Company link is required');
    isValid = false;
  } else if (!validateURL(formData.companyLink)) {
    showError('companyLink', 'Please enter a valid URL (e.g., https://example.com)');
    isValid = false;
  }

  return isValid;
}

function sanitizeInput(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function saveToBackend(assetData) {
  try {
    const supabaseUrl = 'https://owkwddfrytmprtphxgor.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93a3dkZGZyeXRtcHJ0cGh4Z29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNTI0MDUsImV4cCI6MjA4NTkyODQwNX0.awgPP9-CFxJG5pJgLZjgU8nT4bRkkXLg8OhYMYUKrJw';

    const response = await fetch(`${supabaseUrl}/functions/v1/assets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey,
      },
      body: JSON.stringify(assetData),
    });

    if (!response.ok) {
      throw new Error('Failed to save asset');
    }

    const result = await response.json();
    return result.id;
  } catch (error) {
    console.error('Backend save error:', error);
    throw error;
  }
}

function encodeAssetData(assetData) {
  const jsonString = JSON.stringify(assetData);
  const base64 = btoa(unescape(encodeURIComponent(jsonString)));
  return encodeURIComponent(base64);
}

function generateQRUrl(assetData, assetId = null) {
  const baseUrl = window.location.origin;

  if (assetId) {
    return `${baseUrl}/view.html?id=${assetId}`;
  } else {
    const encoded = encodeAssetData(assetData);
    return `${baseUrl}/view.html?data=${encoded}`;
  }
}

function displayAssetDetails(assetData) {
  const preview = document.getElementById('detailsPreview');
  preview.innerHTML = `
    <div class="detail-row">
      <div class="detail-label">Laptop Model:</div>
      <div class="detail-value">${sanitizeInput(assetData.laptopDetails)}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Serial Number:</div>
      <div class="detail-value">${sanitizeInput(assetData.serialNumber)}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Employee ID:</div>
      <div class="detail-value">${sanitizeInput(assetData.employeeId)}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Contact Number:</div>
      <div class="detail-value">${sanitizeInput(assetData.contactNumber)}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Employee Email:</div>
      <div class="detail-value">${sanitizeInput(assetData.employeeEmail)}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Support Contact:</div>
      <div class="detail-value">${sanitizeInput(assetData.supportContact)}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Company Link:</div>
      <div class="detail-value">${sanitizeInput(assetData.companyLink)}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Generated At:</div>
      <div class="detail-value">${new Date(assetData.generatedAt).toLocaleString()}</div>
    </div>
  `;
}

function generateQRCode(url) {
  const qrContainer = document.getElementById('qrCode');
  qrContainer.innerHTML = '';

  new QRCode(qrContainer, {
    text: url,
    width: 512,
    height: 512,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H,
  });
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const formData = {
    laptopDetails: document.getElementById('laptopDetails').value.trim(),
    serialNumber: document.getElementById('serialNumber').value.trim(),
    employeeId: document.getElementById('employeeId').value.trim(),
    contactNumber: document.getElementById('contactNumber').value.trim(),
    employeeEmail: document.getElementById('employeeEmail').value.trim(),
    supportContact: document.getElementById('supportContact').value.trim(),
    companyLink: document.getElementById('companyLink').value.trim(),
    generatedAt: new Date().toISOString(),
  };

  if (!validateForm(formData)) {
    return;
  }

  const useBackend = document.getElementById('useBackend').checked;

  try {
    let qrUrl;

    if (useBackend) {
      const assetId = await saveToBackend(formData);
      qrUrl = generateQRUrl(formData, assetId);
    } else {
      qrUrl = generateQRUrl(formData);
    }

    currentAssetData = formData;
    currentQRUrl = qrUrl;

    generateQRCode(qrUrl);
    displayAssetDetails(formData);

    formSection.style.display = 'none';
    qrSection.style.display = 'block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    alert('Error generating QR code. Please try again without database storage.');
    console.error(error);
  }
}

function handleBack() {
  qrSection.style.display = 'none';
  formSection.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function downloadPNG() {
  const canvas = document.querySelector('#qrCode canvas');
  if (!canvas) return;

  const link = document.createElement('a');
  link.download = `laptop-asset-${currentAssetData.serialNumber}.png`;
  link.href = canvas.toDataURL();
  link.click();
}

function downloadSVG() {
  const canvas = document.querySelector('#qrCode canvas');
  if (!canvas) return;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
      <image href="${canvas.toDataURL()}" width="${canvas.width}" height="${canvas.height}"/>
    </svg>
  `;

  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const link = document.createElement('a');
  link.download = `laptop-asset-${currentAssetData.serialNumber}.svg`;
  link.href = URL.createObjectURL(blob);
  link.click();
  URL.revokeObjectURL(link.href);
}

function downloadPDF() {
  const canvas = document.querySelector('#qrCode canvas');
  if (!canvas) return;

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.setFontSize(20);
  pdf.setFont(undefined, 'bold');
  pdf.text('Laptop Asset QR Code', pageWidth / 2, 20, { align: 'center' });

  const qrSize = 80;
  const qrX = (pageWidth - qrSize) / 2;
  const qrY = 30;

  const imgData = canvas.toDataURL('image/png');
  pdf.addImage(imgData, 'PNG', qrX, qrY, qrSize, qrSize);

  let textY = qrY + qrSize + 15;
  pdf.setFontSize(11);
  pdf.setFont(undefined, 'bold');

  const details = [
    ['Laptop Model:', currentAssetData.laptopDetails],
    ['Serial Number:', currentAssetData.serialNumber],
    ['Employee ID:', currentAssetData.employeeId],
    ['Support Contact:', currentAssetData.supportContact],
  ];

  details.forEach(([label, value]) => {
    pdf.text(label, 20, textY);
    pdf.setFont(undefined, 'normal');
    pdf.text(value, 60, textY);
    pdf.setFont(undefined, 'bold');
    textY += 8;
  });

  textY += 5;
  pdf.setFontSize(9);
  pdf.setFont(undefined, 'normal');
  pdf.text(`Generated: ${new Date(currentAssetData.generatedAt).toLocaleString()}`, pageWidth / 2, textY, { align: 'center' });

  pdf.save(`laptop-asset-${currentAssetData.serialNumber}.pdf`);
}

form.addEventListener('submit', handleFormSubmit);
backBtn.addEventListener('click', handleBack);
document.getElementById('downloadPng').addEventListener('click', downloadPNG);
document.getElementById('downloadSvg').addEventListener('click', downloadSVG);
document.getElementById('downloadPdf').addEventListener('click', downloadPDF);
