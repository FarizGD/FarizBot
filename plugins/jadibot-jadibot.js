import fs from 'fs';
import path from 'path';
import { toBuffer } from 'qrcode';
import ws from 'ws';
import Connection from '../lib/connection.js';
import Store from '../lib/store.js';
import db from '../lib/database/index.js';

const {
    DisconnectReason,
    areJidsSameUser,
    useMultiFileAuthState
} = await import('@whiskeysockets/baileys');

let handler = async (m, { isPrems, conn: _conn, __dirname }) => {
    let user = await db.users.get(m.sender)

    const activeConnections = [...Connection.connections.entries()].filter(([_, { conn }]) => conn.user.jid && !conn.ws.isClosed);
    const users = [...new Set(activeConnections.map(([_, { conn }]) => conn.user))];
    //if (users.length >= 30 || user.verified == false)
    if (users.length >= 30) {
        m.reply(`
🤖 Jadibot sudah penuh 🤖
⚠️ Silahkan jadibot di: http://wa.me/6285182956981?text=.jadibot

🌷 Ketik /listjadibot untuk mengecek bot cabang! 🌷
`.trim());
        return;
    }

    //    const parent = await Connection.conn
    //    if (!areJidsSameUser(parent.user.id, _conn.user.id))
    //        throw 'Tidak bisa membuat bot didalam bot!\n\nhttps://wa.me/' + parent.user.jid.split`@`[0] + '?text=.jadibot'

    // Prevent from duplicate ids
    let id = Connection.connections.size;
    while (Connection.connections.has(id))
        id++;

    const logger = Connection.logger.child({ jadibot: id });
    let store = Store.makeInMemoryStore();
    const folder = path.join(__dirname, '../sessions-jadibot', m.chat.split('@')[0].toString());
    let authState = await useMultiFileAuthState(folder);
    const opts = { store, logger, isChild: true, authState };

    let conn = await Connection.start(null, opts),
        lastQr;

    // if it's been 5 minutes but there is nobody connect, just close it
    const timeout = setTimeout(() => {
        if (conn?.user?.jid) return;
        logout('timeout');
    }, 1 * 60 * 1000);

    const logout = async (reason) => {
        if (reason === 'timeout' && !conn?.user?.jid) {
            (lastQr || m).reply('Timeout! Qr will not be able to scan');
        }
        if (conn?.user?.jid) {
            await _conn.reply(conn.user.jid || m.chat, 'Koneksi terputus...');
        }
        conn.end();
        Connection.connections.delete(id);
        // Maybe release some of memory?
        conn = store = authState = null;
        clearTimeout(timeout);
        // Remove session folder
        await fs.promises.rm(folder, { force: true, recursive: true });
    };

    const sendSuccessLoginMessage = async () => {
        let waiting = 0;
        // Wait until user exists in conn object
        const wait = () =>
            new Promise((resolve) =>
                conn.user?.id ? resolve() : (waiting++, setTimeout(() => resolve(wait()), 500))
            );
        await wait();

        // Check for existing connection
        const existing = activeConnections.find(([_, { conn: { user } }]) =>
            areJidsSameUser(user.id, conn.user.id)
        );

        if (existing) {
            await _conn.reply(conn.user.jid || m.chat, `Duplicate connection, close the oldest connection!`);
            existing[1].conn.end();
            Connection.connections.delete(existing[0]);
        }

        if (!existing) {
            await _conn.reply(
                conn.user.jid || m.chat,
                `
Berhasil tersambung dengan WhatsApp-mu.
*NOTE: Ini cuma numpang*
Welcome into FarizBot rabbit hole!
\`\`\`
${JSON.stringify(conn.user, null, 2)}
\`\`\`
`.trim()
            );
        }
        clearTimeout(timeout);
    };

    /** @param {import('@whiskeysockets/baileys').BaileysEventMap<unknown>['connection.update']} update */
    async function connectionUpdate(update) {
        console.log(update, update.lastDisconnect?.error?.output);
        if (update.isNewLogin) {
            sendSuccessLoginMessage();
        }
        // @ts-ignore
        const code = update.lastDisconnect?.error?.output?.statusCode || update.lastDisconnect?.error?.output?.payload?.statusCode;
        if (code && code != DisconnectReason.loggedOut) {
            //console.log(update)
            await Connection.reload(conn, true, opts);
            conn.ev.on('connection.update', connectionUpdate);
        } else if (code && code == DisconnectReason.loggedOut) {
            await logout();
        } else if (!update.qr || !('receivedPendingNotifications' in update)) {
            //console.log(new Error('Unhandled connectionUpdate'), update)
        }
        if (update.qr) {
            if (lastQr) {
                lastQr.delete();
            }
            lastQr = await _conn.sendFile(
                m.chat,
                await toBuffer(update.qr, { scale: 4 }),
                'qrcode.png',
                `
Note: Pake WhatsApp Business!
QR hanya berlaku selama 1 menit!

Yakin pengen mau jadibot? Bot ini cuma aktif kadang-kadang loh!
Scan QR ini untuk jadi bot sementara
1. Klik titik tiga di pojok kanan atas
2. Ketuk perangkat tertaut
3. Scan QR ini 
QR akan Expired !
`.trim(),
                m
            );
        }
    }

    conn.ev.on('connection.update', connectionUpdate);

    Connection.connections.set(id, { conn, store });
    sendSuccessLoginMessage();
};

handler.help = ['jadibot'];
handler.tags = ['jadibot'];

handler.command = /^jadibot$/i;

handler.limit = true;
handler.private = true;
handler.rowner = true;

export default handler;
