module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: 'localhost',
            database: 'tiger',
            user: 'root',
            password: ''
        },
        pool: {
            min: 0,
            max: 7
        }
    }
}
