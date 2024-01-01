/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
const NotFoundError = require('../../exceptions/NotFoundError')
const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')

class MusicService {
    constructor() {
        this._pool = new Pool()
    }

    // bagian albums
    async addAlbum({ name, year }) {
        const id = `album-${nanoid(16)}`

        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
            values: [id, name, year]
        }

        const result = await this._pool.query(query)

        if (!result.rows[0].id) {
            throw new InvariantError('Album gagal ditambahkan')
        }

        return result.rows[0].id
    }

    async getAlbumById(id) {
        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFoundError('Album tidak ditemukan')
        }

        return result.rows[0]
    }

    async editAlbumById(id, { name, year }) {
        const query = {
            text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
            values: [name, year, id]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan')
        }
    }

    async deleteAlbumById(id) {
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan')
        }
    }

    // bagian songs
    async addSong({ title, year, genre, performer, duration }) {
        const id = `song-${nanoid(16)}`
        const albumId = `album-${nanoid(16)}`
        const query = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            values: [id, title, year, genre, performer, duration, albumId]
        }

        const result = await this._pool.query(query)

        if (!result.rows[0].id) {
            throw new InvariantError('Lagu gagal ditambahkan')
        }

        return result.rows[0].id
    }

    async getSongs() {
        const query = {
            text: 'SELECT * FROM songs'
        }

        const result = await this._pool.query(query)

        const songs = result.rows.map((row) => ({
            id: row.id,
            title: row.title,
            performer: row.performer
        }))

        return songs
    }

    async getSongById(id) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFoundError('Lagu tidak ditemukan')
        }

        return result.rows[0]
    }

    async editSongById(id, { title, year, genre, performer, duration }) {
        const query = {
            text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5 WHERE id = $6 RETURNING id',
            values: [title, year, genre, performer, duration, id]
        }
        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan')
        }

        return result.rows[0].id
    }

    async deleteSongById(id) {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan')
        }

        return result.rows[0].id
    }
}

module.exports = MusicService
