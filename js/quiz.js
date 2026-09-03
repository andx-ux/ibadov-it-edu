const QUESTIONS_PER_QUIZ = 2; // Покажем 2 случайных вопроса

// Курс определяется параметром ?course= в ссылке (по умолчанию — Kompüter operatoru)
const COURSE_TESTS = {
    operator: './data/operator-tests.json'
};
const urlParams = new URLSearchParams(window.location.search);
const course = urlParams.get('course') || 'operator';
const DATA_URL = COURSE_TESTS[course] || COURSE_TESTS.operator;

let allQuestions = []; 
let currentQuizData = []; 
let currentQuestionIndex = 0;
let score = 0;
let hasAnswered = false;

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");
const progressText = document.querySelector(".progress-text");
const progressFill = document.querySelector(".progress-fill");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.querySelector(".result-screen");
const scoreDisplay = document.querySelector(".score-circle");
const feedbackText = document.querySelector(".feedback");

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

    const currentData = currentQuizData[currentQuestionIndex];
    const allOptionsButtons = optionsContainer.children;

    if (selectedIndex === currentData.correct) {
        selectedButton.classList.add("correct");
        score++;
    } else {
        selectedButton.classList.add("wrong");
        allOptionsButtons[currentData.correct].classList.add("correct");
    }
    
    if (currentQuestionIndex === QUESTIONS_PER_QUIZ - 1) {
        nextBtn.innerText = "Nəticəni Göstər";
    }
}

nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < QUESTIONS_PER_QUIZ) {
        loadQuestion(); 
    } else {
        showResult(); 
    }
});

function showResult() {
    quizScreen.style.display = "none";
    resultScreen.style.display = "block";
    
    scoreDisplay.innerText = `${score}/${QUESTIONS_PER_QUIZ}`;
    
    const percentage = score / QUESTIONS_PER_QUIZ;
    if (percentage === 1) {
        feedbackText.innerText = "Əla nəticə! Mövzunu tam mənimsəmisiniz.";
    } else {
        feedbackText.innerText = "Təəssüf ki, bəzi səhvləriniz var. Dərsləri yenidən oxumağınız məsləhətdir.";
    }
}

initQuiz();