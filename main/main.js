const button = document.getElementById("btn");
const main = document.getElementById("root");
const url = "file.json";
let restartBtn;
let Timeout;

main.className = "container text-center my-5";
button.className = "btn btn-primary btn-lg mt-3";

const message = createPageElement(
  main,
  "div",
  `Good luck!`,
  "alert alert-info"
);
const output = createPageElement(main, "div", "", "game mt-4");
output.style.display = "none";

button.onclick = loadData;

function createPageElement(parent, type, html, className) {
  const element = document.createElement(type);
  element.innerHTML = html;
  if (className) element.className = `mb-3 ${className}`;
  parent.appendChild(element);
  return element;
}

function loadData() {
  toggleButtonVisibility(button, "none");

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const gameData = {
        total: data.length,
        q: data,
        score: 0,
        counter: 0,
      };
      startGame(gameData);
    })
    .catch((err) => {
      console.error(err);
      handleError("Failed to load the page. Please try again later! 😫");
    });
}

function startGame(gameData) {
  showMessage(
    `Question ${gameData.counter + 1} of ${gameData.total}`,
    "alert alert-primary"
  );
  output.style.display = "block";
  showNextQuestion(gameData);
}

function showNextQuestion(gameData) {
  if (gameData.q.length === 0) {
    gameOver(gameData);
    return;
  }

  const question = gameData.q.shift();
  gameData.counter++;
  showMessage(
    `Question ${gameData.counter} of ${gameData.total}`,
    "alert alert-primary"
  );
  output.innerHTML = "";
  renderQuestion(question, gameData);
}

function renderQuestion(question, gameData) {
  createPageElement(output, "h2", question.question, "question");

  const options = [...question.options, question.answer];
  options.sort(() => Math.random() - 0.5);

  const optionButtons = createPageElement(output, "div", "", "options");
  options.forEach((option) => {
    const optionBtn = createPageElement(
      optionButtons,
      "button",
      option,
      "btn btn-outline-primary"
    );
    optionBtn.onclick = () => handleAnswerSelection(option, question, gameData);
  });
}

function handleAnswerSelection(selectedOption, question, gameData) {
  const isCorrect = selectedOption === question.answer;
  if (isCorrect) {
    gameData.score++;
    showMessage(
      "Congratulations! You answered correctly 💪",
      "alert alert-success"
    );
  } else {
    showMessage(
      `Wrong answer 😢 The correct answer was: <strong>${question.answer}</strong>`,
      "alert alert-danger"
    );
  }

  disableOptionButtons();
  setTimeout(() => showNextQuestion(gameData), 2000);
}

function disableOptionButtons() {
  const buttons = output.querySelectorAll(".btn-outline-primary");
  buttons.forEach((btn) => (btn.disabled = true));
}

function gameOver(gameData) {
  showMessage(
    `Game Over! You scored ${gameData.score} out of ${gameData.total} questions.`,
    "alert alert-warning"
  );
  output.innerHTML = "";

  if (!restartBtn) {
    restartBtn = createPageElement(
      main,
      "button",
      "Restart",
      "btn btn-success mt-3"
    );
    restartBtn.onclick = restartGame;
  }
  toggleButtonVisibility(restartBtn, "inline-block");
}

function restartGame() {
  showMessage("Press Start button", "alert alert-info");
  output.innerHTML = "";
  toggleButtonVisibility(button, "inline-block");
  toggleButtonVisibility(restartBtn, "none");
  button.onclick = loadData;
}

function toggleButtonVisibility(button, displayValue) {
  button.style.display = displayValue;
}

function showMessage(text, className) {
  message.className = className;
  message.innerHTML = text;
}

function handleError(errorText) {
  console.error("Error:", errorText);
  showMessage(errorText, "alert alert-danger");
}
