import db from '../lib/database/index.js';

const cooldown = (isPrems) => (isPrems ? 3600000 : 43200000);

let handler = async (m, { conn, args, text, usedPrefix, command, isPrems, isROwner }) => {
  let user = await db.users.get(m.sender);

  if (new Date() - user.lastsafezone < cooldown(isPrems) && !isROwner && user.safezone == false) {
    throw `🛖 Kamu baru saja *meninggalkan* Safe Zone 🛖!\nTunggu selama *${((user.lastsafezone + cooldown(isPrems)) - new Date()).toTimeString()}* untuk memasuki 🌥️ Safe Zone 🌥️`;
  }

  if (user.safezone === false) {
    await db.users.update(m.sender, (user) => {
      user.safezone = true;
      user.lastsafezone = new Date() * 1;
    });
    m.reply(`🌥️ Anda *sekarang di* Safe Zone 🌥️`);
  } else {
    await db.users.update(m.sender, (user) => {
      user.safezone = false;
    });
    m.reply(`🛖 Anda *meninggalkan* Safe Zone 🛖`);
  }
};
handler.help = ['safezone'];
handler.tags = ['arena'];
handler.command = /^(safezone)$/i;

handler.cooldown = cooldown;

export default handler;