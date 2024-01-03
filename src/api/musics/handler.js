/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
const ClientError = require('../../exceptions/ClientError')
const autoBind = require('auto-bind')

class MusicHandler {
    constructor(service, albumValidator, songValidator) {
        this._service = service
        this._albumValidator = albumValidator
        this._songValidator = songValidator

        autoBind(this)
    }

    async postAlbumHandler(request, h) {
        this._albumValidator.validateAlbumPayload(request.payload)
        const { name, year } = request.payload
        const albumId = await this._service.addAlbum({ name, year })
        const response = h.response({
            status: 'success',
            data: {
                albumId
            }
        })
        response.code(201)
        return response
    }

    async getAlbumByIdHandler(request, h) {
        const { id } = request.params
        const album = await this._service.getAlbumById(id)
        return {
            status: 'success',
            data: {
                album
            }
        }
    }

    // bagian putAlbumByIdHandler
    async putAlbumByIdHandler(request, h) {
        this._albumValidator.validateAlbumPayload(request.payload)
        const { id } = request.params
        const { name, year } = request.payload

        await this._service.editAlbumById(id, { name, year })

        return {
            status: 'success',
            message: 'Album berhasil diperbarui'
        }
    }

    async deleteAlbumByIdHandler(request, h) {
        const { id } = request.params
        await this._service.deleteAlbumById(id)

        return {
            status: 'success',
            message: 'Album berhasil dihapus'
        }
    }

    // bagian song handler
    async postSongHandler(request, h) {
        this._songValidator.validateSongPayload(request.payload)
        const { title, year, genre, performer, duration, albumId } = request.payload
        const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId })
        const response = h.response({
            status: 'success',
            data: {
                songId
            }
        })
        response.code(201)
        return response
    }

    async getSongsHandler(request, h) {
        const { title, performer } = request.query
        const songs = await this._service.getSongs({ title, performer })
        return {
            status: 'success',
            data: {
                songs
            }
        }
    }

    async getSongByIdHandler(request, h) {
        const { id } = request.params
        const song = await this._service.getSongById(id)
        return {
            status: 'success',
            data: {
                song
            }
        }
    }

    async putSongByIdHandler(request, h) {
        this._songValidator.validateSongPayload(request.payload)
        const { id } = request.params
        const { title, year, genre, performer, duration, albumId } = request.payload
        await this._service.editSongById(id, { title, year, genre, performer, duration, albumId })
        return {
            status: 'success',
            message: 'Lagu berhasil diperbarui'
        }
    }

    async deleteSongByIdHandler(request, h) {
        const { id } = request.params
        await this._service.deleteSongById(id)
        return {
            status: 'success',
            message: 'Lagu berhasil dihapus'
        }
    }
}

module.exports = MusicHandler
