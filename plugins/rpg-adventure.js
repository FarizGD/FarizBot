import db from '../lib/database/index.js'

const cooldown = 300000
let handler = async (m, { usedPrefix }) => {
    const user = await db.users.get(m.sender)
    let timers = (cooldown - (new Date - user.lastadventure))
    if (user.health < 20) return m.reply(`
Untuk berpetualang, dibutuhkan sedikitnya 20 Darah!
Anda bisa membeli darah ❤️ dengan ketik *${usedPrefix}buy potion <jumlah>*,
dan ketik *${usedPrefix}heal <jumlah>* untuk menggunakan potions!
`.trim())
    if (new Date - user.lastadventure <= cooldown) return m.reply(`
You're already adventure!!, please wait *🕐${timers.toTimeString()}*
`.trim())
    const rewards = reward(user)
    let text = 'you\'ve been adventure and lost'
    await db.users.update(m.sender, (user) => {
        for (const lost in rewards.lost) if (user[lost]) {
            const total = rewards.lost[lost].getRandom()
            user[lost] -= total * 1
            if (total) text += `\n*${global.rpg.emoticon(lost)}${lost}:* ${total}`
        }
        text += '\n\nBut you got'
        for (const rewardItem in rewards.reward) if (rewardItem in user) {
            const total = rewards.reward[rewardItem].getRandom()
            user[rewardItem] += total * 1
            if (total) text += `\n*${global.rpg.emoticon(rewardItem)}${rewardItem}:* ${total}`
        }
        user.lastadventure = new Date * 1
    })
    await m.reply(text.trim())

}
handler.help = ['adventure', 'petualang', 'berpetualang', 'mulung']
handler.tags = ['rpg']
handler.command = /^(adventure|(ber)?petualang(ang)?|mulung)$/i

handler.cooldown = cooldown

export default handler

function reward(user = {}) {
    let rewards = {
        reward: {
            money: 51,
            exp: 71,
            trash: 21,
            potion: 1,
            rock: 1,
            wood: 1,
            string: 1,
            common: 1 * (user.dog && (user.dog > 2 ? 2 : user.dog) * 1.2 || 1),
            rare: [0, 0, 0, 1, 0].concat(
                new Array(5 - (
                    (user.dog > 2 && user.dog < 6 && user.dog) || (user.dog > 5 && 5) || 2
                )).fill(0)
            ),
            mythic: [0, 0, 0, 0, 0, 1, 0, 0, 0].concat(
                new Array(8 - (
                    (user.dog > 5 && user.dog < 8 && user.dog) || (user.dog > 7 && 8) || 3
                )).fill(0)
            ),
            legendary: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0].concat(
                new Array(10 - (
                    (user.dog > 8 && user.dog) || 4
                )).fill(0)
            ),
            iron: [0, 0, 0, 1, 0, 0],
            gold: [0, 0, 0, 0, 0, 1, 0],
            diamond: [0, 0, 0, 0, 0, 0, 1, 0].concat(
                new Array(5 - (
                    (user.fox < 6 && user.fox) || (user.fox > 5 && 5) || 0
                )).fill(0)
            ),
        },
        lost: {
            health: 101 - user.cat * 4,
            armordurability: (15 - user.armor) * 7
        }
    }
    return rewards
}