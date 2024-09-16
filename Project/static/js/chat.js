/* scripts.js */
let startSocket = false;
let pushSocket = null;
let privatechatSocket = null;
let pushfriendchatSocket = null;
document.addEventListener("DOMContentLoaded", async function (event) {
    const emailField = document.getElementById('contactEmail');
    const addContactModalBody = document.getElementById('addContactModalBody');
    emailField.addEventListener("input", () => {
        validateEmail();
        adjustModalHeight();
    });
        let push_number_room = checkAuthorization();
        startSocket = true;
        
        startPushSocketClient(push_number_room);
        getListFriends();

        UpdateContactData();
    
});

async function UpdateContactData(){
    let response = await fetch("/contact/detail/get",{
        method: "GET", 
        headers : {
            "Authorization": "Bearer "+localStorage.getItem("jwt"),
        },
    });
    response = await response.json();
    if (response.response == "OK"){
        document.querySelector(".user-name").innerHTML = `${response.data[0].tag}`;
    }
}
function getCookie(key){
    let allCookie = document.cookie; // get list of all cookie
    let semicolon_list = allCookie.split(";"); // transform it`s into array by semicolon-separator
    let string_cookie = semicolon_list.join("=");// transform array into strin by equal-separator
    let equal_list = string_cookie.split("=");// will get total array without any separator
    equal_list.map((element, index)=>{
        equal_list[index] = element.replaceAll(" ", ""); // replace all space between words
    });
    let founded_key_index = equal_list.indexOf(`${key}`); 
    if (founded_key_index == -1){ /* we know that format of cookie key=value, 
                                  so if we find index of key, 
                                  next index is going to be value */
        return null;
    }
    else{
        return equal_list[founded_key_index+1];
    }



}
async function checkAuthorization(){
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
            if (json_response.metaData){
                return json_response.metaData;
            }
            else{
                return true;
            }
        }
    }
} 
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
async function findFriend() {
    console.log(JSON.stringify({
        "tag": document.getElementById("contactTag").value,
        "email": document.getElementById("contactEmail").value,
    }));
    let response = await fetch("/friends/set",{
        method: "POST", 
        headers : {
            "Authorization": "Bearer "+localStorage.getItem("jwt"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "tag": document.getElementById("contactTag").value,
            "email": document.getElementById("contactEmail").value,
        })
        
    });
    response = await response.json();
    if (response.response == "Failure"){
        const findError = document.querySelector('.find-error');
        findError.style.display = "block";
    }
    else{
        let element = document.querySelector(".contacts-modal-body");
        let number_chat = getCookie("contactN")==null?0:Number(number_chat);
        element.innerHTML += `
                <div class="contact">
                    <div class="contact-icon"></div><span class="contact-name">${response.tag}</span>
                    <div class="contact-actions">
                        <button class="chat-button" onclick="openChat('chat${number_chat}', this.closest('.contact'), '${response.private_room}', '${response.push_room}'); closeContactsModal(); closeSettings()">
                            <ion-icon name="chatbubbles-outline"></ion-icon>
                        </button>
                        <button class="call-button">
                            <ion-icon name="call-outline"></ion-icon>
                        </button>
                    </div>
                </div>`;
        number_chat = number_chat + 1;
        document.cookie = `contactN=${number_chat}`;
        document.getElementById("no-friends-message").style.display = "none";  
        closeAddContactModal();
        openContactsModal();
    }
    
}
async function getListFriends(){
    let response = await fetch("/friends",{
        method: "POST", 
        headers : {
            "Authorization": "Bearer "+localStorage.getItem("jwt"),
        },
    });
    
    let json_response = await response.json();
    if (json_response.response == "OK"){
        if (json_response.data.length > 0){
            let counter_of_contact = getCookie("contactN")==null?0:Number(getCookie("contactN"));
            json_response.data.map((friend, index)=>{
                document.querySelector(".contacts-modal-body").innerHTML += `
                <div class="contact">
                        <div class="contact-icon"></div><span class="contact-name">${friend.tag}</span>
                        <div class="contact-actions">
                            <button class="chat-button" onclick="openChat('chat${index}', this.closest('.contact'), '${friend.private_room}', '${friend.push_room}'); closeContactsModal(); closeSettings()">
                                <ion-icon name="chatbubbles-outline"></ion-icon>
                            </button>
                            <button class="call-button">
                                <ion-icon name="call-outline"></ion-icon>
                            </button>
                        </div>
                </div>`
                counter_of_contact += 1;
            });
            document.cookie = `contactN=${0}`;
        }
        else{
            // <div class="no-messages">There are no friends yet</div>
            let list = document.querySelector(".contacts-modal-body");
            let message = document.createElement('div');
            message.id = "no-friends-message";
            message.classList.add("no-messages");
            let text_no_friends = document.createTextNode("There are no friends yet");
            message.appendChild(text_no_friends);
            list.appendChild(message);

        }
    
    }
}

function startPushSocketClient(room){
    if(startSocket === true){
        pushSocket = new WebSocket("ws://" + location.host + "/"+ room);
        console.log("start socket");
        pushSocket.addEventListener("open",(e) => {
            console.log("[open] Successfully connected");
        });
        pushSocket.onmessage = function(event) {
            document.getElementById("chat1").innerHTML += `
                <div class="message-container other">
                        <img  class="message-icon other-icon" >
                        <div class="message">
                            ${event.data}
                        </div>
                </div>`;
        };
        pushSocket.onclose = function(event) {
                if (event.wasClean) {
                    console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
                } else {
                // например, сервер убил процесс или сеть недоступна
                // обычно в этом случае event.code 1006
                console.log('[close] Соединение прервано');
                }
            };      
        pushSocket.onerror = function(error) {
                console.log(`[error]`);
        };
    }
} 
function startChatSocketClient(id,privateRoom,pushRoom){
    if(startSocket === true){
        privatechatSocket = new WebSocket("ws://" + location.host + "/"+ privateRoom);
        console.log("start socket");
        privatechatSocket.addEventListener("open",(e) => {
            console.log("[open] Successfully connected");
        });
        privatechatSocket.onmessage = function(event) {
            document.getElementById(`chat${id}`).innerHTML += `
                <div class="message-container other">
                        <img class="message-icon other-icon" >
                        <div class="message">
                            ${event.data}
                        </div>
                </div>`;
        };
        privatechatSocket.onclose = function(event) {
                if (event.wasClean) {
                    console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
                } else {
                // например, сервер убил процесс или сеть недоступна
                // обычно в этом случае event.code 1006
                console.log('[close] Соединение прервано');
                }
            };      
        privatechatSocket.onerror = function(error) {
                console.log(`[error]`);
        };

        pushfriendchatSocket = new WebSocket("ws://" + location.host + "/"+ pushRoom);
        console.log("start push socket");
        pushfriendchatSocket.addEventListener("open",(e) => {
            console.log("[open] Successfully connected");
        });
        pushfriendchatSocket.onmessage = function(event) {
            console.log(event.data);
            // document.getElementById("chat1").innerHTML += `
            //     <div class="message-container other">
            //             <img  class="message-icon other-icon" >
            //             <div class="message">
            //                 ${event.data}
            //             </div>
            //     </div>`;
        };
        pushfriendchatSocket.onclose = function(event) {
                if (event.wasClean) {
                    console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
                } else {
                // например, сервер убил процесс или сеть недоступна
                // обычно в этом случае event.code 1006
                console.log('[close] Соединение прервано');
                }
            };      
        pushfriendchatSocket.onerror = function(error) {
                console.log(`[error]`);
        };
    }
}  
function openChat(chatId, chatElement,privateRoom, pushRoom) {
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
    welcomeMessage.style.display = 'none';
    chatBack.style.backgroundColor = '#EBF4F6';
    startChatSocketClient(chatId,privateRoom, pushRoom);
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
document.getElementById("find-friends-button").addEventListener("click", async(e)=>{
    await findFriend();


});
function closeContactsModal() {
    document.getElementById('contactsModal').style.display = 'none';
}
document.getElementById("inputText").addEventListener("keypress", (e)=>{
    if (e.key == "Enter"){
        let text = document.getElementById("inputText").value; 
        document.querySelector(".chat-window[style='display: block;']").innerHTML += `
                <div class="message-container user">
                        <div class="message">
                            ${text}
                        </div>
                        <img class="message-icon user-icon">
                </div>`;
        let json_data = JSON.stringify({"data":text, ""});
        privatechatSocket.send(json_data);
        pushfriendchatSocket.send(json_data);

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

function openAddContactModal() {
    document.getElementById('addContactModal').style.display = 'flex';
}

function closeAddContactModal() {
    document.getElementById('addContactModal').style.display = 'none';
    document.getElementById("contactTag").value = "";
    document.getElementById("contactEmail").value = "";
}