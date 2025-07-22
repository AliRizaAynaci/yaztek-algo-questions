const { execSync } = require('child_process');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

// ---------- Değişen klasörü bul ----------
let changedFiles = [];
try {
    changedFiles = execSync('git diff --name-only HEAD~1').toString().trim().split('\n');
} catch (_) {
    changedFiles = ['(ilk commit)'];
}
const changedFolders = [...new Set(changedFiles.filter(Boolean).map(f => f.split('/')[0]))];
const latestWeek = changedFolders.find(f => f.startsWith('week-')) || 'Yeni klasör';

// ---------- question.md'den başlığı çek ----------
function extractTitle(weekFolder) {
    try {
        const mdPath = path.join(process.cwd(), weekFolder, 'question.md');
        if (!fs.existsSync(mdPath)) return null;
        const md = fs.readFileSync(mdPath, 'utf8');
        // İlk markdown başlığı: satır başında # ile başlayan
        const m = md.match(/^#{1,6}\s+(.*)$/m);
        return m ? m[1].trim() : null;
    } catch (e) {
        return null;
    }
}

const title = extractTitle(latestWeek);

// ---------- WhatsApp client (kalıcı login) ----------
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: path.join(__dirname, '..', '.wwebjs_auth')
    })
});

client.on('qr', qr => qrcode.generate(qr, { small: true }));

client.on('ready', async () => {
    console.log('💬 Bot çalışıyor!');

    const target = '905392325682@c.us';

    const header = title ? `📘 ${title}\n` : '';
    const body   = `📢 Yeni algoritma sorusu eklendi: ${latestWeek}/\n` +
                   `🔗 GitHub: https://github.com/AliRizaAynaci/algo-questions/tree/main/${latestWeek}`;

    const textMessage = header + body;

    try {
        // Görsel varsa önce onu gönderelim
        const imgPath = path.join(process.cwd(), latestWeek, 'image.png');
        if (fs.existsSync(imgPath)) {
            const media = MessageMedia.fromFilePath(imgPath);
            await client.sendMessage(target, media);
        }

        await client.sendMessage(target, textMessage);
        console.log('✅ Mesaj(lar) gönderildi!');
    } catch (err) {
        console.error('❌ Mesaj gönderilemedi:', err);
    } finally {
        process.exit(0);
    }
});

client.initialize();
