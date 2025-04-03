const API_URL = 'https://api.green-api.com';
let idInstance, apiTokenInstance;

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Получаем элементы управления
    const apiButtons = document.querySelectorAll('.api-btn');
    const actionButtons = document.querySelectorAll('.action-btn');
    
    // Инициализация обработчиков
    apiButtons.forEach(btn => {
        btn.addEventListener('click', handleApiCall);
    });
    
    actionButtons.forEach(btn => {
        btn.addEventListener('click', handleAction);
    });

    // Сохранение элементов ввода
    idInstance = document.getElementById('idInstance');
    apiTokenInstance = document.getElementById('apiTokenInstance');
}

function handleApiCall(e) {
    const method = e.target.dataset.method;
    validateCredentials() && callApi(method);
}

function handleAction(e) {
    const action = e.target.dataset.action;
    validateCredentials() && window[action]();
}

function validateCredentials() {
    if (!idInstance.value || !apiTokenInstance.value) {
        alert('Заполните idInstance и ApiTokenInstance');
        return false;
    }
    return true;
}

async function callApi(method) {
    try {
        const response = await fetch(
            `${API_URL}/waInstance${idInstance.value}/${method}/${apiTokenInstance.value}`
        );
        updateResponse(await response.text());
    } catch (e) {
        updateResponse(JSON.stringify({ error: e.message }));
    }
}

async function sendMessage() {
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    if (!validatePhoneMessage(phone, message)) return;

    try {
        const response = await fetch(
            `${API_URL}/waInstance${idInstance.value}/sendMessage/${apiTokenInstance.value}`, 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatId: `${phone}@c.us`,
                    message: message
                })
            }
        );
        updateResponse(await response.text());
    } catch (e) {
        updateResponse(JSON.stringify({ error: e.message }));
    }
}

async function sendFileByUrl() {
    const phone = document.getElementById('phoneFile').value;
    const fileUrl = document.getElementById('fileUrl').value;

    if (!validateFileInputs(phone, fileUrl)) return;

    try {
        const response = await fetch(
            `${API_URL}/waInstance${idInstance.value}/sendFileByUrl/${apiTokenInstance.value}`, 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatId: `${phone}@c.us`,
                    urlFile: fileUrl,
                    fileName: fileUrl.split('/').pop()
                })
            }
        );
        updateResponse(await response.text());
    } catch (e) {
        updateResponse(JSON.stringify({ error: e.message }));
    }
}

function validatePhoneMessage(phone, message) {
    if (!phone || !message) {
        alert('Заполните номер и сообщение');
        return false;
    }
    return true;
}

function validateFileInputs(phone, url) {
    if (!phone || !url) {
        alert('Заполните номер и URL файла');
        return false;
    }
    return true;
}

function updateResponse(text) {
    try {
        document.getElementById('response').value = JSON.stringify(JSON.parse(text), null, 2);
    } catch {
        document.getElementById('response').value = text;
    }
}
