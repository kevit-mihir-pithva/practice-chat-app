const moment = require('moment')

function generateMsg(username,text) {
    return {
        username,
        text,
        time:moment().format('h:mm a')
    }
}

module.exports = generateMsg