import db from '../lib/database/index.js'

const items = {
    buyfood: {
        burger: {
            coinly: 11,
        },
        pizza: {
            coinly: 18,
        },
        kentang: {
            coinly: 2,
        },
    },
    sellfood: {
        burger: {
            coinly: 5,
        },
        pizza: {
            coinly: 9,
        },
        kentang: {
            coinly: 1,
        },
    }
}

let handler = async (m, { conn, command, usedPrefix, args, text, isPrems }) => {
    let user = await db.users.get(m.sender)
    if (command.toLowerCase() == 'foodshop') {
        let text = `
=== 🏪 toko makanan ===

Ingin menggunakan *toko*?
Ketik _/buyfood_ bila ingin membeli makanan!
Ketik _/sellfood_ bila ingin menjual makanan!
`.trim()
        conn.reply(m.chat, text, m)
        //conn.sendButton(m.chat, text, author, [['🏬 buyfood', '/buyfood'],['💈 sellfood', '/sellfood']], m)
        return
    }
    const listItems = Object.fromEntries(Object.entries(items[command.toLowerCase()]).filter(([v]) => v && v in user))
    const info = `
Gunakan Format *${usedPrefix}${command} [crate] [jumlah]*
Contoh penggunaan: *${usedPrefix}${command} burger 10*
    
📍Daftar item: 
${Object.keys(listItems).map((v) => {
        let paymentMethod = Object.keys(listItems[v]).find(v => v in user)
        return `${global.rpg.emoticon(v)}${v} | ${toSimple(listItems[v][paymentMethod])} ${global.rpg.emoticon(paymentMethod)}${paymentMethod}`.trim()
    }).join('\n')}
`.trim()
    const item = (args[0] || '').toLowerCase()
    let total = Math.floor(isNumber(args[1]) ? Math.min(Math.max(parseInt(args[1]), 1), Number.MAX_SAFE_INTEGER) : 1) * 1
    if (!listItems[item]) return m.reply(info)
    if (command.toLowerCase() == 'buyfood') {
        let paymentMethod = Object.keys(listItems[item]).find(v => v in user)
        if (user[paymentMethod] < listItems[item][paymentMethod] * total) return m.reply(`Anda tidak memiliki cukup ${global.rpg.emoticon(paymentMethod)}${paymentMethod} untuk membeli *${total}* ${global.rpg.emoticon(item)}${item}. Anda membutuhkan *${(listItems[item][paymentMethod] * total) - user[paymentMethod]}* ${paymentMethod} lagi untuk dapat membeli`)
        await db.users.update(m.sender, (user) => {
            user[paymentMethod] -= listItems[item][paymentMethod] * total
            user[item] += total
        })
        return m.reply(`Anda telah membeli *${toSimple(total)}* ${global.rpg.emoticon(item)}${item}`)
    } else if (command.toLowerCase() == 'sellfood') {
        if (isPrems && /all/i.test(args[1])) total = Math.max(Math.floor(parseInt(user[item])), 1)
        if (user[item] < total) return m.reply(`Anda tidak memiliki cukup *${global.rpg.emoticon(item)}${item}* untuk menjual, Anda hanya memiliki ${user[item]} item`)
        const reward = listItems[item]
        if (Object.keys(reward).length > 1) throw new Error('Multiple reward not supported yet!')
        const rewardKey = Object.keys(reward)[0]
        if (!(rewardKey in user)) throw new Error(`Pengguna tidak memiliki ${rewardKey} dalam database mereka, tetapi reward memberikannya!`)
        await db.users.update(m.sender, (user) => {
            user[item] -= total
            user[rewardKey] += listItems[item][rewardKey] * total
        })
        return m.reply(`Anda telah menjual *${toSimple(total)}* ${global.rpg.emoticon(item)}${item} dan mendapatkan *${toSimple(listItems[item][rewardKey] * total)}* ${global.rpg.emoticon(rewardKey)}`)
    }
}

handler.help = ['buyfood', 'sellfood'].map(v => v + ' [item] [jumlah]')
handler.tags = ['rpg']
handler.command = /^(foodshop|buyfood|sellfood)$/i

handler.disabled = false

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

function number(x = 0) {
    x = parseInt(x)
    return !isNaN(x) && typeof x == 'number'
}
