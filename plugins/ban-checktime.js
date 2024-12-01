import db from '../lib/database/index.js'

let handler = async (m, { args, isPrems, conn: _conn, conn }) => {
    let who = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? ((args.join('').replace(/[@ .+-]/g, '')).replace(/^\+/, '').replace(/-/g, '') + '@s.whatsapp.net') : '';
    if (!who) {
    	who = m.sender
    }
    
    let user = await db.users.get(who)
    if (!user) return m.reply(`User ${who} tidak ada dalam database`)
    
    if (user.banned && (!user.bannedExpired || user.bannedExpired > Date.now())) {
        if (user.bannedExpired) {
            let remainingTime = user.bannedExpired - Date.now()
            let minutes = Math.floor((remainingTime / (1000 * 60)) % 60)
            let seconds = Math.floor((remainingTime / 1000) % 60)
            if (who == m.sender) {
                m.reply(`⚠ Kamu masih dalam status ban sementara ⚠\nSisa waktu ban: ${minutes} menit ${seconds} detik 🕰`)
                return
            }
            m.reply(`⚠ *@${(who || '').replace(/@s\.whatsapp\.net/g, '')}* masih dalam status ban sementara ⚠\nSisa waktu ban: ${minutes} menit ${seconds} detik 🕰`, null, { mentions: [who] })
        }
    } else if (user.banned == true){
        if (who == m.sender) {
            m.reply('Kamu terkena ban permanen ❌')
            return
        }
        m.reply(`*@${(who || '').replace(/@s\.whatsapp\.net/g, '')}* terkena ban permanen ❌`, null, { mentions: [who] })
    } else {
        if (who == m.sender) {
            m.reply('Kamu tidak sedang dalam ban ✅')
            return
        }
        m.reply(`*@${(who || '').replace(/@s\.whatsapp\.net/g, '')}* tidak sedang dalam ban ✅`, null, { mentions: [who] })
    }
}

handler.help = ['checktime', 'ct', 'banstatus', 'bannedstatus', 'bs']
handler.tags = ['ban']
handler.command = /^(checktime|ct|banstatus|bannedstatus|bs)$/i

export default handler