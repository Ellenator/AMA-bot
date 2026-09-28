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
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function getMessages() {
    const response = await fetch(`${API_URL}/messages`);
    const messages = await response.json();
    for (const message of messages) {
        displayMessage(message);
    }
}

getMessages();

questionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const question = questionInput.value.trim();

    if (!question) return; //ny ift. fejlhåndtering

    const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
    });

    if (response.ok) {
      const [userMessage, botMessage] = await response.json();

      displayMessage(userMessage);
      displayMessage(botMessage);
    }

    //const data = await response.json(); -> udkommenteret ift. fejlhåndtering

    questionInput.value = "";
});

clearMessagesButton.addEventListener("click", async () => {
  await fetch(`${API_URL}/messages`, { method: "DELETE" });
  messagesContainer.innerHTML = ""
});