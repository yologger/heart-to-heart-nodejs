const { createLogger, format, transports } = require('winston')

const logger = createLogger({
    level: 'info',
    format: format.json(),
    transports: [
        new transports.File({ filename: "combined.log" }),
        new transports.File({ filename: "error.log", level: 'error' })
    ]
})

if (process.env.NODE_EVN !== 'production') {
    logger.add(new transports.Console({ foramt: format.simple() }))
}

module.exports = logger