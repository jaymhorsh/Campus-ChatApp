const chatForm = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-message");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Getting login details from localStorage
const { username, deptValue: room } = JSON.parse(localStorage.getItem("data"));

const socket = io();
// Join chatroom Sending username and room to server
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
  console.log(users);

  const saveUsers = () => {
    localStorage.setItem("users", JSON.stringify(users));
  };
  saveUsers(users);
});

// Message from server
socket.on("message", (message) => {
  // Listen to message at the server.js
  outputMessage(message);
  //22 Scroll down
  chatMessage.scrollTop = chatMessage.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;

  if (!msg) {
    return false;
  }
  //Emit message to server
  socket.emit("chatMessage", msg);
  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//21  Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `  
    <p class='meta'>${message.username}</p>
    <p class="text"> 
      ${message.text}     
      <span> ${message.time}</span>  
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// function Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username[0].toUpperCase() + user.username.substring(1);
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById("leave-btn").addEventListener("click", () => {
  const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
  if (leaveRoom) {
    window.location = "/";
  } else {
  }
})



// sidebarToggler
const showSidebar = (toggleId, sidebarId) => {
  const toggle = document.getElementById(toggleId),
    sidebar = document.getElementById(sidebarId);
  if (toggle && sidebar) {
    toggle.addEventListener("click", () => {
      // We add the show-menu class to the div tag with the nav__menu class
      // console.log('welcome')
      sidebar.classList.toggle("show-users");
    });
  }
};
showSidebar("sidebar-toggle", "chat-sidebar");
// 
