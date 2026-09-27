const messagesContainer = document.querySelector("#messages");
const questionForm = document.querySelector("#question-form");
const questionInput = document.querySelector("#question");
const clearMessagesButton = document.querySelector("#clear-messages-button");
const API_URL = "http://localhost:3000";

function displayMessage(message) {
  const html = /*html*/ `
    <article class="${message.type}">
      <p>${message.text}</p>
    </article>`;

    messagesContainer.insertAdjacentHTML("beforeend", html);
}

async function getMessages() {
    const response = await fetch(`${API_URL}/messages`);
    const messages = await response.json();

    for (const message of messages) {
        displayMessage(message);
    }
}

getMessages();
