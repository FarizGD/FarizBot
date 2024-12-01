import db from '../lib/database/index.js';
import Connection from '../lib/connection.js';

const { areJidsSameUser } = await import('@whiskeysockets/baileys');

const cooldown = 1000;
let handler = async (m, { isPrems, conn: _conn, conn }) => {
  let user = await db.users.get(m.sender);

  if (user.safezone == true) return m.reply(`⚠️ Kamu tidak bisa mencuri bila sedang berada di 🌥️ Safe Zone 🌥️`);

  if (user.nama == '-' || user.gender == 'non-binary 🎭' || user.umur == '-') {
    conn.sendFile(m.chat, './picture/tutorial/tutorial.jpeg', './picture/tutorial/tutorial.jpeg', `⚠️ Anda belum set profile (cek dengan /profile)\nAnda bisa set profile dengan /set`, m);
    return;
  }

  let silent = 1 
  if (user.silent != true) {
    silent = 4
  }
  let safezone = 1
  if (user.safezone == true) {
    safezone = 10
  }
  let extra = safezone * silent  
    
  const rewards = {
    token: 1 + user.getaran,
  };
  if (new Date() - user.lasttoken < cooldown * extra) {
    const timeLeft = (user.lasttoken + cooldown * extra) - new Date();
    const waitTime = timeLeft < 1000 ? `*${timeLeft} milisecond(ms)*` : `*${(timeLeft / 1000).toFixed(1)} second(s)*`;
    throw `Kamu baru saja mengambil token! Tunggu selama ${waitTime}`;
  }
  let text = '';
  for (let reward of Object.keys(rewards)) {
    if (!(reward in user)) continue;
    await db.users.update(m.sender, (user) => {
      user[reward] += rewards[reward];
    });
    text += `*+${rewards[reward]}* ${global.rpg.emoticon(reward)}${reward}\n`;
  }
  if (user.silent == false) {
    m.reply(text.trim());
  }
  await db.users.update(m.sender, (user) => {
    user.lasttoken = new Date() * 1;
  });
};
handler.help = ['token'];
handler.tags = ['ability'];
handler.command = /^(token)$/i;

handler.cooldown = cooldown;

export default handler;