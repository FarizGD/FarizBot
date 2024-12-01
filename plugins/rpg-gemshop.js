import db from '../lib/database/index.js'

const items = {
  buygems: {
    pet: {
      gems: 750,
    },
    lock: {
      gems: 2000,
    },
    lockpick: {
      gems: 2500,
    },
    worldlock: {
      gems: 2000,
    },
    diamondlock: {
      worldlock: 100,
    },
    diamondpickaxe: {
      worldlock: 400,
    },
  },
  sellgems: {
    maxcrate: {
      gems: 100,
    },
    worldlock: {
      pickaxe: 5,
    },
    diamondlock: {
      worldlock: 100,
    },
  },
};

let handler = async (m, { conn, command, usedPrefix, args, text, isPrems }) => {
  let user = await db.users.get(m.sender);
  if (command.toLowerCase() == 'gemshop') {
    let text = `
=== 💎 Gems Shop ===

Ingin menggunakan *toko*?
Ketik _/buygems_ bila ingin membeli!
Ketik _/sellgems_ bila ingin menjual!
`.trim();
    conn.reply(m.chat, text, m);
    return;
  }
  const listItems = Object.fromEntries(
    Object.entries(items[command.toLowerCase()]).filter(([v]) => v && v in user)
  );
  const info = `
Use Format *${usedPrefix}${command} [crate] [count]*
Usage example: *${usedPrefix}${command} gems 10*
    
📍Items list: 
${Object.keys(listItems)
  .map((v) => {
    let paymentMethod = Object.keys(listItems[v]).find((v) => v in user);
    return `${global.rpg.emoticon(v)}${v} | ${toSimple(listItems[v][paymentMethod])} ${global.rpg.emoticon(paymentMethod)}${paymentMethod}`.trim();
  })
  .join('\n')}
`.trim();
  const item = (args[0] || '').toLowerCase();

  if (!listItems[item]) return m.reply(info);

  if (!args[1]) {
    m.reply(info);
    return;
  }

  let total = Math.floor(
    isNumber(args[1])
      ? Math.min(Math.max(parseInt(args[1]), 1))
      : 1
  ) * ({"K":1e3,"M":1e6,"B":1e9,"T":1e12,"QA":1e15,"QI":1e18,"SX":1e21,"SP":1e24,"OC":1e27,"N":1e30,"DC":1e33,"UD":1e36,"DD":1e39,"TD":1e42,"QUA":1e45,"QUI":1e48}[args[1].toUpperCase().replace(/[^KMBTQAISXONDCUP]/g,'')] || 1);

  if (command.toLowerCase() == 'buygems') {
    let paymentMethod = Object.keys(listItems[item]).find((v) => v in user);
    if (user[paymentMethod] < listItems[item][paymentMethod] * total)
      return m.reply(
        `You don't have enough ${global.rpg.emoticon(paymentMethod)}${paymentMethod} to buygems *${toSimple(total)}* ${global.rpg.emoticon(item)}${item}. You need *${toSimple(
          listItems[item][paymentMethod] * total - user[paymentMethod]
        )}* more ${paymentMethod} to be able to buygems`
      );
    await db.users.update(m.sender, (user) => {
      user[paymentMethod] -= listItems[item][paymentMethod] * total;
      user[item] += total;
    });
    return m.reply(`You bought *${toSimple(total)}* ${global.rpg.emoticon(item)}${item}`);
  } else if (command.toLowerCase() == 'sellgems') {
    if (isPrems && /all/i.test(args[1]))
      total = Math.max(Math.floor(parseInt(user[item])), 1);
    if (user[item] < total)
      return m.reply(
        `You don't have enough *${global.rpg.emoticon(item)}${item}* to sellgems, you only have ${user[item]} items`
      );
    const reward = listItems[item];
    if (Object.keys(reward).length > 1)
      throw new Error('Multiple reward not supported yet!');
    const rewardKey = Object.keys(reward)[0];
    if (!(rewardKey in user))
      throw new Error(
        `The user doesn't have ${rewardKey} in their database, but the reward gives it!`
      );
    await db.users.update(m.sender, (user) => {
      user[item] -= total;
      user[rewardKey] += listItems[item][rewardKey] * total;
    });
    return m.reply(
      `You sold *${toSimple(total)}* ${global.rpg.emoticon(item)}${item} and got *${toSimple(
        listItems[item][rewardKey] * total
      )}* ${global.rpg.emoticon(rewardKey)}`
    );
  }
};

handler.help = ['buygems', 'sellgems'].map((v) => v + ' [item] [count]');
handler.tags = ['rpg', 'network'];
handler.command = /^(gemshop|buygems|sellgems)$/i;

handler.disabled = false;

export default handler;

function isNumber(number) {
  if (!number) return number;
  number = parseInt(number);
  return typeof number == 'number' && !isNaN(number);
}

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

function number(x = 0) {
  x = parseInt(x);
  return !isNaN(x) && typeof x == 'number';
}