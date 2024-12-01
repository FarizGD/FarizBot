import db from '../lib/database/index.js'

let handler = async (m, { participants, text }) => {
  if (!text) {
    let info = `
📝 *Cara Menggunakan /setwelcome*

/setwelcome 👤 @user 📌 @subject 📝 @desc [text]

👤 @user    : Menandai pengguna dalam pesan selamat datang.
📌 @subject : Menulis judul grup.
📝 @desc    : Menunjukkan deskripsi grup.

Contoh penggunaan:
/setwelcome Halo @user, Selamat datang di @subject!
Deskripsi grup: @desc
`.trim()
    m.reply(info)
    return
  }

  let chat = await db.chats.get(m.chat)
  
  await db.chats.update(m.chat, chat => {
    chat.sWelcome = text
  })
  
  m.reply('Berhasil mengatur pesan selamat datang!')
}

handler.help = ['/setwelcome']
handler.tags = ['group']
handler.command = /^setwelcome$/i
handler.admin = true
handler.group = true

export default handler