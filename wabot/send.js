// wabot/send.js
"use strict";

const { execSync } = require("child_process");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");

// ---------- helpers ----------
const sh = (cmd) => execSync(cmd).toString().trim();

function getRepoHttpUrl() {
  let url = sh("git config --get remote.origin.url");
  if (url.startsWith("git@")) {
    const [, hostPath] = url.split(":");
    url = "https://github.com/" + hostPath;
  }
  return url.replace(/^ssh:\/\//, "https://")
            .replace(/^git:\/\//, "https://")
            .replace(/\.git$/, "");
}

function safeDiffFiles() {
  try { return sh("git diff --name-only HEAD~1").split("\n").filter(Boolean); }
  catch { return []; }
}

function latestWeekFolder() {
  const folders = [...new Set(safeDiffFiles().map(f => f.split("/")[0]))];
  return folders.find(f => f.startsWith("week-")) || "Yeni klasör";
}

function readTitle(folder) {
  try {
    const p = path.join(process.cwd(), folder, "question.md");
    if (!fs.existsSync(p)) return null;
    const md = fs.readFileSync(p, "utf8");
    const m = md.match(/^#{1,6}\s+(.*)$/m);
    return m ? m[1].trim() : null;
  } catch { return null; }
}
// --------------------------------

const SESSION_ROOT = path.resolve(__dirname, "..", ".wwebjs_auth");
const SESSION_DIR  = path.join(SESSION_ROOT, "session-algo-bot-v2");

console.log('🔍 Session kontrolü...');
console.log('📍 SESSION_ROOT:', SESSION_ROOT);
console.log('📍 SESSION_DIR:', SESSION_DIR);

// Daha detaylı session kontrolü
if (!fs.existsSync(SESSION_ROOT)) {
  console.error("⚠️  Ana session dizini yok:", SESSION_ROOT);
  console.error("🔧 Çözüm: `node wabot/login.js` ile QR okutun.");
  process.exit(1);
}

if (!fs.existsSync(SESSION_DIR)) {
  console.error("⚠️  Session klasörü yok:", SESSION_DIR);
  console.error("🔧 Çözüm: `node wabot/login.js` ile QR okutun.");
  process.exit(1);
}

// Session içeriğini kontrol et
const sessionFiles = fs.readdirSync(SESSION_DIR);
if (sessionFiles.length === 0) {
  console.error("⚠️  Session klasörü boş!");
  console.error("🔧 Çözüm: `node wabot/login.js` ile QR okutun.");
  process.exit(1);
}

console.log('✅ Session dosyaları mevcut:', sessionFiles.length, 'dosya');

// Dynamic vars
const week   = latestWeekFolder();
const title  = readTitle(week);
const repo   = getRepoHttpUrl();
const branch = sh("git rev-parse --abbrev-ref HEAD");
const ghLink = `${repo}/tree/${branch}/${week}`;

console.log('📊 Mesaj bilgileri:');
console.log('  - Week:', week);
console.log('  - Title:', title);
console.log('  - GitHub Link:', ghLink);

// WhatsApp client - Aynı ayarları kullan
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "algo-bot",
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

let isReady = false;

client.on("loading_screen", (percent, message) => {
  console.log('⏳ Yükleniyor:', percent, '%', message);
});

client.on("authenticated", () => {
  console.log('🔐 Kimlik doğrulama başarılı');
});

client.on("ready", async () => {
  console.log("💬 Bot hazır, mesaj gönderiliyor...");
  isReady = true;

  const target = "905392325682@c.us";

  const text =
    (title ? `📘 ${title}\n` : "") +
    `📢 Yeni algoritma sorusu eklendi: ${week}/\n` +
    `🔗 GitHub: ${ghLink}`;

  try {
    // Önce resim varsa gönder
    const imgPath = path.join(process.cwd(), week, "image.png");
    if (fs.existsSync(imgPath)) {
      console.log('📷 Resim gönderiliyor...');
      const media = MessageMedia.fromFilePath(imgPath);
      await client.sendMessage(target, media);
      console.log('✅ Resim gönderildi!');
      
      // Resimden sonra biraz bekle
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Sonra metni gönder
    console.log('📝 Metin gönderiliyor...');
    await client.sendMessage(target, text);
    console.log("✅ Mesaj başarıyla gönderildi!");
    
  } catch (err) {
    console.error("❌ Gönderim hatası:", err);
  } finally {
    setTimeout(() => {
      console.log('👋 Bot kapatılıyor...');
      process.exit(0);
    }, 2000);
  }
});

client.on("qr", (qr) => {
  console.error("⚠️  QR kodu talep edildi! Session düzgün yüklenmemiş.");
  console.error("🔧 Çözüm: Session dosyalarını silin ve yeniden login yapın:");
  console.error(`   rm -rf "${SESSION_ROOT}"`);
  console.error("   node wabot/login.js");
  qrcode.generate(qr, { small: true });
});

client.on("auth_failure", msg => {
  console.error("❌ Kimlik doğrulama hatası:", msg);
  console.error("🔧 Session bozulmuş olabilir. Yeniden login yapın:");
  console.error(`   rm -rf "${SESSION_ROOT}"`);
  console.error("   node wabot/login.js");
  process.exit(1);
});

client.on("disconnected", (reason) => {
  console.log('🔌 Bağlantı kesildi:', reason);
  if (!isReady) {
    console.error("❌ Bağlantı kurulamadı. Session kontrol edin.");
    process.exit(1);
  }
});

console.log('🚀 WhatsApp mesaj botu başlatılıyor...');
client.initialize();