import db from '../lib/database/index.js'

let handler = async (m, { isPrems, conn, text, usedPrefix, command }) => {
  let user = await db.users.get(m.sender)

  if (!text || !['true', 'false'].includes(text.toLowerCase())) {
    m.reply(`
Silakan pilih opsi transfer:
- *True*  ✅
- *False*  ❌
Contoh: *${usedPrefix}${command} true*
`.trim())
    return
  }

  // Set opsi transfer pengguna
  await db.users.update(m.sender, (user) => {
    user.settransfer = text.toLowerCase() === 'true' ? true : false
  })
  m.reply(`✅ Opsi transfer Anda berhasil diatur sebagai *${text}* ${text.toLowerCase() === 'true' ? '✅' : '❌'}.`)
}

handler.help = ['settransfer <true/false>']
handler.tags = ['rpg']
handler.command = /^(settransfer|stf|settf)$/i

export default handler