const chats = [
    {
        id: 1,
        name: "Sabrina Matos",
        lastMessage: "Oi, tudo bem?",
        time: "22:40",
        unread: 0,
        avatar: "galeria/avatar2.png",
        messages: [
            { text: "Oi, tudo bem?", sent: false, time: "22:40" }
        ]
    },
    {
        id: 2,
        name: "João Augusto",
        lastMessage: "Está disponível para um freela?",
        time: "12:30",
        unread: 3,
        avatar: "galeria/avatar3.png",
        messages: [
            { text: "Está disponível para um freela?", sent: false, time: "12:30" }
        ]
    },
    {
        id: 3,
        name: "Maria Silva",
        lastMessage: "O projeto ficou perfeito, obrigada!",
        time: "08:20",
        unread: 5,
        avatar: "galeria/avatar4.png",
        messages: [
            { text: "O projeto ficou perfeito, obrigada!", sent: false, time: "08:20" }
        ]
    }
];

function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function updateLastMessage(chat, message, time) {
    chat.lastMessage = message;
    chat.time = time;
    populateChats();
}

function populateChats() {
    const chatList = document.getElementById('chatList');
    chatList.innerHTML = chats.map(chat => `
        <div class="chat-item" onclick="openChat(${chat.id})">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <div class="avatar me-2">
                        <img src="${chat.avatar}" alt="${chat.name}" class="avatar-img">
                    </div>
                    <div>
                        <div class="fw-bold">${chat.name}</div>
                        <div class="text-muted small">${chat.lastMessage}</div>
                    </div>
                </div>
                <div class="text-end">
                    <div class="small text-muted">${chat.time}</div>
                    ${chat.unread ? `<span class="notification-badge">${chat.unread}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function scrollToBottom() {
    const messageArea = document.getElementById('messageArea');
    messageArea.scrollTop = messageArea.scrollHeight;
}

function openChat(chatId) {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    document.getElementById('currentChatName').textContent = chat.name;
    document.getElementById('currentChatAvatar').src = chat.avatar;
    document.getElementById('currentChatAvatar').alt = chat.name;
    
    const messageArea = document.getElementById('messageArea');
    messageArea.innerHTML = chat.messages.map(msg => `
        <div class="message ${msg.sent ? 'sent' : 'received'}" data-time="${msg.time}">
            ${msg.text}
        </div>
    `).join('');

    chat.unread = 0;
    populateChats();
    scrollToBottom();
}

function addMessage(chatId, message, sent = true) {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    const time = getCurrentTime();
    const newMessage = {
        text: message,
        sent: sent,
        time: time
    };

    chat.messages.push(newMessage);
    updateLastMessage(chat, message, time);
    openChat(chat.id);
}

document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && this.value.trim()) {
        const currentChat = document.getElementById('currentChatName').textContent;
        const chat = chats.find(c => c.name === currentChat);
        
        if (chat) {
            addMessage(chat.id, this.value.trim());
            this.value = '';
            
            // Simular resposta automática após 1 segundo
            setTimeout(() => {
                const responses = [
                    "Ok, entendi!",
                    "Claro, vou verificar isso.",
                    "Obrigado pela mensagem!",
                    "Vou responder em breve!"
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(chat.id, randomResponse, false);
            }, 1000);
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    populateChats();
    
    // Adicionar foco ao input quando clicar na área de mensagens
    document.querySelector('.message-area').addEventListener('click', function() {
        document.getElementById('messageInput').focus();
    });
});