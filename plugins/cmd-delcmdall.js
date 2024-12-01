import db from '../lib/database/index.js';

let handler = async (m) => {
  const sticker = await db.users.get(m.sender);
  Object.keys(sticker).forEach((key) => {
    delete sticker[key];
  });
  await db.users.update(m.sender, (user) => {
    user.sticker = sticker;
  });
  m.reply('Semua perintah berhasil dihapus!');
};

handler.command = ['delcmdall'];
handler.rowner = true;

export default handler;