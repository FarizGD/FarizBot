import similarity from 'similarity';
import db from '../lib/database/index.js';

const threshold = 0.72;
let handler = async m => m;
handler.before = async function (m) {
  let id = m.chat;
  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/Ketik.*benderaapa/i.test(m.quoted.text)) return !0;
  this.tebakbendera = this.tebakbendera ? this.tebakbendera : {};
  if (!(id in this.tebakbendera)) return m.reply('Soal itu telah berakhir');

  if (m.quoted.id == this.tebakbendera[id][0].id) {
    let json = JSON.parse(JSON.stringify(this.tebakbendera[id][1]));
    // m.reply(JSON.stringify(json, null, '\t'))
    if (m.text.toLowerCase() == json.name.toLowerCase().trim()) {
      const user = await db.users.get(m.sender);
      await db.users.update(m.sender, (user) => {
        user.exp += this.tebakbendera[id][2];
      });
      m.reply(`*Benar!*\n+${this.tebakbendera[id][2]} XP`);
      clearTimeout(this.tebakbendera[id][3]);
      delete this.tebakbendera[id];
    } else if (similarity(m.text.toLowerCase(), json.name.toLowerCase().trim()) >= threshold) {
      m.reply(`*Dikit Lagi!*`);
    } else {
      m.reply(`*Salah!*`);
    }
  }
  return !0;
};
handler.exp = 0;

export default handler;