// creating modal-window
function createModal() {
  const aiContainer = document.getElementById('ai-container');

  // create main container for window with AI-assistant
  const modal = document.createElement('div');
  modal.id = 'ai-modal';
  modal.classList.add('modal');

  // create div with class to insert new elements
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  // create exit-button with span helping // add a class
  const closeBtn = document.createElement('span');
  closeBtn.classList.add('close');
  closeBtn.innerText = '×';
  closeBtn.onclick = closeModal;

  // create text with h3
  const title = document.createElement('h3');
  title.innerText = 'How can I help you?🤖';

  // create text area for input
  const input = document.createElement('textarea'); // user can input some question
  input.id = 'ai-input';
  input.placeholder = 'Do not know how to calculate the radius? Just ask me here!';

  // create button to send the request
  const submitBtn = document.createElement('button');
  submitBtn.classList.add('ai-send-button');
  submitBtn.innerText = 'ASK ME!';
  submitBtn.onclick = askAI;

  // place where will be the answer from AI
  const response = document.createElement('div');
  response.id = 'ai-response';
  response.innerText = 'Response will appear here...';

  // append the elements to the modalContent div
  modalContent.append(closeBtn, title, input, submitBtn, response);

  // append the modalContent div to main modal-window container
  modal.append(modalContent);
  aiContainer.appendChild(modal);
}

// open modal window // IMPORT TO index.js
function openModal() {
  const aiButton = document.querySelector('.ai-btn');
  document.getElementById('ai-modal').style.display = 'flex';
  aiButton.style.display = 'none';
}

// close modal window // IMPORT TO index.js
function closeModal() {
  const aiButton = document.querySelector('.ai-btn');
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
      const response = await fetch('/.netlify/functions/ask-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input })
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      responseDiv.innerText = data.answer;
  } catch (error) {
      responseDiv.innerText = 'Error: ' + error.message;
  }
}

// export function for using in calculator.js
export { createModal, openModal, closeModal, askAI };