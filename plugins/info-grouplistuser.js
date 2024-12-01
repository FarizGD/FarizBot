import db from '../lib/database/index.js'
import Connection from '../lib/connection.js'

let handler = async (m, { conn }) => {
  const apple1 = (m.isGroup ? await Connection.store.fetchGroupMetadata(m.chat, this.groupMetadata) : {}) || {}
  const kue = (m.isGroup ? apple1.participants : []) || [];
  const listMembera = kue.map((v) => `${v.id}`);
  m.reply(listMembera);

  const user = await db.users.get(m.sender); // Mengambil data user dari database
  await db.users.update(m.sender, (user) => { // Melakukan update data user
    user.money += 1000; // Menambahkan 1000 ke jumlah money
  });

}

handler.help = ['cekgrup']
handler.tags = ['group']
handler.command = /^cekgrup$/i

handler.rowner = true

export default handler