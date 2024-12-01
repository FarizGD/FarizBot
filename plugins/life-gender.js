import db from '../lib/database/index.js'

let handler = async (m, { isPrems, conn, text, usedPrefix, command }) => {
  const user = await db.users.get(m.sender)

  if (user.verified == true) {
      m.reply(`Kamu sudah terverifikasi ☑️, tidak bisa ganti gender 👤\nHubungi wa.me/6282213162100 untuk mengganti`)
      return
  }
  
  if (user.gender != "non-binary 🎭" && isPrems == false && user.gamepass < 1) {
    m.reply('❗ Gender pengguna hanya bisa diatur satu kali saja.\n💳 atau gunakan gamepass')
    return
  }

  if (!text || !['male', 'female'].includes(text.toLowerCase())) {
    m.reply(`
Silakan pilih gender Anda:
- *Male*  ♂️
- *Female*  ♀️
Contoh: *${usedPrefix}${command} male*
`.trim())
    return
  }

  // Set gender pengguna
  await db.users.update(m.sender, (user) => {
    user.gender = text.toLowerCase() === 'male' ? "male ♂️" : "female ♀️"
  })
  
  m.reply(`✅ Gender Anda berhasil diatur sebagai *${text}*  ${text.toLowerCase() === 'male' ? '♂️' : '♀️'}.`)
    
  if (user.gamepass >= 1 && isPrems == false && user.gender != "non-binary 🎭") {
    await db.users.update(m.sender, (user) => {
      user.gamepass -= 1
    })
    m.reply('-1 💳 gamepass')
  }
}

handler.help = ['setgender <male/female>']
handler.tags = ['life']
handler.command = /^setgender$/i

export default handler
