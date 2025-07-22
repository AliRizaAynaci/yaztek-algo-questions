// wabot/login.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const path = require('path');
const fs = require('fs');

const SESSION_ROOT = path.resolve(__dirname, '..', '.wwebjs_auth');

// Session dizinini önceden oluştur
if (!fs.existsSync(SESSION_ROOT)) {
  fs.mkdirSync(SESSION_ROOT, { recursive: true });
  console.log('📁 Session dizini oluşturuldu:', SESSION_ROOT);
}

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: 'algo-bot-v2',  // Farklı ID dene
    dataPath: SESSION_ROOT
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ],
    timeout: 60000
  }
});

client.on('qr', qr => {
  console.log('📱 QR kodu telefonla okutun:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ Login tamam. Session kaydedildi.');
  console.log('📍 Session konumu:', SESSION_ROOT);
  
  // Session dosyalarını kontrol et
  const sessionDir = path.join(SESSION_ROOT, 'session-algo-bot');
  if (fs.existsSync(sessionDir)) {
    console.log('✅ Session dosyaları oluşturuldu:', sessionDir);
  }
  
  setTimeout(() => process.exit(0), 3000);
});

client.on('authenticated', () => {
  console.log('🔐 Kimlik doğrulama başarılı');
});

client.on('auth_failure', msg => {
  console.error('❌ Kimlik doğrulama hatası:', msg);
  process.exit(1);
});

client.on('disconnected', (reason) => {
  console.log('🔌 Bağlantı kesildi:', reason);
});

console.log('🚀 WhatsApp bot başlatılıyor...');
client.initialize();