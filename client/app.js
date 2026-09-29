const messagesContainer = document.querySelector("#messages");
const questionForm = document.querySelector("#question-form");
const questionInput = document.querySelector("#question");
const clearMessagesButton = document.querySelector("#clear-messages-button");
const API_URL = "http://localhost:3000";

function displayMessage(message) {
  let html = /*html*/ `
    <article class="${message.type}">
      <p>${message.text}</p>`;

  // Hvis beskeden har klikbare muligheder/knapper
  if (message.options && message.options.length > 0) {
    html += `<div class="options-container">`;
    for (const option of message.options) {
      html += `<button type="button" class="option-btn">${option}</button>`;
    }
    html += `</div>`;
  }

  html += `</article>`;

  messagesContainer.insertAdjacentHTML("beforeend", html);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

//evenntlistener der fanger klik på option knapperne
messagesContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("option-btn")) {
    const selectedQuestion = event.target.textContent;
    
    questionInput.value = selectedQuestion;
    questionForm.dispatchEvent(new Event("submit"));
  }
});

//hjælpefuntion til visning af visuelle fejl i chatten
function displayErrorMessage(errorText) {
  const html = /*html*/ `
  <article class="error-message">
    <strong>ERROR!</strong>
    <p>${errorText}</p>
  </article>`;

  messagesContainer.insertAdjacentHTML("beforeend", html);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function getMessages() {
  try {
    if (!navigator.onLine) {
      throw new Error("Ingen internetforbindelse");
    }

    const response = await fetch(`${API_URL}/messages`);

    if (!response.ok) {
      throw new Error(`Kunne ikke hente beskeder (Status ${response.status})`);
    }
    
    const messages = await response.json();
    for (const message of messages) {
        displayMessage(message);
    }
} catch (error) {
  console.error("Fejl i getMessages:", error);
  displayErrorMessage("Kunne ikke forbinde til serveren for at hente beskeder");
  }
}

getMessages();

questionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const question = questionInput.value.trim();
    if (!question) return;

    try {
      if (!navigator.onLine) {
        throw new Error("Ingen internet forbindelse");
      }

    const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
    });

    if (!response.ok) {
      throw new Error(`Serverfejl ved afsendelse (Status ${response.status})`);
    }

    const [userMessage, botMessage] = await response.json();

    displayMessage(userMessage);
    displayMessage(botMessage);

  questionInput.value = "";
} catch (error) {
  console.error("Fejl ved afsendelse af besked:", error);
  displayErrorMessage("Der op en fejl. Kunne ikke sende din besked. Tjek din forbindelse eller at serveren kører");
  }
});

clearMessagesButton.addEventListener("click", async () => {
  try {
    if (!navigator.onLine) {
      throw new Error("Ingen internetforbindelse");
    }

  const response = await fetch(`${API_URL}/messages`, { method: "DELETE" });
  
  if (response.ok) {
  messagesContainer.innerHTML = "";
  } else {
    throw new Error(`Fejl ved sletning (Status ${response.status})`);
  }
} catch (error) {
    console.error("Fejl ved rydning af chat", error);
    displayErrorMessage("Kunne ikke rydde chatten i øjeblikket");
  }
});