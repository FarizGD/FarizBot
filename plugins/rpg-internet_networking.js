import db from '../lib/database/index.js';
import { areJidsSameUser } from '@whiskeysockets/baileys';

let cooldown = isPrems => isPrems ? 15000 : 30000;
let handler = async (m, { isPrems, conn: _conn, conn }) => {
  let user = await db.users.get(m.sender);

  let pengali = 1;
  if (m.chat == '120363143522564771@g.us') {
    pengali = 2;
  }

  let rewards = {
    gems: ((Math.floor(Math.random() * 9) + 2) * user.phone) * pengali, // Menambahkan Gems secara acak antara 2 hingga 10
  };

  let reward_tambahkurang = "+";

  if (user.nama == '-' || user.gender == 'non-binary 🎭' || user.umur == '-') {
    conn.sendFile(m.chat, './picture/tutorial/tutorial.jpeg', './picture/tutorial/tutorial.jpeg', `⚠️ Anda belum set profile (cek dengan /profile)\nAnda bisa set profile dengan /set`, m);
    return;
  }

  if (user.smartphone > 0) {
    rewards = {
      gems: ((Math.floor(Math.random() * 9) + 2) * user.phone) * pengali, // Menambahkan Gems secara acak antara 2 hingga 10
      social: ((Math.floor(Math.random() * 8) - 2) * user.smartphone) * pengali,
    };
  }

  let extra = 1;
  if (user.safezone == true) {
    extra = 10;
  }

  if (new Date() - user.lastnetworking < cooldown(isPrems) * extra) throw `Kamu sudah melakukan 🛜 networking!, tunggu selama *${((user.lastnetworking + cooldown(isPrems) * extra) - new Date()).toTimeString()}*`;

  // Menambahkan kemungkinan kehilangan user.phone sebesar 3%
  if (Math.random() < 0.03 && user.phone > 0) {
    await db.users.update(m.sender, (user) => {
      user.phone = Math.floor(user.phone / 2);
    });
    m.reply('Oh tidak! ☎️ Telepon anda rusak 💨');
  }

  if (Math.random() < 0.05 && user.smartphone > 0) {
    await db.users.update(m.sender, (user) => {
      user.smartphone = Math.floor(user.smartphone / 2);
    });
    m.reply('TIDAKKK! 📱 Smartphone anda rusak 💨');
  }

  let text = '';
  for (let reward of Object.keys(rewards)) {
    if (!(reward in user)) continue;
    await db.users.update(m.sender, (user) => {
      user[reward] += rewards[reward];
    });
    if (rewards[reward] < 0) {
      reward_tambahkurang = '';
    }
    text += `*${reward_tambahkurang}${rewards[reward]}* ${global.rpg.emoticon(reward)}${reward}\n`;
  }
  if (user.silent == false) {
    m.reply(text.trim());
  }
  await db.users.update(m.sender, (user) => {
    user.lastnetworking = new Date() * 1;
  });
};

handler.help = ['networking'];
handler.tags = ['network'];
handler.command = /^(networking|n)$/i;

handler.cooldown = cooldown;

export default handler;