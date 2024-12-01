import db from '../lib/database/index.js'

const cooldown = 30000

const items = {
    buy: {
        limit: {
            clickly: 5
        },
        potion: {
            money: 80,
        },
        sphere: {
            money: 1600000,
        },
        elixir: {
            money: 640000000,
        },
        wood: {
            money: 35,
        },
        rock: {
            money: 55,
        },
        string: {
            money: 18,
        },
        iron: {
            money: 1500,
        },
        gold: {
            money: 3000,
        },
        diamond: {
            money: 45000,
        },
        emerald: {
            money: 820000,
        },
        orb: {
            money: 16500000,
        },
        keping: {
            money: 330000000,
        },
        common: {
            money: 350,
        },
        rare: {
            money: 5300,
        },
        mythic: {
            money: 80000,
        },
        legendary: {
            money: 1200000,
        },
        safana: {
            money: 18750000,
        },
        luxury: {
            money: 287000000,
        },
        trash: {
            money: 4,
        }
    },
    sell: {
        potion: {
            money: 60,
        },
        sphere: {
            money: 1000000,
        },
        elixir: {
            money: 320000000,
        },
        wood: {
            money: 27,
        },
        rock: {
            money: 41,
        },
        string: {
            money: 9,
        },
        iron: {
            money: 1100,
        },
        gold: {
            money: 2400,
        },
        diamond: {
            money: 38000,
        },
        emerald: {
            money: 740000,
        },
        orb: {
            money: 14900000,
        },
        keping: {
            money: 224000000,
        },
        trash: {
            money: 3,
        }
    }
}

let handler = async (m, { conn, command, usedPrefix, args, text, isPrems }) => {
    let user = await db.users.get(m.sender)

    if (new Date() - user.lastshop < cooldown) {
        const remainingTime = new Date(user.lastshop + cooldown) - new Date()
        const formattedTime = new Date(remainingTime).toISOString().substr(11, 8)
        throw `Kamu baru saja pergi ke toko! Tunggu selama *${formattedTime}*`
    }

    if (command.toLowerCase() == 'shop') {
        let text = `
=== 🏪 toko ===

Ingin menggunakan *toko*?
Ketik _/buy_ bila ingin membeli!
Ketik _/sell_ bila ingin menjual!
`.trim()
        conn.reply(m.chat, text, m)
        return
    }

    const listItems = Object.fromEntries(Object.entries(items[command.toLowerCase()]).filter(([v]) => v && v in user))
    const info = `
Gunakan Format *${usedPrefix}${command} [crate] [count]*
Contoh penggunaan: *${usedPrefix}${command} potion 10*
    
📍Daftar barang: 
${Object.keys(listItems).map((v) => {
        let paymentMethod = Object.keys(listItems[v]).find(v => v in user)
        return `${global.rpg.emoticon(v)}${v} | ${toSimple(listItems[v][paymentMethod])} ${global.rpg.emoticon(paymentMethod)}${paymentMethod}`.trim()
    }).join('\n')}
`.trim()

    const item = (args[0] || '').toLowerCase()

    if (!listItems[item]) {
        return m.reply(info)
    }

    if (!args[1]) {
        m.reply(info)
        return
    }

    let total = Math.floor(isNumber(args[1]) ? Math.min(Math.max(parseInt(args[1]), 1)) : 1) * ({"K":1e3,"M":1e6,"B":1e9,"T":1e12,"QA":1e15,"QI":1e18,"SX":1e21,"SP":1e24,"OC":1e27,"N":1e30,"DC":1e33,"UD":1e36,"DD":1e39,"TD":1e42,"QUA":1e45,"QUI":1e48, "SXD":1e51, "SPD":1e54, "OCD":1e57, "NOD":1e60, "VG":1e63}[args[1].toUpperCase().replace(/[^KMBTQAISXONDCUP]/g,'')] || 1);

    if (command.toLowerCase() == 'buy') {
        user = await db.users.get(m.sender)
        let paymentMethod = Object.keys(listItems[item]).find(v => v in user)
        let previous = user[paymentMethod] * 1; // Simpan nilai uang sebelumnya
        if (user[paymentMethod] < listItems[item][paymentMethod] * total) {
            return m.reply(`Anda tidak memiliki cukup ${global.rpg.emoticon(paymentMethod)}${paymentMethod} untuk membeli *${toSimple(total)}* ${global.rpg.emoticon(item)}${item}. Anda memerlukan *${toSimple((listItems[item][paymentMethod] * total) - user[paymentMethod])}* ${paymentMethod} lagi untuk dapat membeli`)
        }
        // Mengurangi uang dan menambahkan item
        await db.users.update(m.sender, (user) => {
            user[paymentMethod] -= listItems[item][paymentMethod] * total
            user[item] += total
            user.lastshop = new Date() * 1
        })
        return m.reply(`Anda telah membeli *${toSimple(total)}* ${global.rpg.emoticon(item)}${item}`)
    } else if (command.toLowerCase() == 'sell') {
        let previous = user[item] * 1; // Simpan jumlah item sebelum penjualan
        if (isPrems && /all/i.test(args[1])) {
            total = user[item];
        }
        if (user[item] < total) {
            return m.reply(`Anda tidak memiliki cukup *${global.rpg.emoticon(item)}${item}* untuk dijual. Anda hanya memiliki ${toSimple(user[item])} item`)
        }
        const reward = listItems[item]
        if (Object.keys(reward).length > 1) {
            throw new Error('Multiple reward not supported yet!')
        }
        const rewardKey = Object.keys(reward)[0]
        if (!(rewardKey in user)) {
            throw new Error(`Pengguna tidak memiliki ${rewardKey} dalam database mereka, tetapi hadiah memberikannya!`)
        }
        // Mengurangi item dan menambahkan hadiah
        await db.users.update(m.sender, (user) => {
            user[item] -= total
            user[rewardKey] += listItems[item][rewardKey] * total
            user.lastshop = new Date() * 1
        })
        return m.reply(`Anda telah menjual *${toSimple(total)}* ${global.rpg.emoticon(item)}${item} dan mendapatkan *${toSimple(listItems[item][rewardKey] * total)}* ${global.rpg.emoticon(rewardKey)}`)
    }
}

handler.help = ['buy', 'sell'].map(v => v + ' [item] [count]')
handler.tags = ['rpg']
handler.command = /^(shop|buy|sell)$/i
handler.cooldown = cooldown

handler.disabled = false

export default handler

function isNumber(number) {
    if (!number) return number
    number = parseInt(number)
    return typeof number == 'number' && !isNaN(number)
}

function toSimple(number) {
    if (isNaN(parseFloat(number))) return number
    if (parseFloat(number) === 0) return '0'
    number = parseFloat(number).toFixed(0)
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'N', 'Dc', 'Ud', 'Dd', 'Td', 'Qua', 'Qui', 'Sxd', 'Spd', 'Ocd', 'NoD', 'Vg']
    const base = 1000
    const exponent = Math.floor(Math.log10(Math.abs(number)) / 3)
    const suffix = suffixes[exponent] || ''
    const simplified = number / Math.pow(base, exponent)
    const formatter = Intl.NumberFormat('en', { maximumFractionDigits: 1 })
    return formatter.format(simplified) + suffix
}
