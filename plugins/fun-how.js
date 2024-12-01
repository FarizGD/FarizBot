let handler = async (m, { conn, command, text, usedPrefix }) => {
    if (!text) throw `Use example ${usedPrefix}${command} i'm`
    conn.reply(m.chat, `
🪹 ${command} *${text}*
❔ *${text}* is *${(101).getRandom()}*% ${command.replace('how', '').toUpperCase()}
  `.trim(), m, m.mentionedJid ? {
        mentions: m.mentionedJid
    } : {})
}
handler.help = ['gay', 'pintar', 'cantik', 'ganteng', 'gabut', 'gila', 'lesbi', 'stress', 'bucin', 'jones', 'sadboy', 'furry', 'tolol', 'karbit', 'wibu', 'furrygay', 'poyok', 'sigma', 'brainrot', 'nolep', 'sange', 'pedo'].map(v => 'how' + v + ' siapa?')
handler.tags = ['kerang', 'fun']
handler.command = /^how(pintar|cantik|ganteng|gabut|gila|lesbi|stress?|bucin|jones|sadboy|gay|furry|tolol|karbit|wibu|furrygay|poyok|sigma|brainrot|nolep|sange|pedo)/i

export default handler