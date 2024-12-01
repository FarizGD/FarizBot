let handler = async (m, { conn, text, usedPrefix, command }) => {
conn.sendFile(m.chat, './picture/qris.png', './picture/qris.png', `
/-[ Donasi - Pulsa ]
│ • Telkomsel [085179735436]
\\---

/-[ Donasi - Non Pulsa ]
│ • Gopay [085179735436]
\\----

Note : Seikhalsnya aja yaa =)

`.trim(), m)
}    
handler.help = ['donasi']
handler.tags = ['info']
handler.command = /^dona(te|si)$/i

export default handler
