document.addEventListener("DOMContentLoaded", async () => {
  const quizQuestion = document.getElementById("quiz-question");
  const quizOptions = document.getElementById("quiz-options");
  const nextButton = document.getElementById("next-question");
  const progressBar = document.getElementById("progress-bar");
  const resetButton = document.getElementById("reset-progress");
  const newsList = document.getElementById("news-list");
  const resourcesList = document.getElementById("resources-list");

  let correctAnswersCount = JSON.parse(localStorage.getItem("correctAnswersCount")) || 0;
  const totalQuestionsTarget = 5;

  const loadQuiz = async () => {
    try {
      const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");
      const data = await response.json();
      const questionData = data.results[0];
      const question = questionData.question;
      const correctAnswer = questionData.correct_answer;
      const allOptions = [...questionData.incorrect_answers, correctAnswer].sort(() => Math.random() - 0.5);

      quizQuestion.innerHTML = question;
      quizOptions.innerHTML = "";

      allOptions.forEach((option) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("quiz-option-button");
        button.onclick = () => checkAnswer(option, correctAnswer, button);
        quizOptions.appendChild(button);
      });

      nextButton.disabled = true;
    } catch (error) {
      quizQuestion.innerText = "Failed to load quiz. Please refresh.";
    }
  };

  const checkAnswer = (selected, correct, button) => {
    button.style.backgroundColor = selected === correct ? "#4CAF50" : "#f44336";
    if (selected === correct) {
      correctAnswersCount++;
      localStorage.setItem("correctAnswersCount", JSON.stringify(correctAnswersCount));
    }
    updateProgressBar();
    nextButton.disabled = false;
  };

  const updateProgressBar = () => {
    const progressPercentage = (correctAnswersCount / totalQuestionsTarget) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.innerText = `${Math.round(progressPercentage)}%`;

    if (correctAnswersCount >= totalQuestionsTarget) {
      alert("🎉 Congratulations! You've completed the quiz challenge!");
    }
  };

  nextButton.addEventListener("click", () => {
    nextButton.disabled = true;
    loadQuiz();
  });

  resetButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset your progress?")) {
      correctAnswersCount = 0;
      localStorage.setItem("correctAnswersCount", JSON.stringify(correctAnswersCount));
      updateProgressBar();
      alert("Progress has been reset.");
    }
  });

  const loadProgressBar = () => {
    updateProgressBar();
  };

  const loadEducationalNews = async () => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=education&apiKey=843036bb90564047aaefd9544edc6fc7`
      );
      const data = await response.json();

      newsList.innerHTML = "";
      data.articles.slice(0, 5).forEach((article) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
        newsList.appendChild(li);
      });
    } catch (error) {
      newsList.innerHTML = "<li>Failed to load news. Please refresh.</li>";
    }
  };

  const loadQuotes = async () => {
    try {
      const response = await fetch("https://api.quotable.io/quotes?limit=5");
      const data = await response.json();

      resourcesList.innerHTML = "";
      data.results.forEach((quote) => {
        const li = document.createElement("li");
        li.innerText = `"${quote.content}" — ${quote.author}`;
        resourcesList.appendChild(li);
      });
    } catch (error) {
      resourcesList.innerHTML = "<li>Failed to load quotes. Please refresh.</li>";
    }
  };

  await loadQuiz();
  loadProgressBar();
  await loadEducationalNews();
  await loadQuotes();
});
