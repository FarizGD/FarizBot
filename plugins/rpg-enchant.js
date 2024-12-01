import db from '../lib/database/index.js';

const cooldown = 10800000;

let handler = async (m, { usedPrefix }) => {
    let user = await db.users.get(m.sender);

    if (new Date() - user.lastenchant < cooldown) {
        throw `Kamu sudah melakukan enchant sebelumnya! Tunggu selama *${((user.lastenchant + cooldown) - new Date()).toTimeString()}*`;
    }

    if (user.money < 100000000000000) {
        return m.reply('Kamu tidak memiliki cukup uang untuk melakukan enchantment.');
    }
    if (user.emerald < 100000000000 || user.diamond < 1000000000000 || user.gold < 10000000000000 || user.iron < 100000000000000 || user.coinly < 10) {
        return m.reply('Kamu belum memenuhi syarat enchantment 🐚\n> 100B 🟩 Emerald\n> 1T 💎 Diamond\n> 10T 🟨 Gold\n> 100T ⛓️ Iron\n> 10 🧭 Coinly');
    }

    await db.users.update(m.sender, (userData) => {
        userData.money = 0;
        userData.emerald = 0;
        userData.diamond = 0;
        userData.gold = 0;
        userData.iron = 0;
        userData.gmoney += 1;
        userData.lastenchant = new Date() * 1;
    });

    m.reply(`📑 Enchant Berhasil 📑\n+1 ✤ gmoney`);
};

handler.help = ['enchant'];
handler.tags = ['rpg'];
handler.command = /^(enchant)$/i;

handler.cooldown = cooldown;

export default handler;