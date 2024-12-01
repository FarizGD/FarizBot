import db from '../lib/database/index.js'

let handler = async (m, { conn, usedPrefix }) => {
  let chat = await db.chats.get(m.chat)
  if (chat.banned === false) {
    m.reply('Chat ini tidak dalam keadaan terbanned.')
    return
  }

  await db.chats.update(m.chat, chat => {
    chat.banned = false
  })

  m.reply(`
Chat berhasil di-*unbanned*!
`.trim())
}
handler.help = ['unbanchat']
handler.tags = ['group', 'owner']
handler.command = /^unbanchat$/i

handler.admin = true;
handler.group = true;

export default handler