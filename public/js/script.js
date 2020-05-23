let socket = io()

const chatForm = document.getElementById('chat-form')
const chatCont = document.getElementById('chat-cont')
const roomName = document.getElementById('room-name')
const roomUsersList = document.getElementById('users')


//To get the user and room and send it at 
//first along with chat message to server
const {username ,room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true
})


if(username===undefined || username ==='' ||room===undefined || room ==='' ){
    //logout
    window.location.replace("index.html");
}

socket.on('busy',()=>{
    alert('Personal Room is busy .Try after some time !')
    window.location.replace("index.html")
})

socket.on('con_brk',()=>{ //When connection breaks
    socket.emit('join-room',{ username:username,room:room,back:1 })
})

//emit logged in username,room to server
socket.emit('join-room',{ username:username,room:room ,back:0})

//whenever user sends message
chatForm.addEventListener('submit',(ev)=>{
    ev.preventDefault()
    const msgText = ev.target.elements.inpSendChat.value
    socket.emit('chatMsg',msgText,username)
    ev.target.elements.inpSendChat.value = ''
    ev.target.elements.inpSendChat.focus()
})

socket.on('upd_sidebar',({room,roomUsers})=>{
    setRoomName(room)
    updateSideBar(roomUsers)
})

socket.on('message',(msgObj)=>{
    if(msgObj){
        outputMessage(msgObj)
        chatCont.scrollTop = chatCont.scrollHeight
    }
    
})

//this function creates the chat format
function outputMessage(msgObj){
    let div = document.createElement('div')
    div.classList.add('chat')
    div.innerHTML = `<p class="sender-name">${msgObj.username}<span class="send-time">${msgObj.time}</span></p>
    <p class="msg">${msgObj.text}</p>`
    chatCont.appendChild(div)
}

function setRoomName(room){
    roomName.innerText = room
}

function updateSideBar(room_users){
    roomUsersList.innerHTML =`
    ${room_users.map((room_user)=> `<li>${room_user.userName}</li>`).join('')}
    `
}