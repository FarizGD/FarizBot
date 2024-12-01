import db from '../lib/database/index.js'

let handler = async (m, { isPrems, conn, text, usedPrefix, command }) => {
  let user = await db.users.get(m.sender)
  let txt = `
 ➽=========================== ➽
• Untuk menghancurkan limit anda, anda harus membayar:
> 300 ✤ gmoney
> 7 🎴 cardly
> 100 🪙 vcoin
> 3 👛 scoin

• Serta anda juga harus setidaknya memiliki:
> 1000 🧬 level
> 100 👥 followers
> 1 🐉 dragon
 ➽=========================== ➽
`.trim()
  if (user.gmoney < 300 || user.cardly < 7 || user.vcoin < 100 || user.scoin < 3 || user.level < 1000 || user.followers < 100 || user.dragon < 1) {
    m.reply(txt)
    return
  }
  await db.users.update(m.sender, (user) => {
    user.gmoney -= 300
    user.cardly -= 7
    user.vcoin -= 100
    user.scoin -= 3
    user.antilimit = true
  })
}
handler.help = ['antilimit']
handler.tags = ['limit']
handler.command = /^(antilimit)$/i

export default handler