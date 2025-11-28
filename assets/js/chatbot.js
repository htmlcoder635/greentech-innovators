const messagesEl = document.getElementById('messages');
const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');

// Set your backend URL here (deployed server).
const BACKEND_URL = "https://greentech-api-njl1.onrender.com/chat";

function addMessage(text, cls='bot') {
  const div = document.createElement('div');
  div.className = 'message ' + (cls === 'user' ? 'user' : 'bot');
  div.innerText = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const q = input.value.trim();
  if(!q) return;
  addMessage(q, 'user');
  input.value = '';
  addMessage('Thinking...', 'bot');
  try {
    const res = await fetch(BACKEND_URL, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ question: q })
    });
    const data = await res.json();
    // remove 'Thinking...' placeholder
    const lastBot = messagesEl.querySelectorAll('.bot');
    if (lastBot.length) lastBot[lastBot.length-1].remove();
    if(data.answer) addMessage(data.answer, 'bot');
    else if(data.error) addMessage('Error: ' + data.error, 'bot');
    else addMessage('Sorry — no answer available.', 'bot');
  } catch(err) {
    addMessage('Error contacting the chatbot: ' + err.message, 'bot');
  }
});
