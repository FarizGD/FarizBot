import db from '../lib/database/index.js';
import { getUserCache } from './_cache.js';

let handler = async (m, { isPrems, conn, text, usedPrefix, command }) => {
  if (!text || text.trim().split(" ").length < 2) {
    return m.reply(`
◈===================◈
👥 List Orang 👥
✍🏻 Penggunaan: ${usedPrefix}${command} <male/female> <agama>

❧ Ini adalah perintah untuk melihat daftar orang berdasarkan jenis kelamin dan agama. Silakan gunakan argumen "male" atau "female" untuk jenis kelamin dan salah satu dari "Islam", "Kristen", "Katolik", "Yahudi", "Hindu", atau "Buddha" untuk agama.
◈===================◈
`.trim())
  }

  let users = getUserCache();

  let filteredUsers = []
  let [gender, agama] = text.trim().split(" ")
  let index = 1

  // Looping semua pengguna dan menambahkan pengguna yang sesuai ke dalam array
  for (let user of users) {
    if (user.gender === `${gender} ${gender === "male" ? "♂️" : "♀️"}` && user.agama === agama) {
      filteredUsers.push(`${(user.jid || '')}`)
    }
  }

  let gender_emoji = "♂️"
  if (gender == "female") {
    gender_emoji = "♀️"
  }

  // Menampilkan daftar pengguna jika ada yang sesuai dengan kriteria
  if (filteredUsers.length > 0) {
    let nomorUrut = 1;
    const daftarNomor = filteredUsers.map((user) => {
      const nomor = `${nomorUrut}. @${user.replace(/@s\.whatsapp\.net/g, '')} ${gender} ${gender_emoji} | ${agama}`;
      nomorUrut++;
      return nomor;
    }).join('\n');

    m.reply(`
📑 Daftar pengguna dengan gender ${gender} ${gender_emoji} dan agama ${agama}:
🫂 Total orang: ${nomorUrut - 1}

${daftarNomor}
`.trim(), null, { mentions: filteredUsers });

  } else {
    m.reply('Tidak ada pengguna yang sesuai dengan kriteria yang diminta.')
  }
}

handler.help = ['listorang <male/female> <Islam/Kristen/Katolik/Yahudi/Hindu/Buddha>']
handler.tags = ['life']
handler.command = /^(listorang)$/i
handler.private = true
handler.premium = true

export default handler