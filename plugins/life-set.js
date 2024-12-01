import db from '../lib/database/index.js'

let handler = async (m, { isPrems, conn, text, usedPrefix, command }) => {
  let user = await db.users.get(m.sender)
  let txt = `
=== 👥 Atur Profil ===

Apakah Anda ingin mengatur profil?
✏️ /setnama <nama kamu>
👤 /setgender <male ♂️ atau female ♀️>
🎂 /setumur <umur kamu>
🕌 /setagama <agama kamu> | tidak wajib

⚠️ Hanya bisa setup sekali ⚠️
Perubahan data memerlukan gamepass
`.trim()
  
  conn.sendFile(m.chat, './picture/tutorial/tutorial_set.jpeg', './picture/tutorial/tutorial_set.jpeg', txt, m)
}
handler.help = ['setprofile (arahan)', 'set (arahan)']
handler.tags = ['life']
handler.command = /^(set|setprofile)$/i

export default handler