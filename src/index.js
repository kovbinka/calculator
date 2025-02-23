// read elements by ID and initialize new variables to future use
const display = document.getElementById('display-result');
const buttons = document.getElementById('buttons');
const cleanSound = document.getElementById('clean-fx');
const errorSound = document.getElementById('error-fx');
const deleteSound = document.getElementById('del-fx');
const equalSound = document.getElementById('equal-fx');

// add class to `ai-container`
const aiContainer = document.getElementById('ai-container');
aiContainer.classList.add('ai-container');

// add class to `header`
const header = document.getElementById('header');
header.classList.add('design');

// create video-element with some properties
const videoAdd = document.createElement('video');
videoAdd.classList.add('video');
videoAdd.autoplay = true;
videoAdd.muted = true;
videoAdd.loop = true;
// create src for video
const videoSrc = document.createElement('source');
videoSrc.setAttribute('src', './media/background.mp4'); // src
videoSrc.setAttribute('type', 'video/mp4'); // type

videoAdd.appendChild(videoSrc);
header.appendChild(videoAdd);

// add `h1` to `header`
const h1 = document.createElement('h1');
h1.innerText = 'CALCULATOR';
header.append(h1);

// create the array with values for the future buttons
const data = [
    ['C🗑️', 'Del', '%', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
];

// create a div's for each row in the array
data.forEach((row) => {
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    row.forEach((buttonData) => {
        const btn = document.createElement('button');
        btn.classList.add('btn');
        btn.innerText = buttonData;

        if (buttonData === '=') {
            btn.classList.add('equal');
        }

        if (buttonData === 'C🗑️') {
            btn.classList.add('cleaning');
        }

        if (buttonData === '-' || buttonData === 'Del') {
            btn.classList.add('minus');
        }

        if (buttonData === '+') {
            btn.classList.add('plus');
        }

        if (buttonData === '/' || buttonData === '%' || buttonData === '*') {
            btn.classList.add('divide');
        }

        btn.addEventListener('click', () => {
            clickHandler(buttonData);
        });
        rowElement.append(btn);
    });

    buttons.append(rowElement);
});

const aiButton = document.createElement('button');
aiButton.innerText = 'AI Assistant';
aiButton.classList.add('ai-btn');
aiButton.addEventListener('click', () => {
    createModal();
    openModal();
});
aiContainer.appendChild(aiButton);

function createModal() {
    const modal = document.createElement('div');
    modal.id = 'ai-modal';
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const closeBtn = document.createElement('span');
    closeBtn.classList.add('close');
    closeBtn.innerText = '×';
    closeBtn.onclick = closeModal;

    const title = document.createElement('h3');
    title.innerText = 'How can i help you?🤖';

    const input = document.createElement('textarea');
    input.id = 'ai-input';
    input.placeholder = 'Do not know how to calculate the radius? Just ask me here!';

    const submitBtn = document.createElement('button');
    submitBtn.classList.add('ai-send-button');
    submitBtn.innerText = 'Send';
    submitBtn.onclick = askAI;

    const response = document.createElement('div');
    response.id = 'ai-response';
    response.innerText = 'Response will appear here...';

    modalContent.append(closeBtn, title, input, submitBtn, response);
    modal.append(modalContent);
    aiContainer.appendChild(modal);
}

function openModal() {
    document.getElementById('ai-modal').style.display = 'flex';
    aiButton.style.display = 'none';
}

function closeModal() {
    aiButton.style.display = 'flex';
    const modal = document.getElementById('ai-modal');
    if (modal) {
        modal.remove(); // delete modal window after closing
    }
}

async function askAI() {
    const input = document.getElementById('ai-input').value;
    const responseDiv = document.getElementById('ai-response');
    
    responseDiv.innerText = 'Loading...';

    try {
        const response = await fetch('https://api.together.xyz/inference', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer mykey', // API KEY
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
                prompt: input,
                max_tokens: 100,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw response:', data); //
        responseDiv.innerText = data.output?.choices[0]?.text || 'Sorry, I can’t answer that.';
    } catch (error) {
        responseDiv.innerText = 'Error: ' + error.message;
        console.error('Fetch error:', error);
    }
}

let result = '';

function clickHandler(buttonData) {
    if (buttonData === 'C🗑️') {
        result = '';
        display.innerText = result;
        cleanSound.volume = 0.4;
        cleanSound.play();
        return;
    }

    if (buttonData === 'Del') {
        delData();
        deleteSound.volume = 0.4;
        deleteSound.play();
        return;
    }

    if (buttonData === '=') {
        try {
            result = eval(result).toString();
            equalSound.volume = 0.43;
            equalSound.play();
        } catch (e) {
            errorSound.volume = 0.14;
            errorSound.play();
            result = 'try again😱';
        }
        display.innerText = result;
        return;
    }

    if (result === 'try again😱') {
        result = '';
    }

    result += buttonData;
    display.innerText = result;
}

function delData() {
    if (result.length > 0 && result !== 'try again😱') {
        result = result.slice(0, -1);
        display.innerText = result;
    }
}
