import db from '../lib/database/index.js'

let handler = async (m, { conn, usedPrefix }) => {
  let chat = await db.chats.get(m.chat)
  if (chat.banned === true) {
    m.reply('Chat ini sudah dalam keadaan terbanned.')
    return
  }

  await db.chats.update(m.chat, chat => {
    chat.banned = true
  })

  m.reply(`
Chat berhasil di-*banned*!
`.trim())
}
handler.help = ['banchat']
handler.tags = ['group', 'owner']
handler.command = /^banchat$/i

handler.admin = true;
handler.group = true;

export default handler