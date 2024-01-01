/* eslint-disable indent */
const MusicHandler = require('./handler')
const routes = require('./routes')

module.exports = {
    name: 'music',
    version: '1.0.0',
    register: async (server, { service, albumValidator, songValidator }) => {
        const musicHandler = new MusicHandler(service, albumValidator, songValidator)
        server.route(routes(musicHandler))
    }
}
