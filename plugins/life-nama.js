import db from '../lib/database/index.js';
import { getUserCache } from './_cache.js';

let handler = async (m, { isPrems, conn, text, usedPrefix, command }) => {
  let user = await db.users.get(m.sender);
  const jids = await db.users.keys()
  let users = getUserCache();

  if (user.verified === true) {
    m.reply(`Kamu sudah terverifikasi ☑️, tidak bisa ganti nama ✏️\nHubungi wa.me/6282213162100 untuk mengganti`);
    return;
  }

  if (!/^[a-zA-Z\s]+$/.test(text)) {
    m.reply('❗ Mohon masukkan nama yang valid (hanya huruf a-z dan spasi).');
    return;
  }

  if (!text || text.length < 3 || text.length > 40) {
    m.reply('❗ Mohon masukkan nama yang Anda inginkan dengan benar (3-40 karakter).');
    return;
  }

  // Cek apakah pengguna sudah menentukan nama sebelumnya
  if (user.nama !== '-' && isPrems === false && user.gamepass < 1) {
    m.reply('❗ Nama pengguna hanya bisa diatur satu kali saja.\n💳 atau gunakan gamepass');
    return;
  }

  let isNameExist = users.filter(user => user.nama.toLowerCase() === text.toLowerCase()).length > 0;

  if (isNameExist) {
    m.reply('❗ Nama pengguna tersebut sudah digunakan oleh pengguna lain, harap pilih nama lain.');
    return;
  }

  // Set nama pengguna
  await db.users.update(m.sender, (userData) => {
    userData.nama = text.trim();
  });

  m.reply(`✅ Nama Anda berhasil diubah menjadi *${text.trim()}*.`);

  if (user.gamepass >= 1 && isPrems === false && user.nama !== '-') {
    await db.users.update(m.sender, (userData) => {
      userData.gamepass -= 1;
    });
    m.reply('-1 💳 gamepass');
  }
};

handler.help = ['setnama <nama>'];
handler.tags = ['life'];
handler.command = /^setnama|setname$/i;

export default handler;