import db from '../lib/database/index.js'

const BANNED_TIME = 60 * 60 * 1000

export async function all(m, { isROwner }) {
    const user = await db.users.get(m.sender)

    if (!m.message || isROwner || user?.banned) {
        return
    }

    this.spam = this.spam ? this.spam : {}

    if (m.sender in this.spam) {
        this.spam[m.sender].count++

        if (m.messageTimestamp.toNumber() - this.spam[m.sender].lastspam > 6) {
            if (this.spam[m.sender].count > 6) {
                await Promise.all([
                    db.users.update(m.sender, (user) => {
                        user.chat = Math.floor(user.chat / 2);
						user.chatneri = Math.floor(user.chatneri / 2);
                        user.banned = true
                        user.bannedExpired = Date.now() + BANNED_TIME
                    }),
                    m.reply(`Kamu *terbanned* sementara karena spam! Selama ${BANNED_TIME.toTimeString()}`)
                ])
                // m.reply('*Jangan Spam!!*')
            }

            this.spam[m.sender].count = 0
            this.spam[m.sender].lastspam = m.messageTimestamp.toNumber()
        }
    } else {
        this.spam[m.sender] = {
            jid: m.sender,
            count: 0,
            lastspam: 0
        }
    }
}
