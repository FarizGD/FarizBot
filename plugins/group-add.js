import fetch from 'node-fetch';
import db from '../lib/database/index.js';

/**
 * @type {import('@whiskeysockets/baileys')}
 */
const { getBinaryNodeChild, getBinaryNodeChildren } = (await import('@whiskeysockets/baileys')).default;

let handler = async (m, { conn, text, participants }) => {
    if (!text) throw 'Siapa yang mau di add?';

    let _participants = participants.map(user => user.id);
    let users = (await Promise.all(
        text.split(',')
            .map(v => v.replace(/[^0-9]/g, ''))
            .filter(v => v.length > 4 && v.length < 20 && !_participants.includes(v + '@s.whatsapp.net'))
            .map(async v => {
                const user = await db.users.get(v);
                return {
                    jid: v + '@c.us',
                    user: user
                };
            })
    )).filter(v => v.user);

    const response = await conn.query({
        tag: 'iq',
        attrs: {
            type: 'set',
            xmlns: 'w:g2',
            to: m.chat,
        },
        content: users.map(user => ({
            tag: 'add',
            attrs: {},
            content: [{ tag: 'participant', attrs: { jid: user.jid } }]
        }))
    });

    const pp = await conn.profilePictureUrl(m.chat).catch(_ => null);
    const jpegThumbnail = pp ? await (await fetch(pp)).buffer() : Buffer.alloc(0);
    const add = getBinaryNodeChild(response, 'add');
    const participant = getBinaryNodeChildren(add, 'participant');

    for (const user of participant.filter(item => item.attrs.error == 403)) {
        const jid = user.attrs.jid;
        const content = getBinaryNodeChild(user, 'add_request');
        const invite_code = content.attrs.code;
        const invite_code_exp = content.attrs.expiration;

        let teks = `Mengundang @${jid.split('@')[0]} menggunakan invite...`;
        m.reply(teks, null, {
            mentions: conn.parseMention(teks)
        });

        await conn.sendGroupV4Invite(m.chat, jid, invite_code, invite_code_exp, await conn.getName(m.chat), 'Invitation to join my WhatsApp group', jpegThumbnail);
    }
};

handler.help = ['add', '+'].map(v => 'o' + v + ' @user');
handler.tags = ['group'];
handler.command = /^(add)$/i;

handler.admin = true;
handler.group = true;
handler.botAdmin = true;
handler.disabled = true;

export default handler;