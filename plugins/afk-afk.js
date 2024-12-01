import db from '../lib/database/index.js';

let handler = async (m, { text, conn }) => {
  const user = await db.users.get(m.sender);
  if (text.includes('http://') || text.includes('https://')) {
    m.reply('Alasan afk tidak boleh mengandung link!');
    return;
  }
  await db.users.update(m.sender, (user) => {
    user.afk = +new Date();
    user.afkReason = text;
  });
  m.reply(`
💤 ${conn.getName(m.sender)} sekarang sedang 🛌🏻 AFK${text ? ': ' + text : ''}
  `.trim());
};

handler.help = ['afk [alasan]'];
handler.tags = ['main'];
handler.command = /^afk$/i;

export default handler;