import db from '../lib/database/index.js'

let handler = async (m, { isPrems, conn, text, usedPrefix, command }) => {
  const user = await db.users.get(m.sender)

  if (user.verified == true) {
    m.reply(`Kamu sudah terverifikasi ☑️, tidak bisa ganti agama 🕌\nHubungi wa.me/6282213162100 untuk mengganti`)
    return
  }
  
  if (user.agama !== "-" && isPrems == false && user.gamepass < 1) {
    m.reply('❗ Agama pengguna hanya bisa diatur satu kali saja.\n💳 atau gunakan gamepass')
    return
  }

  if (!text || !['islam', 'kristen', 'katolik', 'yahudi', 'hindu', 'buddha'].includes(text.toLowerCase())) {
    m.reply(`
Silakan pilih agama Anda:
- *Islam*  🕌
- *Kristen*  ⛪️
- *Katolik*  📿
- *Yahudi*  🕍
- *Hindu*  🕉️
- *Buddha*  ☸️
Contoh: *${usedPrefix}${command} islam*
`.trim())
    return
  }

  // Set agama pengguna
  await db.users.update(m.sender, (user) => {
    user.agama = text.toLowerCase()
  })
  
  m.reply(`✅ Agama Anda berhasil diatur sebagai *${text}*  ${text.toLowerCase() === 'islam' ? '🕌' : text.toLowerCase() === 'kristen' ? '⛪️': text.toLowerCase() === 'katolik' ? '📿' : text.toLowerCase() === 'yahudi' ? '🕍' : text.toLowerCase() === 'hindu' ? '🕉️' : '☸️'}.`)
    
  if (user.gamepass >= 1 && isPrems == false && user.agama != '-') {
    await db.users.update(m.sender, (user) => {
      user.gamepass -= 1
    })
    m.reply('-1 💳 gamepass')
  }  
}
handler.help = ['setagama <agama>']
handler.tags = ['life']
handler.command = /^setagama$/i

export default handler
