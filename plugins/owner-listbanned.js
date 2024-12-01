import db from '../lib/database/index.js';
import { updateCache, getUserCache } from './_cache.js';

let handler = async (m, { isPrems, conn, text, usedPrefix, command }) => {
  if (!text || text.trim().split(" ").length < 1) {
    return m.reply(`
◈===================◈
🚫 Daftar Pengguna Diblokir 🚫
✍🏻 Penggunaan: ${usedPrefix}${command}

❧ Ini adalah perintah untuk melihat daftar pengguna yang diblokir. Pengguna yang diblokir memiliki status "banned".
◈===================◈
`.trim());
  }

  let users = getUserCache();

  let filteredUsers = [];
  let index = 1;

  // Looping semua pengguna dan menambahkan pengguna yang diblokir ke dalam array
  for (let user of users) {
    if (user.banned === true) {
      filteredUsers.push(`${(user.jid || '')}`);
    }
  }

  // Menampilkan daftar pengguna yang diblokir jika ada
  if (filteredUsers.length > 0) {
    let nomorUrut = 1;
    const daftarNomor = filteredUsers.map((user) => {
      const nomor = `${nomorUrut}. @${user.replace(/@s\.whatsapp\.net/g, '')} (Banned)`;
      nomorUrut++;
      return nomor;
    }).join('\n');

    m.reply(`
📑 Daftar pengguna yang diblokir:
🚫 Total pengguna diblokir: ${nomorUrut - 1}

${daftarNomor}
`.trim(), null, { mentions: filteredUsers });

  } else {
    m.reply('Tidak ada pengguna yang diblokir.');
  }
};

handler.help = ['listbanned']
handler.tags = ['life']
handler.command = /^(listbanned)$/i
handler.private = true
handler.premium = true
handler.rowner = true

export default handler;
