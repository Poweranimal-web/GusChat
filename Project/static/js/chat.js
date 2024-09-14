/* scripts.js */
let startSocket = false;
let socket = null;
document.addEventListener("DOMContentLoaded", async function (event) {
    const emailField = document.getElementById('contactEmail');
    const addContactModalBody = document.getElementById('addContactModalBody');
    emailField.addEventListener("input", () => {
        validateEmail();
        adjustModalHeight();
    });
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
            startPushSocketClient(json_response.metaData);
        }
    }
});
function validateEmail() {
    const emailField = document.getElementById('contactEmail');
    const checkValidEmail = emailField.value.split('@');

    const mailAlphabetError = document.querySelector('.mail-alphabet-error');
    const dogValidError = document.querySelector('.dog-error');
    const mailValidError = document.querySelector('.incorrect-mail');


    if (/^[a-z0-9.]+$/.test(checkValidEmail[0])) {
        mailAlphabetError.style.display = 'none';
    } else {
        mailAlphabetError.style.display = 'block';
    }


    if (emailField.value.includes("@")) {
        if (checkValidEmail[1] && checkValidEmail[1].length >= 7) {
            if (checkValidEmail[1] === 'gmail.com' || checkValidEmail[1] === 'ukr.net') {
                mailValidError.style.display = 'none';
            } else {
                mailValidError.style.display = 'block';
            }
            dogValidError.style.display = 'none';
        }
    } else {
        dogValidError.style.display = 'block';
    }
}
function adjustModalHeight() {
    const addContactModalBody = document.getElementById('addContactModalBody');
    const modalErrors = addContactModalBody.querySelectorAll('.error');
    let visibleErrors = 0;
    modalErrors.forEach(error => {
        if (error.style.display === 'block') {
            visibleErrors += 1;
        }
    });
    addContactModalBody.style.height = `calc(100% + ${visibleErrors * 20}px)`;
}

function startPushSocketClient(room){
    if(startSocket === true){
        socket = new WebSocket("ws://" + location.host + "/"+ room);
        console.log("start socket");
        socket.addEventListener("open",(e) => {
            console.log("[open] Successfully connected");
        });
        socket.onmessage = function(event) {
            document.getElementById("chat1").innerHTML += `
                <div class="message-container other">
                        <img  class="message-icon other-icon" >
                        <div class="message">
                            ${event.data}
                        </div>
                </div>`;
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
    const chatBack = document.getElementById('chatBack');
    const chatHeader = document.getElementById('chatHeader');
    const inputArea = document.getElementById('inputArea');
    const welcomeMessage = document.getElementById('welcomeMessage');
    let chatWindow = document.getElementById(chatId);
    if (!chatWindow) {

        chatWindow = document.createElement('div');
        chatWindow.classList.add('chat-window');
        chatWindow.id = chatId;
        chatWindow.innerHTML = `<div class="no-messages">There are no messages yet</div>`;
        chatBack.appendChild(chatWindow);


        const newChat = document.createElement('div');
        newChat.classList.add('chat');
        newChat.innerHTML = `<div class="chat-icon"></div>${chatElement.querySelector('.contact-name').textContent}`;
        newChat.setAttribute('onclick', `openChat('${chatId}', this)`);
        document.querySelector('.chat-list').appendChild(newChat);
    }
    const chatWindows = document.querySelectorAll('.chat-window');
    chatWindows.forEach(window => window.style.display = 'none');
    const chatElements = document.querySelectorAll('.chat');
    chatElements.forEach(element => element.classList.remove('selected'));
    chatWindow.style.display = 'block';
    chatElement.classList.add('selected');
    const chatTitle = chatElement.querySelector('.contact-name')?.textContent.trim() || chatElement.textContent.trim();
    chatHeader.querySelector('.chat-header-title').textContent = chatTitle;

    chatHeader.style.display = 'flex';
    inputArea.style.display = 'flex';
    welcomeMessage.style.display = 'none'
    chatBack.style.backgroundColor = '#EBF4F6';
}


function openSettings() {
    document.getElementById('settingsModal').style.display = 'flex';
    const contactModal = document.getElementById('addContactModal');
    contactModal.style.display = 'none'
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
    const contactsModal = document.getElementById('contactsModal');
    const addContactsModal = document.getElementById('addContactModal');
    if (contactsModal && contactsModal.style.display === 'flex') {
        return; 
    }

    if (addContactsModal && addContactsModal.style.display === 'flex') {
        return; 
    }
    if (modal.style.display === 'flex' && !sidebar.contains(event.target) && !event.target.closest('.settings-button') && !event.target.closest('#contactsModal')) {

        modal.style.display = 'none'; 
    }

    if (emojiMenu.style.display === 'block' && 
        !emojiMenu.contains(event.target) && 
        !event.target.closest('.emoji-button')) {

        emojiMenu.style.display = 'none';
    }
    if (attachmentMenu.style.display === 'block' && 
        !attachmentMenu.contains(event.target) && 
        !event.target.closest('.attachment-button')) {

        attachmentMenu.style.display = 'none';
    }
});
function closeContactsModal() {
    const contactsModal = document.getElementById('contactsModal');
    contactsModal.style.display = 'none';
}
document.getElementById("inputText").addEventListener("keypress", (e)=>{
    if (e.key == "Enter"){
        let text = document.getElementById("inputText").value; 
        document.getElementById("chat1").innerHTML += `
                <div class="message-container user">
                        <div class="message">
                            ${text}
                        </div>
                        <img class="message-icon user-icon" >
                </div>`;
        socket.send(text);
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
function openContactsModal() {
    document.getElementById('contactsModal').style.display = 'flex';
}

function closeContactsModal() {
    document.getElementById('contactsModal').style.display = 'none';
}

function openAddContactModal() {
    document.getElementById('addContactModal').style.display = 'flex';
}

function closeAddContactModal() {
    document.getElementById('addContactModal').style.display = 'none';
}