import Connection from '../lib/connection.js'
import db from '../lib/database/index.js'
import { cpus as _cpus, totalmem, freemem } from 'os'
import { performance } from 'perf_hooks'
import { sizeFormatter } from 'human-readable'
import { getUserCache, getUserCacheAll } from './_cache.js';

let format = sizeFormatter({
  std: 'JEDEC', // 'SI' (default) | 'IEC' | 'JEDEC'
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
})

let handler = async (m, { conn }) => {
  const chats = Object.entries(Connection.store.chats).filter(([id, data]) => id && data.isChats)
  const groupsIn = chats.filter(([id]) => id.endsWith('@g.us'))

  const used = process.memoryUsage()
  const cpus = _cpus().map(cpu => {
    cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
    return cpu
  })

  const more = String.fromCharCode(8206)
  const readMore = more.repeat(4001)

  const cpu = cpus.reduce((last, cpu, _, { length }) => {
    last.total += cpu.total
    last.speed += cpu.speed / length
    last.times.user += cpu.times.user
    last.times.nice += cpu.times.nice
    last.times.sys += cpu.times.sys
    last.times.idle += cpu.times.idle
    last.times.irq += cpu.times.irq
    return last
  }, {
    speed: 0,
    total: 0,
    times: {
      user: 0,
      nice: 0,
      sys: 0,
      idle: 0,
      irq: 0
    }
  })

  const message = m.reply('_Loading ⭕_')
  let old = performance.now()
  await message
  let neww = performance.now()
  let speed = neww - old

  const user = await db.users.get(m.sender)
  let users = getUserCache();
  let usersAll = getUserCacheAll();

  const maleUsers = users.filter(user => user.gender === 'male ♂️')
  const femaleUsers = users.filter(user => user.gender === 'female ♀️')

  m.reply(`
Merespon dalam ${speed} millidetik 🚀

*=============================*

💬 Status :
- *${groupsIn.length}* Group Chats 📡
- *${groupsIn.length}* Groups Joined 👋🏻
- *${groupsIn.length - groupsIn.length}* Groups Left 🗨️
- *${chats.length - groupsIn.length}* Personal Chats 🔏
- *${chats.length}* Online User 💬
- *${users.length}* Active User 🖱️
- *${usersAll.length}* Total User 👥

♂️ Male User: ${maleUsers.length} 🍦
♀️ Female User: ${femaleUsers.length} 🚿

*=============================*
${readMore}
💻 *Server Info* :
RAM: ${format(totalmem() - freemem())} / ${format(totalmem())}

*=============================*

🍳 _NodeJS Memory Usage_
${'```' + Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v => v.length)), ' ')}: ${format(used[key])}`).join('\n') + '```'}

*=============================*

${cpus[0] ? `🔮 _Total CPU Usage_
${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}

*=============================*

🖥️ _CPU Core(s) Usage (${cpus.length} Core CPU)_
${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : ''}
`.trim())
}

handler.help = ['ping', 'speed']
handler.tags = ['info', 'tools']
handler.command = /^(ping|speed|info)$/i
handler.rowner = false

export default handler