// wabot/login.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const path = require('path');
const fs = require('fs');

const CLIENT_ID    = 'algo-bot';
const SESSION_ROOT = path.resolve(__dirname, '..', '.wwebjs_auth');

if (!fs.existsSync(SESSION_ROOT)) {
  fs.mkdirSync(SESSION_ROOT, { recursive: true });
  console.log('📁 Session dizini oluşturuldu:', SESSION_ROOT);
}

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: CLIENT_ID,
    dataPath: SESSION_ROOT
  })
  // puppeteer: {...} YOK
});

client.on('qr', qr => {
  console.log('📱 QR kodu telefonla okutun:');
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => console.log('🔐 Kimlik doğrulama başarılı'));

client.on('ready', async () => {
  console.log('✅ Login tamam. Session kaydedildi.');
  console.log('📍', path.join(SESSION_ROOT, `session-${CLIENT_ID}`));

  // --- EK: Dosyaların yazılması için bekle ---
  await new Promise(r => setTimeout(r, 8000));
  await client.destroy(); // chromium’u düzgün kapat
  process.exit(0);
});

client.on('auth_failure', m => { console.error('❌ auth_failure:', m); process.exit(1); });

console.log('🚀 WhatsApp bot başlatılıyor...');
client.initialize();
