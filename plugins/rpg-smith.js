import db from '../lib/database/index.js'

const cooldown = 900000 // 15 menit dalam milidetik

let handler = async (m, { args, usedPrefix }) => {
    let user = await db.users.get(m.sender)
    let material = args[0] // Material yang akan di-smith, seperti 'iron', 'gold', atau 'diamond'
    
    if (!material) {
        return m.reply(`
🔨 Masukkan material yang ingin Anda smith: 
❧ ${usedPrefix}smith iron ⚱️
❧ ${usedPrefix}smith gold 🏅
❧ ${usedPrefix}smith diamond 🪩
`.trim())
    }
    
    if (new Date() - (user.lastsmith || 0) < cooldown) {
        throw `Mohon tunggu sebentar sebelum menggunakan command ini kembali. Cooldown: ${((user.lastsmith || 0) + cooldown - new Date()) / 1000} detik`
    }
    
    let materialName = material.toLowerCase()
    
    switch (materialName) {
        case 'iron':
            if ((user.ironore || 0) < 10 || (user.iron || 0) < 100000000000000000) {
                return m.reply(`
✖️ Anda tidak memiliki cukup bahan untuk membuat ✨ silver
↠ 10 ⚙️ iron ore
↠ 100Qa ⛓️ iron
`.trim())
            }
            await db.users.update(m.sender, (user) => {
                user.ironore -= 10
                user.iron = 0
                user.silver = (user.silver || 0) + 1
            })
            break
        case 'gold':
            if ((user.goldore || 0) < 10 || (user.gold || 0) < 100000000000000000) {
                return m.reply(`
✖️ Anda tidak memiliki cukup bahan untuk membuat ✨ light gold
↠ 10 🟡 gold ore
↠ 100Qa 🟨 gold
`.trim()) 
            }
            await db.users.update(m.sender, (user) => {
                user.goldore -= 10
                user.gold = 0
                user.light_gold = (user.light_gold || 0) + 1
            })
            break
        case 'diamond':
            if ((user.diamondore || 0) < 10 || (user.diamond || 0) < 100000000000000000) {
                return m.reply(`
✖️ Anda tidak memiliki cukup bahan untuk membuat ✨ 
↠ 10 💠 diamond ore
↠ 100Qa 💎 diamond
`.trim())
            }
            await db.users.update(m.sender, (user) => {
                user.diamondore -= 10
                user.diamond = 0
                user.crystal = (user.crystal || 0) + 1
            })
            break
        default:
            return m.reply('⚠️ Material yang Anda masukkan tidak valid. Material yang tersedia: iron, gold, diamond ⚠️')
    }
    
    await db.users.update(m.sender, (user) => {
        user.lastsmith = new Date()
    })
    m.reply(`Anda telah berhasil membuat 1 ${materialName === 'iron' ? '✨ silver' : materialName === 'gold' ? '✨ light_gold' : '✨ crystal'}`)
}

handler.help = ['smith <material>']
handler.tags = ['rpg']
handler.command = /^(smith)$/i

handler.cooldown = cooldown

export default handler