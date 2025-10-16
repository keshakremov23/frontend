class MetroBot {
    constructor() {
        this.metroData = this.loadMetroData();
        this.allStations = this.getAllStationsList();
    }

    loadMetroData() {
        return {
            lines: {
                "Сокольническая": {
                    color: "красная",
                    stations: ["Бульвар Рокоссовского", "Черкизовская", "Преображенская площадь", "Сокольники", 
                             "Красносельская", "Комсомольская", "Красные Ворота", "Чистые пруды", 
                             "Лубянка", "Охотный Ряд", "Библиотека имени Ленина", "Кропоткинская", 
                             "Парк культуры", "Фрунзенская", "Спортивная", "Воробьёвы горы", "Университет", 
                             "Проспект Вернадского", "Юго-Западная", "Тропарёво", "Румянцево", "Саларьево"]
                },
                "Замоскворецкая": {
                    color: "зеленая", 
                    stations: ["Ховрино", "Беломорская", "Речной вокзал", "Водный стадион", "Войковская",
                             "Сокол", "Аэропорт", "Динамо", "Белорусская", "Маяковская", "Тверская",
                             "Театральная", "Новокузнецкая", "Павелецкая", "Автозаводская", "Технопарк"]
                },
                "Арбатско-Покровская": {
                    color: "синяя",
                    stations: ["Пятницкое шоссе", "Митино", "Волоколамская", "Мякинино", "Строгино",
                             "Крылатское", "Молодёжная", "Кунцевская", "Славянский бульвар", "Парк Победы",
                             "Киевская", "Смоленская", "Арбатская", "Площадь Революции", "Курская",
                             "Бауманская", "Электрозаводская", "Семёновская", "Партизанская", "Измайловская"]
                },
                "Кольцевая": {
                    color: "коричневая",
                    stations: ["Парк культуры", "Октябрьская", "Добрынинская", "Павелецкая", "Таганская",
                             "Курская", "Комсомольская", "Проспект Мира", "Новослободская", "Белорусская",
                             "Краснопресненская", "Киевская"]
                }
            },
            transfers: {
                "Библиотека имени Ленина": ["Сокольническая", "Арбатско-Покровская", "Кольцевая"],
                "Комсомольская": ["Сокольническая", "Кольцевая"],
                "Киевская": ["Арбатско-Покровская", "Кольцевая", "Филёвская"],
                "Парк культуры": ["Сокольническая", "Кольцевая"],
                "Театральная": ["Замоскворецкая", "Арбатско-Покровская"],
                "Павелецкая": ["Замоскворецкая", "Кольцевая"],
                "Курская": ["Арбатско-Покровская", "Кольцевая"],
                "Белорусская": ["Замоскворецкая", "Кольцевая"],
                "Новокузнецкая": ["Замоскворецкая", "Калининская"]
            },
            prices: {
                "разовый билет": 65,
                "билет на 2 поездки": 130, 
                "билет на 20 поездок": 800,
                "билет на 60 поездок": 1970,
                "безлимитный на месяц": 2900
            },
            schedule: {
                "открытие": "05:30",
                "закрытие": "01:00", 
                "интервал_часы_пик": "2-3 минуты",
                "intervals_normal": "5-7 минут"
            }
        };
    }

    getAllStationsList() {
        const stations = [];
        for (const lineName in this.metroData.lines) {
            stations.push(...this.metroData.lines[lineName].stations);
        }
        return [...new Set(stations)]; // Убираем дубликаты
    }

    findStationInMetro(stationName) {
        stationName = stationName.toLowerCase();
        for (const lineName in this.metroData.lines) {
            const stations = this.metroData.lines[lineName].stations;
            for (const station of stations) {
                if (station.toLowerCase().includes(stationName)) {
                    return { station: station, line: lineName };
                }
            }
        }
        return null;
    }

    findRouteBetweenStations(startStationName, endStationName) {
        const startInfo = this.findStationInMetro(startStationName);
        const endInfo = this.findStationInMetro(endStationName);
        
        if (!startInfo) {
            return `❌ Станция "${startStationName}" не найдена в метро`;
        }
        if (!endInfo) {
            return `❌ Станция "${endStationName}" не найдена в метро`;
        }

        return this.calculateRoute(startInfo, endInfo);
    }

    calculateRoute(startInfo, endInfo) {
        const startStation = startInfo.station;
        const endStation = endInfo.station;
        const startLine = startInfo.line;
        const endLine = endInfo.line;

        // Если станции на одной линии
        if (startLine === endLine) {
            return this.getRouteOnSameLine(startStation, endStation, startLine);
        } else {
            return this.getRouteWithTransfer(startStation, endStation, startLine, endLine);
        }
    }

    getRouteOnSameLine(startStation, endStation, lineName) {
        const stations = this.metroData.lines[lineName].stations;
        const startIdx = stations.indexOf(startStation);
        const endIdx = stations.indexOf(endStation);
        
        if (startIdx === -1 || endIdx === -1) {
            return "❌ Ошибка: станции не найдены на линии";
        }

        const stationCount = Math.abs(endIdx - startIdx);
        const travelTime = stationCount * 2;
        
        let routeStations, direction;
        if (startIdx < endIdx) {
            direction = "в сторону конечной станции";
            routeStations = stations.slice(startIdx, endIdx + 1);
        } else {
            direction = "в обратном направлении";
            routeStations = stations.slice(endIdx, startIdx + 1).reverse();
        }

        return `
🗺️ *Маршрут от ${startStation} до ${endStation}:*

📏 *Линия:* ${lineName} (${this.metroData.lines[lineName].color})
🧭 *Направление:* ${direction}
⏱️ *Время в пути:* ~${travelTime} минут
🚇 *Количество станций:* ${stationCount}

*Путь:*
${routeStations.join(' → ')}

💡 *Совет:* Выходите на станции ${endStation}
`;
    }

    getRouteWithTransfer(startStation, endStation, startLine, endLine) {
        // Находим станции пересадки между линиями
        const transferStations = this.findTransferStations(startLine, endLine);
        
        let transferInfo = "";
        if (transferStations.length > 0) {
            transferInfo = `\n🔄 *Станции пересадки:* ${transferStations.join(', ')}`;
        }

        // Оцениваем время и количество станций
        const startLineStations = this.metroData.lines[startLine].stations.length;
        const endLineStations = this.metroData.lines[endLine].stations.length;
        const estimatedStations = Math.min(startLineStations, endLineStations) + 5;
        const estimatedTime = estimatedStations * 2 + 10; // +10 минут на пересадку

        return `
🔄 *Маршрут с пересадкой:*

📍 *От:* ${startStation} (${startLine})
📍 *До:* ${endStation} (${endLine})
${transferInfo}

⏱️ *Примерное время:* ~${estimatedTime} минут
🚇 *Примерное количество станций:* ${estimatedStations}

*Примерный маршрут:*
1. Линия ${startLine} → Линия ${endLine}
2. Пересадка на станции ${transferStations.length > 0 ? transferStations[0] : 'согласно схеме метро'}

💡 *Рекомендация:* Используйте навигацию в метро для точного построения маршрута
`;
    }

    findTransferStations(line1, line2) {
        const transfers = [];
        for (const [station, lines] of Object.entries(this.metroData.transfers)) {
            if (lines.includes(line1) && lines.includes(line2)) {
                transfers.push(station);
            }
        }
        return transfers;
    }

    extractStationsFromText(text) {
        const foundStations = [];
        const words = text.toLowerCase().split(' ');
        
        for (const station of this.allStations) {
            const stationLower = station.toLowerCase();
            // Проверяем точное совпадение или частичное (для сокращенных названий)
            if (text.toLowerCase().includes(stationLower) || 
                words.some(word => stationLower.includes(word) && word.length > 3)) {
                foundStations.push(station);
            }
        }
        
        // Убираем дубликаты
        return [...new Set(foundStations)];
    }

    processQuestion(question) {
        question = question.toLowerCase().trim();
        
        // Приветствие
        if (this.containsAny(question, ["привет", "здравствуй", "hello", "начать"])) {
            return "Привет! Я Метроша, ваш помощник в московском метро! 🚇 Я могу помочь с маршрутами между любыми станциями, ценами на проезд и другой информацией. Чем могу помочь?";
        }
        
        // Цены
        if (this.containsAny(question, ["цена", "стоимость", "билет", "проезд", "сколько стоит"])) {
            return this.getPricesResponse();
        }
        
        // Время работы
        else if (this.containsAny(question, ["время", "работает", "открыт", "закрыт", "график", "расписание"])) {
            return this.getScheduleResponse();
        }
        
        // Маршруты
        else if (this.containsAny(question, ["как доехать", "маршрут", "добраться", "проехать", "как проехать"])) {
            return this.handleRouteQuestion(question);
        }
        
        // Станции
        else if (this.containsAny(question, ["станция", "где находится", "какая линия", "информация о станции"])) {
            return this.handleStationQuestion(question);
        }
        
        // Линии
        else if (this.containsAny(question, ["линия", "ветка", "сокольническая", "замоскворецкая", "арбатско", "кольцевая"])) {
            return this.handleLineQuestion(question);
        }

        // Поиск станции
        else if (this.containsAny(question, ["найди станцию", "есть станция", "ищи станцию"])) {
            return this.handleStationSearch(question);
        }
        
        // Помощь
        else if (this.containsAny(question, ["помощь", "help", "что ты умеешь"])) {
            return this.getHelp();
        }
        
        else {
            return this.getUnknownResponse();
        }
    }

    handleRouteQuestion(question) {
        const stations = this.extractStationsFromText(question);
        
        if (stations.length >= 2) {
            // Берем первые две найденные станции
            const startStation = stations[0];
            const endStation = stations[1];
            return this.findRouteBetweenStations(startStation, endStation);
        } else if (stations.length === 1) {
            return `🗺️ Указана только одна станция: "${stations[0]}". Пожалуйста, укажите станцию назначения. Например: "Как доехать от ${stations[0]} до [станция назначения]?"`;
        } else {
            return `🗺️ Не удалось найти названия станций в вашем вопросе. 

*Примеры запросов:*
• "Как доехать от Киевской до Комсомольской?"
• "Маршрут от Аэропорта до Парка культуры"
• "Как проехать от Сокольников до ВДНХ?"

*Доступные станции:* Все станции московского метро`;
        }
    }

    handleStationSearch(question) {
        const searchTerm = question.replace(/найди станцию|есть станция|ищи станцию/gi, '').trim();
        if (!searchTerm) {
            return "🔍 Укажите название станции для поиска. Например: 'Найди станцию Киевская'";
        }
        
        const found = this.findStationInMetro(searchTerm);
        if (found) {
            return this.getStationInfo(found.station, found.line);
        } else {
            const similar = this.allStations.filter(station => 
                station.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            if (similar.length > 0) {
                return `❌ Станция "${searchTerm}" не найдена. Возможно, вы имели в виду:\n${similar.map(s => `• ${s}`).join('\n')}`;
            } else {
                return `❌ Станция "${searchTerm}" не найдена в московском метро.`;
            }
        }
    }

    containsAny(text, words) {
        return words.some(word => text.includes(word));
    }

    getPricesResponse() {
        const prices = this.metroData.prices;
        let response = "💰 *Стоимость проезда в метро:*\n\n";
        for (const [ticket, price] of Object.entries(prices)) {
            response += `• ${ticket}: *${price} рублей*\n`;
        }
        response += "\n💡 *Также доступны льготные билеты для студентов, пенсионеров и детей*";
        return response;
    }

    getScheduleResponse() {
        const schedule = this.metroData.schedule;
        return `
⏰ *Режим работы метро:*

🟢 *Открытие:* ${schedule.открытие}
🔴 *Закрытие:* ${schedule.закрытие}

📊 *Интервалы движения:*
• В часы пик: ${schedule.интервал_часы_пик}
• В обычное время: ${schedule.intervals_normal}

💡 *Совет:* Старайтесь избегать поездок в часы пик с 8:00-10:00 и 17:00-19:00
`;
    }

    handleStationQuestion(question) {
        const stations = this.extractStationsFromText(question);
        if (stations.length > 0) {
            const stationInfo = this.findStationInMetro(stations[0]);
            if (stationInfo) {
                return this.getStationInfo(stationInfo.station, stationInfo.line);
            }
        }
        return "🚇 Укажите название станции. Например: 'Станция Киевская' или 'Информация о Комсомольской'";
    }

    handleLineQuestion(question) {
        if (question.includes("красн") || question.includes("сокольническ")) {
            return this.getLineInfo("Сокольническая");
        } else if (question.includes("зелен") || question.includes("замоскворецк")) {
            return this.getLineInfo("Замоскворецкая");
        } else if (question.includes("син") || question.includes("арбатск")) {
            return this.getLineInfo("Арбатско-Покровская");
        } else if (question.includes("кольцев")) {
            return this.getLineInfo("Кольцевая");
        } else {
            return this.getAllLines();
        }
    }

    getStationInfo(station, lineName) {
        const lineData = this.metroData.lines[lineName];
        const stations = lineData.stations;
        const idx = stations.indexOf(station);
        
        const prevStation = idx > 0 ? stations[idx-1] : "конечная";
        const nextStation = idx < stations.length-1 ? stations[idx+1] : "конечная";
        
        // Проверяем пересадки
        const transfers = this.metroData.transfers[station] || [];
        const transferInfo = transfers.length > 0 ? 
            `\n🔄 *Пересадки на:* ${transfers.join(', ')}` : 
            "\n🔄 *Пересадки:* нет";

        return `
🚇 *Станция ${station}*

📏 *Линия:* ${lineName} (${lineData.color})
📍 *Положение:* ${idx+1}-я из ${stations.length} станций
⬅️ *Предыдущая:* ${prevStation}
➡️ *Следующая:* ${nextStation}
⏰ *Время работы:* 05:30 - 01:00
${transferInfo}
`;
    }

    getLineInfo(lineName) {
        const lineData = this.metroData.lines[lineName];
        const stations = lineData.stations;
        
        let response = `📏 *Линия ${lineName}* (${lineData.color}) - *${stations.length} станций*\n\n`;
        response += `*Станции:*\n${stations.map((s, i) => `${i+1}. ${s}`).join('\n')}`;
        
        return response;
    }

    getAllLines() {
        let response = "🚇 *Линии метро:*\n\n";
        for (const [lineName, lineData] of Object.entries(this.metroData.lines)) {
            response += `• *${lineName}* (${lineData.color}) - ${lineData.stations.length} станций\n`;
        }
        response += "\n💡 Спросите подробнее о любой линии!";
        return response;
    }

    getHelp() {
        return `
🚇 *Я могу помочь с:*

🗺️ *Маршрутами между любыми станциями* - "как доехать от А до Б?"
💰 *Стоимостью проезда* - "сколько стоит билет?"
⏰ *Временем работы* - "когда открывается метро?"
🚇 *Информацией о станциях* - "станция Киевская"
📏 *Линиями метро* - "красная линия"
🔍 *Поиском станций* - "найди станцию Аэропорт"

*Примеры вопросов:*
• Как доехать от Аэропорта до Парка культуры?
• Маршрут от Сокольников до Комсомольской
• Сколько стоит проезд?
• Время работы метро
• Станция Киевская
• Какие есть линии метро?
• Найди станцию ВДНХ
`;
    }

    getUnknownResponse() {
        const responses = [
            "🤔 Не совсем понял ваш вопрос. Спросите о маршрутах, ценах или времени работы метро!",
            "🚇 Я специализируюсь на метро. Можете спросить о проезде, маршрутах между станциями или расписании?",
            "💡 Попробуйте спросить иначе. Например: 'Как доехать от А до Б?' или 'Сколько стоит билет?'",
            "📝 Не распознал вопрос. Я могу помочь с маршрутами между любыми станциями, ценами и временем работы метро."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Инициализация бота
const bot = new MetroBot();

// Элементы DOM
const chat = document.getElementById('chat');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const quickButtons = document.querySelectorAll('.quick-btn');

// Функции для работы с чатом
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const avatar = document.createElement('img');
    avatar.className = 'avatar';
    avatar.src = isUser ? 'user-avatar.png' : 'logo-metrhosha.png';
    avatar.alt = isUser ? 'Пользователь' : 'Метроша';
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.innerHTML = formatMessage(text);
    
    bubble.appendChild(textDiv);
    
    if (isUser) {
        messageContent.appendChild(bubble);
        messageContent.appendChild(avatar);
    } else {
        messageContent.appendChild(avatar);
        messageContent.appendChild(bubble);
    }
    
    messageDiv.appendChild(messageContent);
    chat.appendChild(messageDiv);
    scrollToBottom();
}

function formatMessage(text) {
    // Простое форматирование текста
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
               .replace(/\n/g, '<br>');
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typing-indicator';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const avatar = document.createElement('img');
    avatar.className = 'avatar';
    avatar.src = 'logo-metrhosha.png';
    avatar.alt = 'Метроша';
    
    const bubble = document.createElement('div');
    bubble.className = 'typing-indicator';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        bubble.appendChild(dot);
    }
    
    messageContent.appendChild(avatar);
    messageContent.appendChild(bubble);
    typingDiv.appendChild(messageContent);
    chat.appendChild(typingDiv);
    scrollToBottom();
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function scrollToBottom() {
    chat.scrollTop = chat.scrollHeight;
}

function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;
    
    // Добавляем сообщение пользователя
    addMessage(text, true);
    messageInput.value = '';
    
    // Показываем индикатор набора
    showTypingIndicator();
    
    // Имитируем задержку ответа
    setTimeout(() => {
        hideTypingIndicator();
        const response = bot.processQuestion(text);
        addMessage(response, false);
    }, 1000 + Math.random() * 1000);
}

// Обработчики событий
sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Быстрые кнопки
quickButtons.forEach(button => {
    button.addEventListener('click', () => {
        const question = button.getAttribute('data-question');
        messageInput.value = question;
        sendMessage();
    });
});

// Фокус на поле ввода при загрузке
messageInput.focus();

// Добавляем подсказку при фокусе
messageInput.addEventListener('focus', () => {
    messageInput.placeholder = "Например: как доехать от Аэропорта до Парка культуры...";
});

messageInput.addEventListener('blur', () => {
    messageInput.placeholder = "Введите ваш вопрос...";
});