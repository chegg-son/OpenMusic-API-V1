/* eslint-disable indent */
'use strict'
require('dotenv').config()

const Hapi = require('@hapi/hapi')
const musics = require('./api/musics/')
const MusicService = require('./services/postgres/MusicService')
const validatorAlbum = require('./validator/albums')
const validatorSong = require('./validator/songs')
const ClientError = require('./exceptions/ClientError')

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

    server.ext('onPreResponse', (request, h) => {
        const { response } = request

        if (response instanceof Error) {
            if (response instanceof ClientError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message
                })
                newResponse.code(response.statusCode)
                return newResponse
            }

            if (!response.isServer) {
                return h.continue
            }

            const newResponse = h.response({
                status: 'error',
                message: 'terjadi kegagalan pada server kami'
            })
            newResponse.code(500)
            return newResponse
        }

        return h.continue
    })

    await server.start()
    console.log(`Server running on ${server.info.uri}`)
}

init()
