import { canLevelUp, xpRange } from '../lib/levelling.js'
import { levelup } from '../lib/canvas.js'
import db from '../lib/database/index.js'

let handler = async (m, { conn }) => {
    let user = await db.users.get(m.sender)
    
    if (user.nama == '-'  || user.gender == 'non-binary 🎭' || user.umur == '-') {
      conn.sendFile(m.chat, './picture/tutorial/tutorial.jpeg', './picture/tutorial/tutorial.jpeg', `⚠️ Anda belum set profile (cek dengan /profile)\nAnda bisa set profile dengan /set`, m)
      return
    }
    
    if (!canLevelUp(user.level, user.exp, global.multiplier)) {
        let { min, xp, max } = xpRange(user.level, global.multiplier)
        throw `
Level *${user.level} (${user.exp - min}/${xp})*
Kurang *${max - user.exp}* lagi!
`.trim()
    }
    let before = user.level * 1
    while (canLevelUp(user.level, user.exp, global.multiplier)) {
        await db.users.update(m.sender, (user) => {
            user.level++
        })
        user = await db.users.get(m.sender)
    }
    if (before !== user.level) {
        await db.users.update(m.sender, (user) => {
            user.role = global.rpg.role(user.level).name
        })
        user = await db.users.get(m.sender)
        let teks = `Selamat ${conn.getName(m.sender)} naik 🧬level`
        let str = `
${teks} 
• 🧬Level Sebelumnya : ${before}
• 🧬Level Baru : ${user.level}
• 🧬Role Kamu : ${user.role}
• Pada Jam : ${new Date().toLocaleString('id-ID')}
*_Semakin sering berinteraksi dengan bot Semakin Tinggi level kamu_*
`.trim()
        try {
            const img = await levelup(teks, user.level)
            conn.sendFile(m.chat, img, 'levelup.jpg', str, m)
        } catch (e) {
            m.reply(str)
        }
    }
}

handler.help = ['levelup']
handler.tags = ['xp']

handler.command = /^level(|up)$/i

export default handler