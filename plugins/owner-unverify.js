import db from '../lib/database/index.js'

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!text) throw 'Siapa yang mau diunverify?'
    let who = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? ((args.join('').replace(/[@ .+-]/g, '')).replace(/^\+/, '').replace(/-/g, '') + '@s.whatsapp.net') : '';
    if (!who) return m.reply('Tag salah satu, atau ketik Nomernya!!')
    const user = await db.users.get(who)
    if (!user) return m.reply(`User ${who} tidak ada dalam database`)
    await db.users.update(who, (user) => {
        user.verified = false
    })
    conn.reply(m.chat, `👥 Berhasil unverify *@${(who || '').replace(/@s\.whatsapp\.net/g, '')}*! 👥`, null, { mentions: [who] })
}
handler.help = ['unverify @user']
handler.tags = ['owner']
handler.command = /^(unverify)$/i
handler.rowner = true

export default handler