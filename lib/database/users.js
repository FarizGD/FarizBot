import fs from 'fs/promises';
import { z } from 'zod';
import { Database, data } from './database.js';
import { logger } from '../connection.js';
import DBKeyedMutex, { ActionType } from './mutex.js';
import { jidNormalizedUser } from '@whiskeysockets/baileys';
import sanitizeFile from 'sanitize-filename';
import NodeCache from 'node-cache';

const usersMutex = new DBKeyedMutex(logger.child({ mutex: 'db-users' }))
const usersCache = new NodeCache({
    stdTTL: 2 * 60,
    checkperiod: 3 * 60,
    useClones: false
})

/**
 * @typedef {z.infer<typeof UserData._schema>} UserSchema
 */

/**
 * @class
 * @extends {data<UserSchema>}
 */
export class UserData extends data {

    static _schema = z.object({
		level: z.number().min(0).default(0),
        role: z.string().default('-'),
        limit: z.number().min(0).default(10),

        exp: z.number().min(0).default(0),

        lastcommand: z.number().min(0).default(0),
        lastenchant: z.number().min(0).default(0),
        lastsmith: z.number().min(0).default(0),
        lastclaim: z.number().min(0).default(0),
        lastopen: z.number().min(0).default(0),
        lastluck: z.number().min(0).default(0),
        lastmining: z.number().min(0).default(0),
        lastnetworking: z.number().min(0).default(0),
        lastcoinly: z.number().min(0).default(0),
        lastclickly: z.number().min(0).default(0),
        lastvcoin: z.number().min(0).default(0),
        lastscoin: z.number().min(0).default(0),
        lasttoken: z.number().min(0).default(0),
        lastpunch: z.number().min(0).default(0),
        lasttrain: z.number().min(0).default(0),
        lastpsychic: z.number().min(0).default(0),
        lastrun: z.number().min(0).default(0),
        laststeal: z.number().min(0).default(0),
        lastsafezone: z.number().min(0).default(0),
        lastgo: z.number().min(0).default(0),
        lasttrading: z.number().min(0).default(0),
        lasttransfer: z.number().min(0).default(0),
        lasteat: z.number().min(0).default(+new Date() + 7 * 24 * 60 * 60 * 1000),
        registered: z.boolean().default(false),

        chat: z.number().min(0).default(0),
        chatneri: z.number().min(0).default(0),
        autoneriplus: z.array(z.string()).default([]),
        afk: z.number().default(-1),
        afkReason: z.string().default(''),
        banned: z.boolean().default(false),
        silent: z.boolean().default(false),
        safezone: z.boolean().default(false),
        verified: z.boolean().default(false),
        botcabang: z.boolean().default(false),
        bannedExpired: z.number().default(-1),
        warn: z.number().min(0).default(0),

        gamepass: z.number().min(0).default(0),
        gender: z.string().default('non-binary 🎭'),
        nama: z.string().default('-'),
        umur: z.string().default('-'),
        agama: z.string().default('-'),
        crush: z.string().default('-'),
        partner: z.string().default('-'),
        aranara: z.number().min(0).default(0),
        botmode: z.boolean().default(false),
        luck: z.number().min(0).default(0),
        story: z.number().min(0).default(0),
        quest: z.number().min(0).default(0),
        quest_previous: z.number().min(0).default(0),
        questselesai: z.boolean().default(false),
        settransfer: z.boolean().default(true),
        statustransfer: z.boolean().default(false),
        steal: z.number().min(0).default(0),
        money: z.number().min(0).default(0),
        gmoney: z.number().min(0).default(0),
        rupiah: z.number().min(0).default(0),
        credit: z.number().min(0).default(0),
        token: z.number().min(0).default(0),
        getaran: z.number().min(0).default(0),
        goncangan: z.number().min(0).default(0),
        gundakan: z.number().min(0).default(0),
        strength: z.number().min(0).default(1),
        strength_multiplier: z.number().min(0).default(1),
        strength_multiplier_extra: z.number().min(0).default(1),
        psychic: z.number().min(0).default(1),
        psychic_multiplier: z.number().min(0).default(1),
        psychic_multiplier_extra: z.number().min(0).default(1),
        defense: z.number().min(0).default(1),
        defense_multiplier: z.number().min(0).default(1),
        defense_multiplier_extra: z.number().min(0).default(1),
        speed: z.number().min(0).default(1),
        speed_multiplier: z.number().min(0).default(1),
        speed_multiplier_extra: z.number().min(0).default(1),
        protection: z.number().min(0).default(1),
        location: z.string().default("homebase"),
        death: z.number().min(0).default(0),
        prestige: z.number().min(0).default(0),
        followers: z.number().min(0).default(0),
        following: z.array(z.string()).default([]),
        reply: z.string().default(""),
        quest_point: z.number().min(0).default(0),
        maxcrate: z.number().min(0).default(1),
        coinly: z.number().min(0).default(0),
        auricore: z.number().min(0).default(0),
        vcoin: z.number().min(0).default(0),
        scoin: z.number().min(0).default(0),
        clickly: z.number().min(0).default(0),
        palu: z.number().min(0).default(0),
        pedang: z.number().min(0).default(0),
        aura: z.number().min(0).default(0),
        balancer: z.number().min(0).default(0),
        lockpick: z.number().min(0).default(0),
        lock: z.number().min(0).default(0),
        crowbar: z.number().min(0).default(0),
        cashly: z.number().min(0).default(0),
        cardly: z.number().min(0).default(0),
        gems: z.number().min(0).default(0),
        worldlock: z.number().min(0).default(0),
        diamondlock: z.number().min(0).default(0),
        diamondpickaxe: z.number().min(0).default(0),
        chest: z.number().min(0).default(0),
        social: z.number().default(0),
        health: z.number().default(100),
        car: z.number().min(0).default(0),
        fuel: z.number().min(0).default(0),
        gitar: z.number().min(0).default(0),
        pianika: z.number().min(0).default(0),
        terompet: z.number().min(0).default(0),
        piano: z.number().min(0).default(0),
        triangle: z.number().min(0).default(0),
        flagy: z.number().min(0).default(0),
        phone: z.number().min(0).default(0),
        smartphone: z.number().min(0).default(0),
        potion: z.number().min(0).default(0),
        elixir: z.number().min(0).default(0),
        sphere: z.number().min(0).default(0),
        trash: z.number().min(0).default(0),
        wood: z.number().min(0).default(0),
        rock: z.number().min(0).default(0),
        string: z.number().min(0).default(0),
        burger: z.number().min(0).default(0),
        pizza: z.number().min(0).default(0),
        kentang: z.number().min(0).default(0),
        petFood: z.number().min(0).default(0),

        emerald: z.number().min(0).default(0),
        diamond: z.number().min(0).default(0),
        orb: z.number().min(0).default(0),
        keping: z.number().min(0).default(0),
        crypto: z.number().min(0).default(0),
        gold: z.number().min(0).default(0),
        iron: z.number().min(0).default(0),
        ducky: z.number().min(0).default(0),

        ironore: z.number().min(0).nullish().default(0),
        goldore: z.number().min(0).nullish().default(0),
        diamondore: z.number().min(0).nullish().default(0),
        ancientdebris: z.number().min(0).nullish().default(0),

        common: z.number().min(0).default(0),
        rare: z.number().min(0).default(0),
        mythic: z.number().min(0).default(0),
        legendary: z.number().min(0).default(0),
        safana: z.number().min(0).default(0),
        luxury: z.number().min(0).default(0),
        bruh: z.number().min(0).default(0),
        lona: z.number().min(0).default(0),
        loana: z.number().min(0).default(0),
        rivena: z.number().min(0).default(0),
        aurora: z.number().min(0).default(0),
        safari: z.number().min(0).default(0),
        pet: z.number().min(0).default(0),

        ant: z.number().min(0).default(0),
        antexp: z.number().min(0).default(0),
        horse: z.number().min(0).default(0),
        horseexp: z.number().min(0).default(0),
        cat: z.number().min(0).default(0),
        catexp: z.number().min(0).default(0),
        fox: z.number().min(0).default(0),
        foxexp: z.number().min(0).default(0),
        dog: z.number().min(0).default(0),
        dogexp: z.number().min(0).default(0),
        dragon: z.number().min(0).default(0),
        dragonexp: z.number().min(0).default(0),
        panda: z.number().min(0).default(0),
        pandaexp: z.number().min(0).default(0),

        antlastfeed: z.number().min(0).default(0),
        horselastfeed: z.number().min(0).default(0),
        catlastfeed: z.number().min(0).default(0),
        foxlastfeed: z.number().min(0).default(0),
        doglastfeed: z.number().min(0).default(0),
        dragonlastfeed: z.number().min(0).default(0),
        pandalastfeed: z.number().min(0).default(0),

        armor: z.number().min(0).default(0),
        armordurability: z.number().min(0).default(0),
        sword: z.number().min(0).default(0),
        sworddurability: z.number().min(0).default(0),
        pickaxe: z.number().min(0).default(0),
        pickaxedurability: z.number().min(0).default(0),
        fishingrod: z.number().min(0).default(0),
        fishingroddurability: z.number().min(0).default(0),

        lastsmith: z.number().min(0).default(0),
        lastclaim: z.number().min(0).default(0),
        lastopen: z.number().min(0).default(0),
        lastluck: z.number().min(0).default(0),
        lastmining: z.number().min(0).default(0),
        lastnetworking: z.number().min(0).default(0),
        lastcoinly: z.number().min(0).default(0),
        lastclickly: z.number().min(0).default(0),
        lastvcoin: z.number().min(0).default(0),
        lastscoin: z.number().min(0).default(0),
        lasttoken: z.number().min(0).default(0),
        lastpunch: z.number().min(0).default(0),
        lasttrain: z.number().min(0).default(0),
        lastpsychic: z.number().min(0).default(0),
        lastrun: z.number().min(0).default(0),
        lastsafezone: z.number().min(0).default(0),
        lastgo: z.number().min(0).default(0),
        lasttrading: z.number().min(0).default(0),
        lasteat: z.number().min(0).default(+new Date() + 7 * 24 * 60 * 60 * 1000),
        lastadventure: z.number().min(0).default(0),
        lastfishing: z.number().min(0).default(0),
        lastdungeon: z.number().min(0).default(0),
        lastduel: z.number().min(0).default(0),
        lastmining: z.number().min(0).default(0),
        lasthunt: z.number().min(0).default(0),
        lastweekly: z.number().min(0).default(0),
        lastmonthly: z.number().min(0).default(0),
    })



    level = 0
    role = '-'
    limit = 10

    exp = 0

    lastcommand = 0
    lastenchant = 0
    lastsmith = 0
    lastclaim = 0
    lastopen = 0
    lastluck = 0
    lastmining = 0
    lastnetworking = 0
    lastcoinly = 0
    lastclickly = 0
    lastvcoin = 0
    lastscoin = 0
    lasttoken = 0
    lastpunch = 0
    lasttrain = 0
    lastpsychic = 0
    lastrun = 0
    laststeal = 0
    lastsafezone = 0
    lastgo = 0
    lasttrading = 0
    lasttransfer = 0
    lasteat = +new Date() + 7 * 24 * 60 * 60 * 1000
    registered = false

    chat = 0
    chatneri = 0
    autoneriplus = []
    afk = -1
    afkReason = ''
    banned = false
    silent = false
    safezone = false
    verified = false
    botcabang = false
    bannedExpired = -1
    warn = 0

    gamepass = 0
    gender = 'non-binary 🎭'
    nama = '-'
    umur = '-'
    agama = '-'
    crush = '-'
    partner = '-'
    aranara = 0
    botmode = false
    luck = 0
    story = 0
    quest = 0
    quest_previous = 0
    questselesai = false
    settransfer = true
    statustransfer = false
    steal = 0
    money = 0
    gmoney = 0
    rupiah = 0
    credit = 0
    token = 0
    getaran = 0
    goncangan = 0
    gundakan = 0
    strength = 1
    strength_multiplier = 1
    strength_multiplier_extra = 1
    psychic = 1
    psychic_multiplier = 1
    psychic_multiplier_extra = 1
    defense = 1
    defense_multiplier = 1
    defense_multiplier_extra = 1
    speed = 1
    speed_multiplier = 1
    speed_multiplier_extra = 1
    protection = 1
    location = 'homebase'
    death = 0
    prestige = 0
    followers = 0
    following = []
    reply = ""
    quest_point = 0
    maxcrate = 1
    coinly = 0
    auricore = 0
    vcoin = 0
    scoin = 0
    clickly = 0
    palu = 0
    pedang = 0
    aura = 0
    balancer = 0
    lockpick = 0
    lock = 0
    crowbar = 0
    cashly = 0
    cardly = 0
    gems = 0
    worldlock = 0
    diamondlock = 0
    diamondpickaxe = 0
    chest = 0
    social = 0
    health = 100
    car = 0
    fuel = 0
    gitar = 0
    pianika = 0
    terompet = 0
    piano = 0
    triangle = 0
    flagy = 0
    phone = 0
    smartphone = 0
    potion = 0
    elixir = 0
    sphere = 0
    trash = 0
    wood = 0
    rock = 0
    string = 0
    burger = 0
    pizza = 0
    kentang = 0
    petFood = 0

    emerald = 0
    diamond = 0
    orb = 0
    keping = 0
    crypto = 0
    gold = 0
    iron = 0
    ducky = 0
    
    ironore = 0
    goldore = 0
    diamondore = 0
    ancientdebris = 0

    common = 0
    rare = 0
    mythic = 0
    legendary = 0
    safana = 0
    luxury = 0
    bruh = 0
    lona = 0
    loana = 0
    rivena = 0
    aurora = 0
    safari = 0
    pet = 0

    ant = 0
    antexp = 0
    horse = 0
    horseexp = 0
    cat = 0
    catexp = 0
    fox = 0
    foxexp = 0
    dog = 0
    dogexp = 0
    dragon = 0
    dragonexp = 0
    panda = 0
    pandaexp = 0

    antlastfeed = 0
    horselastfeed = 0
    catlastfeed = 0
    foxlastfeed = 0
    doglastfeed = 0
    dragonlastfeed = 0
    pandalastfeed = 0

    armor = 0
    armordurability = 0
    sword = 0
    sworddurability = 0
    pickaxe = 0
    pickaxedurability = 0
    fishingrod = 0
    fishingroddurability = 0

    lastsmith = 0
    lastclaim = 0
    lastopen = 0
    lastluck = 0
    lastmining = 0
    lastnetworking = 0
    lastcoinly = 0
    lastclickly = 0
    lastvcoin = 0
    lastscoin = 0
    lasttoken = 0
    lastpunch = 0
    lasttrain = 0
    lastpsychic = 0
    lastrun = 0
    lastsafezone = 0
    lastgo = 0
    lasttrading = 0
    lasteat = +new Date() + 7 * 24 * 60 * 60 * 1000
    lastadventure = 0
    lastfishing = 0
    lastdungeon = 0
    lastduel = 0
    lastmining = 0
    lasthunt = 0
    lastweekly = 0
    lastmonthly = 0


    /**
     * 
     * @param {string} file 
     * @param {UsersDatabase} db 
     * @param {object|undefined|null} [obj]
     */
    constructor(file, db, obj) {
        super(file, db)
        this.create(obj)
    }
    /**
     * 
     * @param {object|undefined|null} [obj]
     * @param {boolean} [skipChecking=false]
     */
    create(obj, skipChecking = false) {
        const data = UserData._schema.nullish().parse(obj) || {}
        for (const key in data) {
            if (data == undefined) continue
            if (!(key in this))
                console.warn(`Property ${key} doesn't exist in '${UserData.name}', but trying to insert with ${data}`)
            // @ts-ignore
            this[key] = data[key]
        }
    }
    verify() {
        return UserData._schema.parseAsync(this)
    }

    verifySync() {
        return UserData._schema.parse(this)
    }

    save() {
        return usersMutex.mutex(this._filename, ActionType.WRITE, this._save.bind(this))
    }
    async _save() {
        const id = this._filename
        const data = await this.verify()
        await this._db.save(id, data)
        usersCache.set(id, data)
    }

    saveSync() {
        this._db.saveSync(this._filename, this.verifySync())
    }
}

/**
 * @class
 * @extends {Database<UserData>}
 */
export class UsersDatabase extends Database {
    /**
     * @param {string} [folder]
     */
    constructor(folder = './databases/users') {
        super(folder)
    }

    /**
     * @param {string} jid 
     * @param {Object | UserData | ((user: UserData) => void | Promise<void>)} data 
     * @returns 
     */
    update(jid, data) {
        const filename = sanitizeFile(jidNormalizedUser(jid))
        return usersMutex.mutex(filename, ActionType.READ | ActionType.WRITE, async () => {
            const user = await this._get(filename)
            if (typeof data === 'function') {
                await data(user)
            } else {
                user.create(data)
            }
            await user._save()
            return true
        })
    }

    async delete(user) {
        const filename = sanitizeFile(jidNormalizedUser(user));
        return usersMutex.mutex(filename, ActionType.WRITE, async () => {
            try {
                await fs.unlink(`./database/users/${filename}.json`);
                usersCache.del(filename);
                return true;
            } catch (error) {
                console.error(`Gagal menghapus data pengguna ${user}:`, error);
                return true;
            }
        });
    }
    
    /**
     * @param {string} user 
     * @returns {Promise<UserData>}
     */
    get(user) {
        const filename = sanitizeFile(jidNormalizedUser(user))
        return usersMutex.mutex(filename, ActionType.READ, this._get.bind(this, filename))
    }

    /**
     * @param {string} filename 
     * @returns {Promise<UserData>}
     */
    async _get(filename) {
        const user = new UserData(filename, this)
        /** @type {UserSchema | undefined} */
        const cache = usersCache.get(filename)
        user.create(cache ?? await this.read(filename))
        usersCache.set(filename, await user.verify())
        return user
    }
}