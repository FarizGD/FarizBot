let handler = async (m, { conn, text, usedPrefix, command }) => {
    m.reply(`
Tydak dijual.
donate utk premium :)
`.trim())
}

handler.help = ['premium', 'store']
handler.tags = ['premium']

handler.command = /^(premium|store)$/i

export default handler