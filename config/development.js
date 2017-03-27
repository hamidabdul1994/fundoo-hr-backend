module.exports = {
    cookie: {
        secret: process.env.COOKIE_SECRET_KEY,
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
