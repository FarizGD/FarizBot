import db from '../lib/database/index.js'

let handler = async (m, { conn, text, usedPrefix, command, args }) => {
    let who = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? ((args.join('').replace(/[@ .+-]/g, '')).replace(/^\+/, '').replace(/-/g, '') + '@s.whatsapp.net') : '';
    if (!who) {
        who = m.sender
    }
    let user = await db.users.get(who)
    if (!user) return m.reply(`User ${who} tidak ada dalam database`)

    await db.users.update(who, (userData) => {
        userData.money += 1000
    })

    m.reply(`*Chat @${(who || '').replace(/@s\.whatsapp\.net/g, '')}* ✧\n➢ ${user.chat} 💬`, null, { mentions: [who] })

}

handler.help = ['chat <tag>']
handler.tags = ['limit']

handler.command = /^(chat)$/i

export default handler