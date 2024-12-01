import db from '../lib/database/index.js'

let handler = async (m, { conn, text, usedPrefix, command, args }) => {
    let who = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? ((args.join('').replace(/[@ .+-]/g, '')).replace(/^\+/, '').replace(/-/g, '') + '@s.whatsapp.net') : '';
    if (!who) {
        who = m.sender
    }
    
    const user = await db.users.get(who); // Mendapatkan data pengguna dari database
    if (!user) return m.reply(`Pengguna ${who} tidak ada dalam database`);
    
    m.reply(`*Chatfariz @${(who || '').replace(/@s\.whatsapp\.net/g, '')}* ✧\n➢ ${user.chatfariz} 💬`, null, { mentions: [who] });
    
}

handler.help = ['chatfariz <tag>']
handler.tags = ['limit']

handler.command = /^(chatfariz)$/i

export default handler