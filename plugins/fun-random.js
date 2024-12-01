let handler = async (m, { conn, command, text, usedPrefix }) => {
    conn.reply(m.chat, `
  ${command} number: ${(101).getRandom()}
  `.trim(), m, m.mentionedJid ? {
        mentions: m.mentionedJid
    } : {})
}
handler.help = ['random <random number>']
handler.tags = ['fun']
handler.command = /^random/i

export default handler