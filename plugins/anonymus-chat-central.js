export async function before(m, { match }) {
    // if (match) return !1
    if (!m.chat.endsWith('@s.whatsapp.net'))
        return !0
    global.anonymous = global.anonymous ? global.anonymous : {}
    let room = Object.values(global.anonymous).find(room => [room.a, room.b].includes(m.sender) && room.state === 'CHATTING')
    if (room) {
        if (/^.*(next|leave|start)/.test(m.text))
            return
        let other = [room.a, room.b].find(user => user !== m.sender)
        await m.copyNForward(other, true)
    }
    return !0
}