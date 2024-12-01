import db from '../lib/database/index.js'

const items = {
    godmode_add: {
        coinly: {
            exp: 0
        },
        money: {
            exp: 0
        },
        limit: {
            exp: 0
        },
        car: {
            exp: 0
        },
        maxcrate: {
            exp: 0
        },
        prestige: {
            exp: 0
        },
        clickly: {
            exp: 0
        },
        palu: {
            exp: 0
        },
        aranara: {
            exp: 0
        },
        rupiah: {
            exp: 0
        },
    },
    godmode_remove: {
        coinly: {
            exp: 0,
        },
        money: {
            exp: 0
        },
        limit: {
            exp: 0
        },
        car: {
            exp: 0
        },
        maxcrate: {
            exp: 0
        },
        prestige: {
            exp: 0
        },
        clickly: {
            exp: 0
        },
        palu: {
            exp: 0
        },
        aranara: {
            exp: 0
        },
        rupiah: {
            exp: 0
        },
    }
}

let handler = async (m, { command, usedPrefix, args }) => {
    let user = await db.users.get(m.sender)
    const listItems = Object.fromEntries(Object.entries(items[command.toLowerCase()]).filter(([v]) => v && v in user))
    const info = `
Gunakan Format *${usedPrefix}${command} [crate] [jumlah]*
Contoh penggunaan: *${usedPrefix}${command} potion 10*

📍Daftar item: 
${Object.keys(listItems).map((v) => {
        let paymentMethod = Object.keys(listItems[v]).find(v => v in user)
        return `${global.rpg.emoticon(v)}${v} | ${toSimple(listItems[v][paymentMethod])} ${global.rpg.emoticon(paymentMethod)}${paymentMethod}`.trim()
    }).join('\n')}
`.trim()
    const item = (args[0] || '').toLowerCase()
    const total = Math.floor(isNumber(args[1]) ? Math.min(Math.max(parseInt(args[1]), 1), Number.MAX_SAFE_INTEGER) : 1) * 1
    if (!listItems[item]) return m.reply(info)
    if (command.toLowerCase() == 'godmode_add') {
        let paymentMethod = Object.keys(listItems[item]).find(v => v in user)
        if (user[paymentMethod] < listItems[item][paymentMethod] * total) return m.reply(`Kamu tidak memiliki cukup ${global.rpg.emoticon(paymentMethod)}${paymentMethod} untuk menambahkan *${total}* ${global.rpg.emoticon(item)}${item}. Kamu membutuhkan *${(listItems[item][paymentMethod] * total) - user[paymentMethod]}* ${paymentMethod} lagi untuk bisa menambahkan`)
        await db.users.update(m.sender, (user) => {
            user[paymentMethod] -= listItems[item][paymentMethod] * total
            user[item] += total
        })
        return m.reply(`Kamu mendapatkan *${total}* ${global.rpg.emoticon(item)}${item}`)
    } else {
        if (user[item] < total) return m.reply(`Kamu tidak memiliki cukup *${global.rpg.emoticon(item)}${item}* untuk dihapus, kamu hanya memiliki ${user[item]} item`)
        const reward = listItems[item]
        if (Object.keys(reward).length > 1) throw new Error('Multiple reward not supported yet!')
        const rewardKey = Object.keys(reward)[0]
        if (!(rewardKey in user)) throw new Error(`Pengguna tidak memiliki ${rewardKey} dalam database mereka, tetapi hadiah memberikannya!`)
        await db.users.update(m.sender, (user) => {
            user[item] -= total
            user[rewardKey] += listItems[item][rewardKey] * total
        })
        return m.reply(`Kamu menghapus *${total}* ${global.rpg.emoticon(item)}${item}`)
    }
}

handler.help = ['godmode_add', 'godmode_remove'].map(v => v + ' [item] [jumlah]')
handler.tags = ['owner']
handler.command = /^(godmode_add|godmode_remove)$/i

handler.disabled = false
handler.rowner = true

export default handler

function isNumber(number) {
    if (!number) return number
    number = parseInt(number)
    return typeof number == 'number' && !isNaN(number)
}

function toSimple(number) {
    number = parseInt(number * 1)
    if (!isNumber(number)) return number
    const formatter = Intl.NumberFormat('en', { notation: 'compact' })
    return formatter.format(number)
}