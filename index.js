const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { initWhatsApp, sendApplicationToWhatsApp } = require('./whatsapp');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, JPG, PNG) are allowed!'));
    }
  }
});

// Initialize WhatsApp
let whatsappReady = false;
initWhatsApp()
  .then(() => {
    whatsappReady = true;
    console.log('✅ WhatsApp is ready!');
  })
  .catch(err => {
    console.error('❌ WhatsApp initialization failed:', err);
  });

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    whatsappReady: whatsappReady,
    message: 'Dark Touch Server is running'
  });
});

app.post('/api/submit-application', upload.array('photos', 4), async (req, res) => {
  try {
    if (!whatsappReady) {
      return res.status(503).json({
        success: false,
        message: 'WhatsApp service is not ready. Please scan QR code first.'
      });
    }

    const { firstName, lastName, nickname, whatsappNumber, details } = req.body;
    const photos = req.files;

    // Validate required fields
    if (!firstName || !lastName || !whatsappNumber) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, and WhatsApp number are required'
      });
    }

    if (!photos || photos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one photo is required'
      });
    }

    // Send to WhatsApp
    const result = await sendApplicationToWhatsApp({
      firstName,
      lastName,
      nickname,
      whatsappNumber,
      details,
      photos
    });

    // Clean up uploaded files
    photos.forEach(photo => {
      fs.unlink(photo.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    });

    res.json({
      success: true,
      message: 'Application sent successfully to WhatsApp!'
    });

  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send application. Please try again.'
    });
  }
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Dark Touch Server running on port ${PORT}`);
  console.log(`📱 WhatsApp Recipient: ${process.env.WHATSAPP_RECIPIENT || '94714768679'}`);
});