import db from '../lib/database/index.js';

async function handler(m, { conn, text }) {
  if (!text) return m.reply(`
❔ Mana pesannya? 
❓ Contoh: /reply hi
  `.trim());

  const user = await db.users.get(m.sender);
  const _user = await db.users.get(user.reply);

  const message = `
💬 Ada pesan balasan:

${text}

_📱 ketik /balas untuk membalas_
  `;

  try {
    await conn.reply(user.reply, message.trim(), null, { mentions: [m.sender] });
    conn.reply(m.chat, `🤫 Balasan kamu telah terkirim ke user tersebut!`, m);

    await db.users.update(user.reply, (u) => {
      u.reply = m.sender;
    });
  } catch (error) {
    m.reply('Gagal mengirim permintaan, mohon coba lagi nanti. 😔', null);
  }
}

handler.help = ['reply <pesan>'];
handler.tags = ['utilitas'];
handler.command = /^(reply|balas)$/i;
handler.disabled = false;

export default handler;