const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode-terminal');
const P = require('pino');
const fs = require('fs');
const path = require('path');

let sock;
const RECIPIENT = process.env.WHATSAPP_RECIPIENT || '94714768679';

async function initWhatsApp() {
  const authFolder = path.join(__dirname, 'auth_info');

  if (!fs.existsSync(authFolder)) {
    fs.mkdirSync(authFolder, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(authFolder);

  sock = makeWASocket({
    auth: state,
    logger: P({ level: 'silent' }),
    printQRInTerminal: false
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('\n📱 Scan this QR code with WhatsApp:\n');
      QRCode.generate(qr, { small: true });
      console.log('\n');
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Connection closed. Reconnecting:', shouldReconnect);

      if (shouldReconnect) {
        initWhatsApp();
      }
    } else if (connection === 'open') {
      console.log('✅ WhatsApp Connected Successfully!');
    }
  });

  return sock;
}

async function sendApplicationToWhatsApp(data) {
  const { firstName, lastName, nickname, whatsappNumber, details, photos } = data;

  // Format the message
  let message = `🌟 *DARK TOUCH - RECRUITMENT APPLICATION* 🌟\n\n`;
  message += `👤 *Personal Information*\n`;
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `• *Name:* ${firstName} ${lastName}\n`;

  if (nickname) {
    message += `• *Nickname:* ${nickname}\n`;
  }

  message += `• *WhatsApp:* ${whatsappNumber}\n\n`;

  if (details) {
    message += `📝 *Additional Details*\n`;
    message += `━━━━━━━━━━━━━━━━━━\n`;
    message += `${details}\n\n`;
  }

  message += `📸 *Photos:* ${photos.length} attached\n`;
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `✅ Application received via Dark Touch Platform`;

  const recipientJid = `${RECIPIENT}@s.whatsapp.net`;

  // Send text message
  await sock.sendMessage(recipientJid, { text: message });

  // Send photos
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const caption = `📸 Photo ${i + 1} - ${firstName} ${lastName}`;

    await sock.sendMessage(recipientJid, {
      image: fs.readFileSync(photo.path),
      caption: caption
    });

    // Small delay between photos
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`✅ Application sent to ${RECIPIENT}`);
  return true;
}

module.exports = {
  initWhatsApp,
  sendApplicationToWhatsApp
};