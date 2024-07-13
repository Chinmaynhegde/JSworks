const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const startButton = document.getElementById("start-btn");
const categorySelect = document.getElementById("category");
const difficultySelect = document.getElementById("difficulty");

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

const apiKey = '7hQQIZS3ZEB3Xq9vligQES2x759JmIZmj1rDeHYg';

async function fetchQuestions(category, difficulty) {
    try {
        let apiUrl = `https://quizapi.io/api/v1/questions?apiKey=${apiKey}&limit=10`;
        if (category !== 'random') {
            apiUrl += `&category=${category}`;
        }
        if (difficulty !== 'random') {
            apiUrl += `&difficulty=${difficulty}`;
        }
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log('API response:', data); // Log the API response
        questions = data.map(item => ({
            question: item.question,
            answers: [
                { text: item.answers.answer_a, correct: item.correct_answers.answer_a_correct === "true" },
                { text: item.answers.answer_b, correct: item.correct_answers.answer_b_correct === "true" },
                { text: item.answers.answer_c, correct: item.correct_answers.answer_c_correct === "true" },
                { text: item.answers.answer_d, correct: item.correct_answers.answer_d_correct === "true" },
                { text: item.answers.answer_e, correct: item.correct_answers.answer_e_correct === "true" },
                { text: item.answers.answer_f, correct: item.correct_answers.answer_f_correct === "true" }
            ].filter(answer => answer.text !== null)
        }));
        showQuestion();
    } catch (error) {
        console.error("Failed to fetch questions", error);
    }
}

function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    const selectedCategory = categorySelect.value;
    const selectedDifficulty = difficultySelect.value;
    fetchQuestions(selectedCategory, selectedDifficulty); // Fetch new questions based on selections
}

function showQuestion(){
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetState(){
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e){
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

function showScore(){
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
}

function handleNextButton(){
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});

startButton.addEventListener("click", startQuiz);
