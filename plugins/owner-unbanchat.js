import db from '../lib/database/index.js'

let handler = async (m, { participants }) => {
    // if (participants.map(v=>v.jid).includes(global.conn.user.jid)) {
    let chat = await db.chats.get(m.chat)
    
    await db.chats.update(m.chat, chat => {
        chat.banned = false
      })
    
    m.reply('Done!')
    // } else m.reply('Ada nomor host disini...')
}
handler.help = ['ounbanchat']
handler.tags = ['owner']
handler.command = /^ounbanchat$/i
handler.rowner = true

export default handler