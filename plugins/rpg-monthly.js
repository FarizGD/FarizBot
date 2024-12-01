import db from '../lib/database/index.js'

const cooldown = 2592000000
let handler = async (m) => {
    let user = await db.users.get(m.sender)
    
    let rewards = {
        exp: 10000,
        money: 2000,
    }
    if (user.level >= 30) {
        rewards = {
            exp: 10000,
            money: 10 / 100 * user.money,
        }
    }
    
    if (new Date - user.lastmonthly < cooldown) throw `Anda telah mengklaim hadiah bulanan ini, tunggu hingga *${((user.lastmonthly + cooldown) - new Date()).toTimeString()}*`
    let text = ''
    for (let reward of Object.keys(rewards)) {
        if (reward in user) {
            await db.users.update(m.sender, (userData) => {
                userData[reward] += rewards[reward]
            })
            text += `*+${toSimple(rewards[reward])}* ${rpg.emoticon(reward)}${reward}\n`
        }
    }
    m.reply(text.trim())
    await db.users.update(m.sender, (userData) => {
        userData.lastmonthly = new Date() * 1
    })
}
handler.help = ['monthly']
handler.tags = ['rpg']
handler.command = /^(monthly)$/i

handler.cooldown = cooldown

export default handler

function toSimple(number) {
    if (isNaN(parseFloat(number))) return number;
    if (parseFloat(number) === 0) return '0';
    number = parseFloat(number).toFixed(0);
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'N', 'Dc', 'Ud', 'Dd', 'Td', 'Qua', 'Qui'];
    const base = 1000;
    const exponent = Math.floor(Math.log10(Math.abs(number)) / 3);
    const suffix = suffixes[exponent] || '';
    const simplified = number / Math.pow(base, exponent);
    const formatter = Intl.NumberFormat('en', { maximumFractionDigits: 1 });
    return formatter.format(simplified) + suffix;
}