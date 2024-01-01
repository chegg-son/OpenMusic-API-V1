/* eslint-disable indent */
'use strict'
require('dotenv').config()

const Hapi = require('@hapi/hapi')
const musics = require('./api/musics/')
const MusicService = require('./services/postgres/MusicService')
const validatorAlbum = require('./validator/albums')
const validatorSong = require('./validator/songs')

const init = async () => {
    const musicService = new MusicService()
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*']
            }
        }
    })

    await server.register({
        plugin: musics,
        options: {
            service: musicService,
            albumValidator: validatorAlbum,
            songValidator: validatorSong
        }
    })

    await server.start()
    console.log(`Server running on ${server.info.uri}`)
}

init()
