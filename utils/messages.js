const moment = require('moment')

function convertTextToObject (username ,msgtxt){
    return {
        username:username,
        text:msgtxt,
        time: moment().format('h:mm a')
    }
}

module.exports = {
    convertTextToObject
}