import db from '../lib/database/index.js';
import Connection from '../lib/connection.js';
import { areJidsSameUser } from '@whiskeysockets/baileys';

const cooldown = 3000;

const rewards = {
  common: {
    rock: 8,
    string: 23,
    trash: 38,
    potion: 2,
    rare: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  rare: {
    iron: 4,
    rock: 75,
    trash: 118,
    potion: 4,
    wood: 130,
    mythic: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  mythic: {
    iron: 3,
    gold: 1,
    diamond: 4,
    potion: 15,
    wood: 350,
    string: 500,
    trash: 60,
    legendary: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  legendary: {
    emerald: 2,
    potion: 300,
    diamond: 18,
    gold: 175,
    safana: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  safana: {
    orb: 2,
    emerald: 3,
    diamond: 85,
    sphere: 4,
    luxury: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  luxury: {
    elixir: [0, 1],
    sphere: 45,
    diamond: 3100,
    orb: 8,
    car: Array(999).fill(0).concat(1)
  },
  bruh: {
    keping: 1640,
    elixir: 923,
    emerald: 12000,
    orb: 5213
  },
  lona: {
    car: 30000,
    gitar: [0, 1, 0],
    pianika: [0, 1, 0],
    terompet: [0, 1, 0],
    loana: Array(999).fill(0).concat(1)
  },
  loana: {
    piano: 3,
    triangle: 3,
    flagy: 3,
    auricore: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0]
  }
};

let handler = async (m, { isPrems, text, command, args, usedPrefix, conn: _conn, __dirname, conn }) => {
  const user = await db.users.get(m.sender);

  if (user.safezone === true) {
    return m.reply(`Kamu tidak bisa gacha dari 🌥️ Safe Zone 🌥️`);
  }
  if (new Date() - user.lastopen < cooldown) {
    throw `Kamu baru saja buka crate 📤! Tunggu selama *${((user.lastopen + cooldown) - new Date()).toTimeString()}*`;
  }

  let listCrate = Object.fromEntries(Object.entries(rewards).filter(([v]) => v && v in user));
  let info = `
Use Format *${usedPrefix}${command} [crate] [count]*
Usage example: *${usedPrefix}${command} common 10*

📍Crate list: 
${Object.keys(listCrate).map((v) => `
${rpg.emoticon(v)}${v}
`.trim()).join('\n')}
`.trim();
  let type = (args[0] || '').toLowerCase();
  let count = Math.floor(isNumber(args[1]) ? Math.min(Math.max(parseInt(args[1]), 1), Number.MAX_SAFE_INTEGER) : 1) * 1;
  if (!(type in listCrate)) {
    return m.reply(info);
  }
  if (user[type] < count) {
    return m.reply(`
Your *${rpg.emoticon(type)}${type} crate* is not enough! You only have ${user[type]} *${rpg.emoticon(type)}${type} crate*.
Type *${usedPrefix}buy ${type} ${count - user[type]}* to buy.
`.trim());
  }
  if (user.maxcrate < count && isPrems === false) {
    return m.reply(`
*${rpg.emoticon(type)}${type} crate* yang kamu buka kebanyakan! 🍰
Maximal buka ${user.maxcrate} *${rpg.emoticon(type)}${type} crate* yaaa 😁
Ketik ${usedPrefix}cbuy maxcrate untuk meningkatkan max open 🔼
`.trim());
  } else if (user.maxcrate * 10 < count && isPrems === true) {
    return m.reply(`
*${rpg.emoticon(type)}${type} crate* yang kamu buka kebanyakan! 🍰
Maximal buka ${user.maxcrate * 10} *${rpg.emoticon(type)}${type} crate* yaaa 😁
Ketik ${usedPrefix}cbuy maxcrate untuk meningkatkan max open 🔼
`.trim());
  }
  if (user.coinly < 10) {
    return m.reply(`
Untuk open crate, dibutuhkan sedikitnya 10 🧭 Coinly!
Anda bisa mendapatkan Coinly 🧭 dengan mengetik *${usedPrefix}coinly*
`.trim());
  }

  let crateReward = {};
  for (let i = 0; i < count; i++) {
    for (let [reward, value] of Object.entries(listCrate[type])) {
      if (reward in user) {
        const total = value.getRandom();
        if (total) {
          await db.users.update(m.sender, (user) => {
            user[reward] += total * 1;
          });
          crateReward[reward] = (crateReward[reward] || 0) + (total * 1);
        }
      }
    }
  }

  await db.users.update(m.sender, (user) => {
    user[type] -= count * 1;
  });

  if (user.silent === false) {
    m.reply(`
You have opened *${count}* ${global.rpg.emoticon(type)}${type} crate and got:
${Object.keys(crateReward).filter(v => v && crateReward[v] && !/legendary|pet|mythic|diamond|emerald/i.test(v)).map(reward => `
*${global.rpg.emoticon(reward)}${reward}:* ${crateReward[reward]}
`.trim()).join('\n')}
`.trim());
  }

  let diamond = crateReward.diamond, mythic = crateReward.mythic, pet = crateReward.pet, legendary = crateReward.legendary, emerald = crateReward.emerald;
  if (user.silent === false) {
    if (mythic || diamond) {
      m.reply(`
Congrats you got a rare item, which is ${diamond ? `*${diamond}* ${rpg.emoticon('diamond')}diamond` : ''}${diamond && mythic ? ' and ' : ''}${mythic ? `*${mythic}* ${rpg.emoticon('mythic')}mythic` : ''}
`.trim());
    }
    if (pet || legendary || emerald) {
      m.reply(`
Congrats you got an epic item, which is ${pet ? `*${pet}* ${rpg.emoticon('pet')}pet` : ''}${pet && legendary && emerald ? ', ' : (pet && legendary || legendary && emerald || emerald && pet) ? ' and ' : ''}${legendary ? `*${legendary}* ${rpg.emoticon('legendary')}legendary` : ''}${pet && legendary && emerald ? ' and ' : ''}${emerald ? `*${emerald}* ${rpg.emoticon('emerald')}emerald` : ''}
`.trim());
    }
  }

  await db.users.update(m.sender, (user) => {
    user.lastopen = new Date() * 1;
  });
};

handler.help = ['open', 'gacha'].map(v => v + ' [crate] [count]');
handler.tags = ['rpg'];
handler.command = /^(open|buka|gacha)$/i;
handler.cooldown = cooldown;

export default handler;

function isNumber(number) {
  if (!number) return number;
  number = parseInt(number);
  return typeof number === 'number' && !isNaN(number);
}
