// wabot/test-session.js
// Session dosyalarını test et
const fs = require('fs');
const path = require('path');

const SESSION_ROOT = path.resolve(__dirname, '..', '.wwebjs_auth');
const SESSION_DIR = path.join(SESSION_ROOT, 'session-algo-bot-v2');

console.log('🔍 Session Test Raporu');
console.log('=' .repeat(50));

console.log('📍 SESSION_ROOT:', SESSION_ROOT);
console.log('📍 SESSION_DIR:', SESSION_DIR);

if (!fs.existsSync(SESSION_ROOT)) {
  console.log('❌ Ana session dizini yok');
  process.exit(1);
}

if (!fs.existsSync(SESSION_DIR)) {
  console.log('❌ Session alt dizini yok');
  process.exit(1);
}

// Session içeriğini listele
const files = fs.readdirSync(SESSION_DIR, { withFileTypes: true });

console.log('\n📁 Session Dosyaları:');
files.forEach(file => {
  const fullPath = path.join(SESSION_DIR, file.name);
  if (file.isDirectory()) {
    console.log(`  📁 ${file.name}/`);
    try {
      const subFiles = fs.readdirSync(fullPath);
      subFiles.forEach(subFile => {
        const subPath = path.join(fullPath, subFile);
        const stats = fs.statSync(subPath);
        console.log(`    📄 ${subFile} (${stats.size} bytes)`);
      });
    } catch (e) {
      console.log(`    ⚠️ Okunamadı: ${e.message}`);
    }
  } else {
    const stats = fs.statSync(fullPath);
    console.log(`  📄 ${file.name} (${stats.size} bytes)`);
  }
});

// Critical dosyaları kontrol et
const criticalFiles = [
  'Default/Local Storage',
  'Default/Session Storage', 
  'Default/IndexedDB',
  'session.json'
];

console.log('\n🔍 Kritik Dosya Kontrolü:');
criticalFiles.forEach(criticalFile => {
  const criticalPath = path.join(SESSION_DIR, criticalFile);
  if (fs.existsSync(criticalPath)) {
    console.log(`  ✅ ${criticalFile} - Mevcut`);
  } else {
    console.log(`  ❌ ${criticalFile} - Eksik`);
  }
});

console.log('\n📊 Toplam boyut:', 
  files.reduce((total, file) => {
    try {
      const stats = fs.statSync(path.join(SESSION_DIR, file.name));
      return total + (stats.isDirectory() ? 0 : stats.size);
    } catch {
      return total;
    }
  }, 0), 'bytes'
);

console.log('\n💡 Öneriler:');
if (files.length === 0) {
  console.log('  - Session klasörü boş, yeniden login gerekli');
} else if (files.length < 3) {
  console.log('  - Session eksik görünüyor, yeniden login öneriliyor');
} else {
  console.log('  - Session dosyaları mevcut, başka bir sorun olabilir');
}