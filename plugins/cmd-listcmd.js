import db from '../lib/database/index.js';

let handler = async (m, { conn }) => {
  const user = await db.users.get(m.sender);
  conn.reply(
    m.chat,
    `
*DAFTAR HASH*
\`\`\`
${Object.entries(db.users.get('sticker')).map(([key, value], index) =>
  `${index + 1}. ${value.locked ? `(Terkunci) ${key}` : key} : ${value.text}`
).join('\n')}
\`\`\`
`.trim(),
    null,
    {
      mentions: Object.values(db.users.get('sticker')).map(x => x.mentionedJid).reduce((a, b) => [...a, ...b], []),
    }
  );
};

handler.help = ['listcmd'];
handler.tags = ['database'];
handler.command = ['listcmd'];

export default handler;