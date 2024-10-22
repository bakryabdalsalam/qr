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
        // Open the URL in a new tab
        window.open(decodedText, '_blank');
    } else {
        alert('Scanned QR code is not a valid URL.');
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
