import db from '../lib/database/index.js'

let handler = async (m, { usedPrefix, args }) => {
  let user = await db.users.get(m.sender)
  
  let enhanceType = args[0]
  let enhanceCost = 0
  let enhanceMultiplier = 0

  if (enhanceType == 'strength') {
    enhanceCost = 100 * (user.strength_multiplier ** 2)
    enhanceMultiplier = 2
  } else if (enhanceType === 'defense') {
    enhanceCost = 200 * (user.defense_multiplier ** 2)
    enhanceMultiplier = 2
  } else if (enhanceType === 'speed') {
    enhanceCost = 50 * (user.speed_multiplier ** 2)
    enhanceMultiplier = 2
  } else if (enhanceType === 'psychic') {
    enhanceCost = 500 * (user.psychic_multiplier ** 2)
    enhanceMultiplier = 2
  } else {
    return m.reply(`
Gunakan Format .enhance [type]

🪚 Daftar Enhancement:
${user.speed_multiplier}× ⚡ speed | ${50 * (user.speed_multiplier ** 2)} 🩻
${user.strength_multiplier}× 💪🏻 strength | ${100 * (user.strength_multiplier ** 2)} 🩻
${user.defense_multiplier}× 🛡️ defense | ${200 * (user.defense_multiplier ** 2)} 🩻
${user.psychic_multiplier}× 🍃 psychic | ${500 * (user.psychic_multiplier ** 2)} 🩻

🩻 Token: ${user.token}
    `.trim())
  }

  if (user.token < enhanceCost) {
    return m.reply(`🩻 Kamu tidak memiliki cukup token untuk melakukan enhancement ${enhanceType}.\n🩻 Token yang dibutuhkan adalah ${enhanceCost}`)
  }

  await db.users.update(m.sender, (user) => {
    user.token -= enhanceCost

    if (enhanceType === 'strength') {
      user.strength_multiplier *= enhanceMultiplier
    } else if (enhanceType === 'defense') {
      user.defense_multiplier *= enhanceMultiplier
    } else if (enhanceType === 'speed') {
      user.speed_multiplier *= enhanceMultiplier
    } else if (enhanceType === 'psychic') {
      user.psychic_multiplier *= enhanceMultiplier
    }

    return user
  })

  let updatedUser = await db.users.get(m.sender)
  m.reply(`📈 Enhancement Berhasil 📈\n\nStat ${enhanceType} kamu meningkat menjadi ${updatedUser[enhanceType + '_multiplier']}x!`)
}

handler.help = ['enhance strength', 'enhance defense', 'enhance speed', 'enhance psychic']
handler.tags = ['rpg']
handler.command = /^(enhance)$/i

export default handler