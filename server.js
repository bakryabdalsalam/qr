const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Set the storage engine for multer
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb){
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Serve static files
app.use(express.static(__dirname));

// Handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        res.json({ success: true, fileUrl: fileUrl });
    } else {
        res.json({ success: false });
    }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
