const { execSync } = require('child_process');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// --- Değişen klasörü bul ---
let changedFiles = [];
try {
    changedFiles = execSync('git diff --name-only HEAD~1').toString().trim().split('\n');
} catch (_) {
    changedFiles = ['(ilk commit)'];
}
const changedFolders = [...new Set(changedFiles.filter(Boolean).map(f => f.split('/')[0]))];
const latestWeek = changedFolders.find(f => f.startsWith('week-')) || 'Yeni klasör';

// --- WhatsApp client (kalıcı login) ---
const client = new Client({
    authStrategy: new LocalAuth({
        // Root'a sabitle -> hem hook'ta hem manuel çalıştırmada aynı yer
        dataPath: __dirname + '/../.wwebjs_auth'
    })
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('💬 Bot çalışıyor!');

    const target = '905392325682@c.us';
    const message =
        `📢 Yeni algoritma sorusu eklendi: ${latestWeek}/\n` +
        `🔗 GitHub: https://github.com/AliRizaAynaci/algo-questions/tree/main/${latestWeek}`;

    try {
        await client.sendMessage(target, message);
        console.log('✅ Mesaj gönderildi!');
    } catch (err) {
        console.error('❌ Mesaj gönderilemedi:', err);
    } finally {
        // Oturumu kapatma (destroy) yok; sadece process’i bitiriyoruz
        process.exit(0);
    }
});

client.initialize();
