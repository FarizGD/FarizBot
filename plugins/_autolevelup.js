import  db from '../lib/database/index.js'
import { findLevel } from '../lib/levelling.js'

export async function before(m) {
    const user = await db.users.get(m.sender)
    if (!user.autolevelup)
        return !0
    const currentLevel = user.level * 1
    const shouldLevel = findLevel(user.exp, global.multiplier)

    if (shouldLevel > currentLevel) {
        user.role = global.rpg.role(user.level).name
        await Promise.all([
            db.users.update(m.sender, { level: shouldLevel }),
            m.reply(`
Selamat, ${this.getName(m.sender)} telah naik level!
• 🧬Level Sebelumnya : ${before}
• 🧬Level Baru : ${user.level}
• 🧬Role Kamu : ${user.role}
gunakan *.inventory* untuk mengecek
	`.trim())
        ])
    }
}
export const disabled = false