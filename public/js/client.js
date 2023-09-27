const socket = io();

const chatForm = document.querySelector('#chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.querySelector('#room-name')
const roomUsers = document.querySelector('#users')

//get username and room
const { username , room } = Qs.parse(location.search,{ ignoreQueryPrefix:true })


//join chat room 
socket.emit('joinroom', { username , room })


//message from server
socket.on('message',(message) => {
  outputMessage(message)

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight
})

//message submit
chatForm.addEventListener('submit',(e) => {
  e.preventDefault()

  //get message text
  const message = e.target.elements.msg.value
  
  //emit message to server
  socket.emit('chatMessage',message)

  //clear input
  e.target.elements.msg.value = ''
  e.target.elements.msg.focus()
})

//get users and room info from server
socket.on('roominfo',({ room , users}) => {
    outputRoomName(room)
    outputUsers(users)
})

//output messages to DOM
function outputMessage(message) {
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = ` <p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">${message.text} </p> `
  document.querySelector('.chat-messages').appendChild(div)
}

//add room to DOM
function outputRoomName(room) {
    roomName.innerHTML = room
}

//add users to DOM
function outputUsers(users) {
    roomUsers.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`
}