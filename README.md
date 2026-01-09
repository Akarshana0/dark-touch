# Dark Touch - Automatic WhatsApp Recruitment System 🚀

Complete recruitment website with **automatic WhatsApp integration** using Baileys. No manual sending required!

## 🎯 How It Works

1. User fills the form on website
2. Uploads photos (up to 4)
3. Clicks Submit
4. **Everything automatically sends to your WhatsApp (94714768679)**
   - ✅ Formatted message with all details
   - ✅ All 4 photos
   - ✅ No user interaction needed!

## 📦 Installation

```bash
# Extract ZIP
unzip dark-touch-auto-whatsapp.zip
cd dark-touch-auto-whatsapp

# Install all dependencies (client + server)
npm run install-all
```

## 🚀 Running the Application

### First Time Setup

1. **Start the server** (this will show QR code):
```bash
cd server
npm run dev
```

2. **Scan QR code** with your WhatsApp (94714768679)
   - Open WhatsApp on your phone
   - Go to Settings > Linked Devices
   - Scan the QR code shown in terminal

3. **Start the client** (in new terminal):
```bash
cd client
npm start
```

Or run both together:
```bash
npm run dev
```

### After QR Code Scanned

Server will stay connected. Just run:
```bash
npm run dev
```

## 📁 Project Structure

```
dark-touch-auto-whatsapp/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormPage.jsx
│   │   │   └── PhotoUploadPage.jsx
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                 # Express + Baileys Backend
│   ├── index.js           # Main server
│   ├── whatsapp.js        # Baileys integration
│   ├── .env.example       # Environment variables
│   └── package.json
└── README.md
```

## ⚙️ Configuration

### Change WhatsApp Number

Edit `server/.env`:
```env
WHATSAPP_RECIPIENT=94714768679
PORT=5000
```

Or change directly in `server/whatsapp.js`:
```javascript
const RECIPIENT = '94714768679';
```

## 🔧 Features

### Client (Frontend)
- Modern Dark Touch design
- Two-page form (Personal Info + Photos)
- Real-time validation
- Photo preview with upload progress
- Axios API integration
- Success/Error handling

### Server (Backend)
- Express.js API
- Baileys WhatsApp integration
- Multer file upload
- Automatic message formatting
- Photo sending with captions
- QR code authentication

## 📱 WhatsApp Message Format

```
🌟 DARK TOUCH - RECRUITMENT APPLICATION 🌟

👤 Personal Information
━━━━━━━━━━━━━━━━━━
• Name: John Doe
• Nickname: JD
• WhatsApp: +94 71 476 8679

📝 Additional Details
━━━━━━━━━━━━━━━━━━
[User's message]

📸 Photos: 4 attached
━━━━━━━━━━━━━━━━━━
✅ Application received via Dark Touch Platform
```

Then 4 photos sent with captions.

## 🎨 Customization

### Change Brand Colors
Edit `client/tailwind.config.js` or component files:
- Purple: `purple-400` to `purple-700`
- Pink: `pink-500` to `pink-700`
- Red: `red-500` to `red-700`

### Change Form Fields
Edit `client/src/components/FormPage.jsx` and `PhotoUploadPage.jsx`

### Change WhatsApp Message Format
Edit `server/whatsapp.js` - `sendApplicationToWhatsApp()` function

## 🚨 Troubleshooting

### QR Code Not Showing
```bash
cd server
rm -rf auth_info
npm run dev
```

### WhatsApp Disconnects
- Restart server
- Scan QR code again
- Check internet connection

### Photos Not Sending
- Check file size (max 5MB)
- Check file format (JPG, PNG only)
- Check server logs

### Connection Errors
```bash
# Check if server is running
curl http://localhost:5000/api/health

# Check logs
cd server
npm run dev
```

## 📝 API Endpoints

### GET /api/health
Check server status and WhatsApp connection

### POST /api/submit-application
Submit application with photos
- Body: FormData with firstName, lastName, nickname, whatsappNumber, details
- Files: photos (array, max 4)

## 🔒 Security Notes

- Never commit `auth_info/` folder (contains WhatsApp session)
- Never commit `.env` file
- Add to `.gitignore`:
```
auth_info/
uploads/
.env
node_modules/
```

## 🌐 Deploy to Heroku

Coming soon! (Baileys needs persistent storage)

## 💡 Tips

- Keep server running for WhatsApp connection
- Session persists in `auth_info/` folder
- Uploaded photos are auto-deleted after sending
- Rate limit: ~10 messages/minute (WhatsApp limit)

## 🛠️ Tech Stack

- **Frontend:** React 18, Tailwind CSS, Axios
- **Backend:** Express.js, Baileys, Multer
- **WhatsApp:** @whiskeysockets/baileys
- **File Upload:** Multer
- **QR Code:** qrcode-terminal

---

© 2026 Dark Touch | Fully Automatic WhatsApp Recruitment System 🤖
