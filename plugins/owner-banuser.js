import db from '../lib/database/index.js'

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!text) throw 'Siapa yang mau di banned?'
    let who = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? ((args.join('').replace(/[@ .+-]/g, '')).replace(/^\+/, '').replace(/-/g, '') + '@s.whatsapp.net') : '';
    if (!who) return m.reply('Tag salah satu, atau ketik Nomernya!!')
    const user = await db.users.get(who)
    if (!user) return m.reply(`User ${who} tidak ada dalam database`)
    
    await db.users.update(who, (user) => {
        user.banned = true
    })
    conn.reply(who, '*❌ Anda telah di ban oleh Owner ⚠️*')
    conn.reply(m.chat, `🛞 Berhasil ban *@${(who || '').replace(/@s\.whatsapp\.net/g, '')}*! 🛞`, null, { mentions: [who] })
}

handler.help = ['ban @user']
handler.tags = ['owner']
handler.command = /^ban$/i
handler.rowner = true

export default handler