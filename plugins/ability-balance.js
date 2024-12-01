import db from '../lib/database/index.js'

let handler = async (m, { isPrems, conn }) => {
  const user = await db.users.get(m.sender)
  if (user.balancer < 1) {
    m.reply('Kamu tidak memiliki balancer ⚖️')
    return
  }

  if (user.balancer >= 1) {
    m.reply('🕊️ Kekuatan anda sudah merata 🕊️')
    await db.users.update(m.sender, (user) => {
      user.balancer -= 1
      user.defense = Math.floor((user.psychic + user.strength + user.defense) / 3)
      user.psychic = user.defense
      user.strength = user.defense
    })
    return
  }
}

handler.help = ['balance']
handler.tags = ['ability']
handler.command = /^(balance)$/i

export default handler