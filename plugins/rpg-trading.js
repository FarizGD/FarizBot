import db from '../lib/database/index.js';

const cooldown = 3600000;
let handler = async (m, { conn, usedPrefix, args }) => {
    let user = await db.users.get(m.sender);

    let count = (args[0] && !isNaN(args[0]) ? parseInt(args[0]) : (/^\D+$/.test(args[0]) && !/all/i.test(args[0])) ? 1 : args[0].toUpperCase().replace(/all/i, user.money).replace(/(\d*\.?\d*)([A-Z]+)/g, (_,n,p)=>parseFloat(n)*({K:1e3,M:1e6,B:1e9,T:1e12,QA:1e15,QI:1e18,SX:1e21,SP:1e24,OC:1e27,N:1e30,DC:1e33,UD:1e36,DD:1e39,TD:1e42,QUA:1e45,QUI:1e48, "SXD":1e51, "SPD":1e54, "OCD":1e57, "NOD":1e60, "VG":1e63}[p] || 1)) || 1);

    let timers = (cooldown - (new Date() - user.lasttrading));
    if (user.level < 20) return m.reply(`Minimal 🔼 *level 20* untuk menggunakan fitur ini!`);
    if (new Date() - user.lasttrading <= cooldown) return m.reply(`
Anda sudah melakukan trading! Silakan tunggu selama *🕐${timers.toTimeString()}*
`.trim());
    if (user.health < 20) return m.reply(`
Untuk trading, dibutuhkan sedikitnya 20 Darah!
Anda bisa membeli darah ❤️ dengan ketik *${usedPrefix}buy potion <jumlah>*,
dan ketik *${usedPrefix}heal <jumlah>* untuk menggunakan potions!
`.trim());

    let minimal_coinly = 100;
    if (count > 1000000000000) {
        minimal_coinly = 100 + (Math.ceil((Math.ceil(Math.log10(count)) - 12)/3)) * 100;
    } else {
        minimal_coinly = 100;
    }

    if (user.coinly < minimal_coinly) return m.reply(`
Untuk trading, dibutuhkan sedikitnya ${minimal_coinly} 🧭 Coinly!
Anda bisa mendapatkan Coinly 🧭 dengan ketik *${usedPrefix}coinly*
`.trim());
    if (count < 100000000) return m.reply(`
Untuk trading, dibutuhkan sedikitnya 100 juta 💵 Money!
Hanya mengetik '/trading' berarti '/trading 1' ⚠️
`.trim());
    if (user.money < count) return m.reply(`
Untuk trading, dibutuhkan sedikitnya ${count} 💵 Money!
`.trim());
    if (user.trash > 1000) return m.reply(`
Anda terlalu kotor untuk 🛤️ trading! Buang dulu sampahmu 😖!
`.trim());
    const rewards = reward(user, count, minimal_coinly);
    let text = 'Kamu telah trading dan kehilangan:';
    for (const lost in rewards.lost) if (user[lost]) {
        const total = rewards.lost[lost].getRandom();
        await db.users.update(m.sender, (user) => {
            user[lost] -= total * 1;
        });
        if (total) text += `\n*${global.rpg.emoticon(lost)}${lost}:* ${toSimple(total)}`;
    }
    text += '\n\nHasil Trading:';
    for (const rewardItem in rewards.reward) if (rewardItem in user) {
        const total = rewards.reward[rewardItem].getRandom();
        await db.users.update(m.sender, (user) => {
            user[rewardItem] += total;
        });
        if (total) text += `\n*${global.rpg.emoticon(rewardItem)}${rewardItem}:* ${toSimple(total)}`;
    }
    m.reply(text.trim());
    await db.users.update(m.sender, (user) => {
        user.lasttrading = new Date() * 1;
    });
};
handler.help = ['trading'];
handler.tags = ['rpg'];
handler.command = /^(trading)$/i;

handler.cooldown = cooldown;
handler.disabled = false;

export default handler;

function reward(user = {}, count, minimal_coinly) {
    let rewards = {
        reward: {
            exp: 3000,
            coinly: 30,
            gold: 50000 * count / 100000000,
            diamond: 4800 * count / 100000000,
            emerald: 140 * count / 100000000,
        },
        lost: {
            health: 101 - user.cat * 8,
            armordurability: (15 - user.armor) * 14,
            coinly: minimal_coinly,
            money: count,
        }
    };
    return rewards;
}

function number(x = 0) {
    x = parseInt(x);
    return !isNaN(x) && typeof x == 'number';
}

function isNumber(x) {
    return !isNaN(x);
}

function toSimple(number) {
    if (isNaN(parseFloat(number))) return number;
    if (parseFloat(number) === 0) return '0';
    number = parseFloat(number).toFixed(0);
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'N', 'Dc', 'Ud', 'Dd', 'Td', 'Qua', 'Qui', 'Sxd', 'Spd', 'Ocd', 'NoD', 'Vg'];
    const base = 1000;
    const exponent = Math.floor(Math.log10(Math.abs(number)) / 3);
    const suffix = suffixes[exponent] || '';
    const simplified = number / Math.pow(base, exponent);
    const formatter = Intl.NumberFormat('en', { maximumFractionDigits: 1 });
    return formatter.format(simplified) + suffix;
}