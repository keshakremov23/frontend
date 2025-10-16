document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (message) {
        addMessage('user', message);
        input.value = '';
        
        // Добавляем временное сообщение "Скоро отвечу"
        addTemporaryMessage();
        
        // Отправляем запрос на сервер
        sendToServer(message);
    }
}

function addTemporaryMessage() {
    const chat = document.getElementById('chat');
    const tempMessageDiv = document.createElement('div');
    tempMessageDiv.id = 'temp-message';
    tempMessageDiv.className = 'message bot-message';
    tempMessageDiv.innerHTML = `
        <div class="message-content">
            <img src="logo-metrosha.png" alt="Метроша" class="avatar">
            <div class="message-bubble">
                <div class="message-text">Скоро отвечу...</div>
            </div>
        </div>
    `;
    chat.appendChild(tempMessageDiv);
    chat.scrollTop = chat.scrollHeight;
}

function removeTemporaryMessage() {
    const tempMessage = document.getElementById('temp-message');
    if (tempMessage) {
        tempMessage.remove();
    }
}

function addMessage(type, text) {
    const chat = document.getElementById('chat');
    const messageDiv = document.createElement('div');
    
    if (type === 'user') {
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-bubble">
                    <div class="message-text">${escapeHtml(text)}</div>
                </div>
                <img src="user-avatar.png" alt="Пользователь" class="avatar">
            </div>
        `;
    } else {
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <img src="logo-metrhosha.png" alt="Метроша" class="avatar">
                <div class="message-bubble">
                    <div class="message-text">${escapeHtml(text)}</div>
                </div>
            </div>
        `;
    }
    
    chat.appendChild(messageDiv);
    chat.scrollTop = chat.scrollHeight;
}

function sendToServer(message) {
    const formData = new FormData();
    formData.append('message', message);

    fetch('/chat/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Удаляем временное сообщение "Скоро отвечу"
        removeTemporaryMessage();
        
        if (data.error) {
            addMessage('bot', 'Извините, произошла ошибка: ' + data.error);
        } else {
            addMessage('bot', data.text);
            
            // Воспроизводим аудио, если оно есть
            if (data.audio) {
                playAudio(data.audio);
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Удаляем временное сообщение при ошибке
        removeTemporaryMessage();
        addMessage('bot', 'Извините, произошла ошибка соединения');
    });
}

function playAudio(audioBase64) {
    const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
    audio.play().catch(e => console.log('Audio play failed:', e));
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}