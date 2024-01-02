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
        try {
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
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                })
                response.code(error.statusCode)
                return response
            }
            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            })
            response.code(500)
            console.error(error)
            return response
        }
    }

    async getAlbumByIdHandler(request, h) {
        try {
            const { id } = request.params
            const album = await this._service.getAlbumById(id)
            return {
                status: 'success',
                data: {
                    album
                }
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: 'Album tidak ditemukan'
                })
                response.code(error.statusCode)
                return response
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            })
            response.code(500)
            console.error(error)
            return response
        }
    }

    // bagian putAlbumByIdHandler
    async putAlbumByIdHandler(request, h) {
        try {
            this._albumValidator.validateAlbumPayload(request.payload)
            const { id } = request.params
            const { name, year } = request.payload

            await this._service.editAlbumById(id, { name, year })

            return {
                status: 'success',
                message: 'Album berhasil diperbarui'
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                })
                response.code(error.statusCode)
                return response
            }
            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            })
            response.code(500)
            console.error(error)
            return response
        }
    }

    async deleteAlbumByIdHandler(request, h) {
        try {
            const { id } = request.params
            await this._service.deleteAlbumById(id)

            return {
                status: 'success',
                message: 'Album berhasil dihapus'
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                })
                response.code(error.statusCode)
                return response
            }

            // SERVER ERROR
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            })
            response.code(500)
            console.error(error)
            return response
        }
    }

    // bagian song handler
    async postSongHandler(request, h) {
        try {
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
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                })
                response.code(error.statusCode)
                return response
            }
            // Server Error
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            })
            response.code(500)
            console.error(error)
            return response
        }
    }

    async getSongsHandler(request, h) {
        try {
            // enable search query

            const { title, performer } = request.query

            const songs = await this._service.getSongs({ title, performer })
            return {
                status: 'success',
                data: {
                    songs
                }
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                })
                response.code(error.statusCode)
                return response
            }
            // Server Error
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            })
            response.code(500)
            console.error(error)
            return response
        }
    }

    async getSongByIdHandler(request, h) {
        try {
            const { id } = request.params
            const song = await this._service.getSongById(id)
            return {
                status: 'success',
                data: {
                    song
                }
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                })
                response.code(error.statusCode)
                return response
            }
            // Server Error
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            })
            response.code(500)
            console.error(error)
            return response
        }
    }

    async putSongByIdHandler(request, h) {
        try {
            this._songValidator.validateSongPayload(request.payload)
            const { id } = request.params
            const { title, year, genre, performer, duration, albumId } = request.payload
            await this._service.editSongById(id, { title, year, genre, performer, duration, albumId })
            return {
                status: 'success',
                message: 'Lagu berhasil diperbarui'
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                })
                response.code(error.statusCode)
                return response
            }
            // Server Error
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            })
            response.code(500)
            console.error(error)
            return response
        }
    }

    async deleteSongByIdHandler(request, h) {
        try {
            const { id } = request.params
            await this._service.deleteSongById(id)
            return {
                status: 'success',
                message: 'Lagu berhasil dihapus'
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                })
                response.code(error.statusCode)
                return response
            }
            // Server Error
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            })
            response.code(500)
            console.error(error)
            return response
        }
    }
}

module.exports = MusicHandler
