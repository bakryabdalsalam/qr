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
        // Open the URL in a new tab
        window.open(decodedText, '_blank');
    } else {
        alert('Scanned QR code content: ' + decodedText);
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
const generateTextBtn = document.getElementById('generate-text-btn');
const generateFileBtn = document.getElementById('generate-file-btn');
const downloadBtn = document.getElementById('download-btn');
const qrTextInput = document.getElementById('qr-text');
const qrFileInput = document.getElementById('qr-file');
const qrCodeContainer = document.getElementById('qr-code');
let qrCode;

// Generate QR Code from Text or URL
generateTextBtn.addEventListener('click', () => {
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

// Generate QR Code from File Upload
generateFileBtn.addEventListener('click', () => {
    const file = qrFileInput.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        // Upload file to server
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const fileUrl = data.fileUrl;

                // Clear previous QR Code
                qrCodeContainer.innerHTML = "";
                downloadBtn.style.display = "none";

                // Generate QR Code linking to the uploaded file
                qrCode = new QRCode(qrCodeContainer, {
                    text: fileUrl,
                    width: 250,
                    height: 250,
                    colorDark: "#ffffff",
                    colorLight: "#1f1f1f",
                    correctLevel: QRCode.CorrectLevel.H
                });
                downloadBtn.style.display = "block";
                document.getElementById('file-upload-status').innerText = "File uploaded successfully!";
            } else {
                alert('File upload failed.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during file upload.');
        });
    } else {
        alert('Please select a file to upload.');
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

// Tab functionality
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
