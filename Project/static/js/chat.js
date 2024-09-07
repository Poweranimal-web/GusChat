/* scripts.js */
let startSocket = false;
document.addEventListener("DOMContentLoaded", async function (event) {
    let response = await fetch("/",{
            method: "POST", 
            headers : {
                "Authorization": "Bearer "+localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "status": "Check authorization",
            })
    });
    let status_response = response.status;
    if (status_response == "401"){
        window.location.href = "/login";
    }
    else{
        let json_response = await response.json();
        if (json_response.response == "OK"){
            startSocket = true;
            startSocketClient();
        }
    }
});
function startSocketClient(){
    if(startSocket === true){
        console.log("start socket");
        let socket = new WebSocket("ws://" + location.host + "/");
        socket.addEventListener("open",(e) => {
            console.log("[open] Соединение установлено");
            console.log("Отправляем данные на сервер");
            socket.send("Меня зовут Джон");
        });
        socket.onmessage = function(event) {
                console.log(`[message] Данные получены с сервера: ${event.data}`);
        };
            
        socket.onclose = function(event) {
                if (event.wasClean) {
                    console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
                } else {
                // например, сервер убил процесс или сеть недоступна
                // обычно в этом случае event.code 1006
                console.log('[close] Соединение прервано');
                }
            };      
        socket.onerror = function(error) {
                console.log(`[error]`);
        };
    }
}  
function openChat(chatId, chatElement) {
    const chatWindows = document.querySelectorAll('.chat-window');
    const chatElements = document.querySelectorAll('.chat');
    const chatBack = document.getElementById('chatBack');
    const chatHeader = document.getElementById('chatHeader');
    
    chatWindows.forEach(window => window.style.display = 'none');
    chatElements.forEach(element => element.classList.remove('selected'));
    
    document.getElementById(chatId).style.display = 'block';
    document.getElementById('welcomeMessage').style.display = 'none';
    document.getElementById('inputArea').style.display = 'flex';
    chatElement.classList.add('selected');
    
    // Update chat header
    const chatTitle = chatElement.textContent.trim();
    chatHeader.querySelector('.chat-header-title').textContent = chatTitle;

    chatHeader.style.display = 'flex';
    chatBack.style.backgroundColor = '#EBF4F6';
}


function openSettings() {
    document.getElementById('settingsModal').style.display = 'flex';
}

function closeSettings() {
    document.getElementById('settingsModal').style.display = 'none';
}

function toggleEmojiMenu() {
    const emojiMenu = document.getElementById('emojiMenu');
    emojiMenu.style.display = emojiMenu.style.display === 'block' ? 'none' : 'block';
}

function toggleAttachmentMenu() {
    const attachmentMenu = document.getElementById('attachmentMenu');
    attachmentMenu.style.display = attachmentMenu.style.display === 'block' ? 'none' : 'block';
}



document.addEventListener('click', function(event) {
    const emojiMenu = document.getElementById('emojiMenu');
    const attachmentMenu = document.getElementById('attachmentMenu');
    const modal = document.getElementById('settingsModal');
    const sidebar = document.getElementById('modalSidebar');

    if (modal.style.display === 'flex' && !sidebar.contains(event.target) && !event.target.closest('.settings-button')) {
        modal.style.display = 'none';
    }
    // Close emoji menu if clicked outside
    if (emojiMenu.style.display === 'block' && !emojiMenu.contains(event.target) && !event.target.closest('.emoji-button')) {
        emojiMenu.style.display = 'none';
    }

    // Close attachment menu if clicked outside
    if (attachmentMenu.style.display === 'block' && !attachmentMenu.contains(event.target) && !event.target.closest('.attachment-button')) {
        attachmentMenu.style.display = 'none';
    }
});

function emoji(emoji){
    document.getElementById("inputText").value += document.getElementById(emoji).innerHTML; 
}

function toggleCallModal() {
    const modal = document.getElementById('callModal');
    if (modal.style.display === 'none') {
        modal.style.display = 'flex';
    } else {
        modal.style.display = 'none';
    }
}


const minimizeButton = document.getElementById('minimizeButton');
const callWindow = document.getElementById('callModal');  // Update to match the correct ID
const minimizedCallWindow = document.getElementById('minimized-call-window');
const dragArea = document.querySelector('.drag-area');

minimizeButton.addEventListener('click', () => {
    callWindow.style.display = 'none';   // Hide the main call window
    minimizedCallWindow.style.display = 'flex';  // Show the minimized window
});

// Dragging functionality
let isDragging = false;
let offset = { x: 0, y: 0 };

dragArea.addEventListener('mousedown', (e) => {
    isDragging = true;
    offset.x = e.clientX - minimizedCallWindow.getBoundingClientRect().left;
    offset.y = e.clientY - minimizedCallWindow.getBoundingClientRect().top;
    minimizedCallWindow.style.cursor = 'grabbing';
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    minimizedCallWindow.style.cursor = 'grab';
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        minimizedCallWindow.style.left = `${e.clientX - offset.x}px`;
        minimizedCallWindow.style.top = `${e.clientY - offset.y}px`;
    }
});
function endCall() {
    const modal = document.getElementById('callModal');
    const minimizedCallWindow = document.getElementById('minimized-call-window');
    modal.style.display = 'none';
    minimizedCallWindow.style.display = 'none';
}

const micButton = document.getElementById('micButton');
const cameraButton = document.getElementById('cameraButton');

// Toggle the 'crossed' class on click
micButton.addEventListener('click', () => {
    micButton.classList.toggle('crossed');
});

cameraButton.addEventListener('click', () => {
    cameraButton.classList.toggle('crossed');
});

const resizeButton = document.getElementById('resizeButton');

resizeButton.addEventListener('click', () => {
    if (minimizedCallWindow.style.display === 'none') {
        minimizedCallWindow.style.display = 'flex';
        callWindow.style.display = 'none';
    } else {
        minimizedCallWindow.style.display = 'none';
        callWindow.style.display = 'flex';
    }
});