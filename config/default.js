module.exports = {
    host: 'localhost',
    port: 3030,
    cookie: {
        secret: process.env.COOKIE_SECRET_KEY || 'thisiscookiesecret',
    },
    session: {
        secure: true
    },
    db: {
        provider: "pg",
        connection: process.env.DATABASE_URL
    },
    redis: {
        url: "redis://127.0.0.1:6379/1"
    },
    log: "debug"
};
