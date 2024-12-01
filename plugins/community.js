let handler = async (m, { conn, text, usedPrefix, command }) => {
    
    m.reply(`Disabled 🛩️...`)
}

handler.help = ['komunitas']
handler.tags = ['data']

handler.command = /^komunitas|community/i

export default handler