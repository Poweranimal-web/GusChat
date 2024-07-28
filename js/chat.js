/* scripts.js */
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

document.addEventListener('click', function(event) {
  
});
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
