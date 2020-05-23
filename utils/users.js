let users = []

function joinNewUser(userId,userName,room){
    let user = users.push({
        userId,
        userName,
        room
    })
    return user
}


function removeUser(userid){
    let index = users.findIndex((user)=>user.userId == userid)
    return users.splice(index,1)[0]
}

function getUser(userid){
    let userFound = users.find((user)=>user.userId == userid)
    return userFound
}


function getRoomUsers(room){
    let roomUsers = users.filter((user)=>user.room == room)
    return roomUsers
}

function getAllUsers(){
    return users
}


module.exports = { joinNewUser ,getUser ,removeUser,getAllUsers,getRoomUsers}
