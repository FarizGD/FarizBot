import db from '../lib/database/index.js'
import { areJidsSameUser } from '@whiskeysockets/baileys'

let handler = async (m, { conn, args, participants, usedPrefix, command }) => {
    const jids = await db.users.keys();
    const users = await Promise.all(jids.map(async (jid) => {
        const user = await db.users.get(jid);
        if (user.nama === "-") {
            await db.users.delete(jid.replace(/\.json$/, ''));
            return null; // Mengembalikan null untuk menandakan pengguna yang dihapus
        } else {
            return { ...user, jid: jid.replace(/\.json$/, '') };
        }
    }));

    const filteredUsers = users.filter(user => user !== null);

}

handler.help = ['clearall']
handler.tags = ['owner']
handler.command = /^(clearall)$/i
handler.rowner = true

export default handler