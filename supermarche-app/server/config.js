module.exports = {
    database: {
        user: 'postgres',
        host: 'localhost',
        database: 'db',
        password: 'sql',
        port: 5432,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
    },
    server: {
        port: process.env.PORT || 5000,
        env: process.env.NODE_ENV || 'development'
    },
    security: {
        bcryptSaltRounds: 10
    }
}; 