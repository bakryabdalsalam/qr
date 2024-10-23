// QR Code Scanner Section
let scannerIsRunning = false;

function onScanSuccess(decodedText, decodedResult) {
    if (!scannerIsRunning) {
        return;
    }
    scannerIsRunning = false; // Stop further scanning

    // Display the scanned QR code content
    document.getElementById('qr-result').innerText = `QR Code Content: ${decodedText}`;

    // Check if the scanned text is a URL
    if (isValidURL(decodedText)) {
        // Ask user if they want to open the link
        if (confirm('Open this link?\n' + decodedText)) {
            window.open(decodedText, '_blank');
        }
    }

    // Stop the scanner
    html5QrcodeScanner.clear();
}

function onScanFailure(error) {
    // Ignore scan errors for continuous scanning
}

function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Initialize the QR code scanner
let html5QrcodeScanner = new Html5QrcodeScanner(
    "qr-reader",
    {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true
    },
    false
);

// Start the scanner and set the flag
html5QrcodeScanner.render(onScanSuccess, onScanFailure);
scannerIsRunning = true;

// QR Code Generator Section
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const qrTextInput = document.getElementById('qr-text');
const qrCodeContainer = document.getElementById('qr-code');
let qrCode;

generateBtn.addEventListener('click', () => {
    const text = qrTextInput.value.trim();
    if (text) {
        // Clear previous QR Code
        qrCodeContainer.innerHTML = "";
        downloadBtn.style.display = "none";
        // Generate new QR Code
        qrCode = new QRCode(qrCodeContainer, {
            text: text,
            width: 250,
            height: 250,
            colorDark: "#ffffff",
            colorLight: "#1f1f1f",
            correctLevel: QRCode.CorrectLevel.H
        });
        downloadBtn.style.display = "block";
    } else {
        alert('Please enter text or URL to generate QR code.');
    }
});

// Download the generated QR Code
downloadBtn.addEventListener('click', () => {
    if (qrCode) {
        const qrCanvas = qrCodeContainer.querySelector('canvas');
        if (qrCanvas) {
            const imageData = qrCanvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imageData;
            link.download = 'qr-code.png';
            link.click();
        }
    }
});
