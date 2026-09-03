const QUESTIONS_PER_QUIZ = 50; // Покажем 50 случайных вопросов из базы

// Курс определяется параметром ?course= в ссылке (по умолчанию — Kompüter operatoru)
const COURSE_TESTS = {
    helpdesk: './data/helpdesk-tests.json',
    operator: './data/operator-tests.json',
    illustrator: './data/illustrator-tests.json',
    photoshop: './data/photoshop-tests.json',
    coreldraw: './data/coreldraw-tests.json'
};
const urlParams = new URLSearchParams(window.location.search);
const course = urlParams.get('course') || 'operator';
const DATA_URL = COURSE_TESTS[course] || COURSE_TESTS.operator;

let allQuestions = [];
let currentQuizData = [];
let currentQuestionIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let skippedCount = 0;
let hasAnswered = false;

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");
const skipBtn = document.getElementById("skip-btn");
const finishBtn = document.getElementById("finish-btn");
const progressText = document.querySelector(".progress-text");
const progressFill = document.querySelector(".progress-fill");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.querySelector(".result-screen");
const scoreDisplay = document.querySelector(".score-circle");
const feedbackText = document.querySelector(".feedback");
const statCorrect = document.getElementById("stat-correct");
const statWrong = document.getElementById("stat-wrong");
const statSkipped = document.getElementById("stat-skipped");

async function initQuiz() {
    try {
        const response = await fetch(DATA_URL);
        allQuestions = await response.json();
        selectRandomQuestions();
        loadQuestion();
    } catch (error) {
        questionText.innerText = "Xəta: Suallar yüklənmədi. İnternet bağlantınızı yoxlayın.";
        console.error("Ошибка:", error);
    }
}

function selectRandomQuestions() {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    currentQuizData = shuffled.slice(0, QUESTIONS_PER_QUIZ);
}

function loadQuestion() {
    hasAnswered = false;
    nextBtn.disabled = true;
    nextBtn.innerText = "Növbəti Sual";
    skipBtn.disabled = false;
    skipBtn.style.display = "inline-block";

    const currentData = currentQuizData[currentQuestionIndex];
    questionText.innerText = currentData.question;

    progressText.innerText = `Sual ${currentQuestionIndex + 1} / ${QUESTIONS_PER_QUIZ}`;
    progressFill.style.width = `${((currentQuestionIndex + 1) / QUESTIONS_PER_QUIZ) * 100}%`;

    optionsContainer.innerHTML = "";

    currentData.options.forEach((option, index) => {
        const button = document.createElement("div");
        button.classList.add("option");
        button.innerText = option;
        button.onclick = () => selectAnswer(index, button);
        optionsContainer.appendChild(button);
    });
}

function selectAnswer(selectedIndex, selectedButton) {
    if (hasAnswered) return;
    hasAnswered = true;
    nextBtn.disabled = false;
    skipBtn.style.display = "none"; // artıq cavab verilib, keçməyə ehtiyac yoxdur

    const currentData = currentQuizData[currentQuestionIndex];
    const allOptionsButtons = optionsContainer.children;

    if (selectedIndex === currentData.correct) {
        selectedButton.classList.add("correct");
        correctCount++;
    } else {
        selectedButton.classList.add("wrong");
        allOptionsButtons[currentData.correct].classList.add("correct");
        wrongCount++;
    }

    if (currentQuestionIndex === QUESTIONS_PER_QUIZ - 1) {
        nextBtn.innerText = "Nəticəni Göstər";
    }
}

function goToNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < QUESTIONS_PER_QUIZ) {
        loadQuestion();
    } else {
        showResult();
    }
}

nextBtn.addEventListener("click", goToNextQuestion);

skipBtn.addEventListener("click", () => {
    if (hasAnswered) return;
    skippedCount++;
    goToNextQuestion();
});

finishBtn.addEventListener("click", () => {
    // Cari sual hələ cavablanmayıbsa, sadəcə nəticəyə keçirik — onu hesaba qatmırıq
    showResult();
});

function showResult() {
    quizScreen.style.display = "none";
    resultScreen.style.display = "block";

    const attempted = correctCount + wrongCount + skippedCount;
    scoreDisplay.innerText = `${correctCount}/${attempted}`;

    statCorrect.innerText = correctCount;
    statWrong.innerText = wrongCount;
    statSkipped.innerText = skippedCount;

    if (attempted === 0) {
        feedbackText.innerText = "Heç bir suala cavab vermədiniz.";
        return;
    }

    const answered = correctCount + wrongCount;
    if (answered === 0) {
        feedbackText.innerText = "Bütün sualları keçdiniz — cavab vermədən nəticə qiymətləndirilə bilməz.";
        return;
    }

    const percentage = correctCount / answered;
    if (percentage === 1) {
        feedbackText.innerText = "Əla nəticə! Mövzunu tam mənimsəmisiniz.";
    } else if (percentage >= 0.7) {
        feedbackText.innerText = "Yaxşı nəticə! Bir neçə mövzunu təkrar etsəniz daha da yaxşı olar.";
    } else {
        feedbackText.innerText = "Təəssüf ki, bəzi səhvləriniz var. Dərsləri yenidən oxumağınız məsləhətdir.";
    }
}

initQuiz();
