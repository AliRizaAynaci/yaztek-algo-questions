const { execSync } = require('child_process');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Git diff
let changedFiles = [];
try {
    changedFiles = execSync("git diff --name-only HEAD~1").toString().split('\n');
} catch (err) {
    changedFiles = ['(ilk commit)'];
}

const changedFolders = [...new Set(changedFiles.map(f => f.split('/')[0]))];
const latestWeek = changedFolders.find(f => f.startsWith('week-')) || 'Yeni klasör';

// WhatsApp client (persistent login)
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('💬 Bot çalışıyor!');

    const target = '905392325682@c.us';
    const message = `📢 Yeni algoritma sorusu eklendi: ${latestWeek}/\nGitHub'dan incele → https://github.com/AliRizaAynaci/algo-questions/tree/main/${latestWeek}`;

    client.sendMessage(target, message).then(() => {
        console.log('✅ Mesaj gönderildi!');
        process.exit(0);
    }).catch(err => {
        console.error('❌ Mesaj gönderilemedi:', err);
        process.exit(1);
    });
});

client.initialize();
