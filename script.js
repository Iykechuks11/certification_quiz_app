document.addEventListener('DOMContentLoaded', function () {
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0; // Initialize score

    const questionEl = document.getElementById('question');
    const optionsEl = document.getElementById('options');
    const feedbackEl = document.getElementById('feedback');
    const nextButton = document.getElementById('next');
    const startButton = document.getElementById('start');

    // Initially hide elements
    questionEl.style.display = 'none';
    optionsEl.style.display = 'none';
    nextButton.style.display = 'none';
    feedbackEl.style.display = 'none';

    // Fetch questions from the GitHub Gist
    function fetchQuestions() {
        const questionsUrl = 'questions.json'; // Path to the local JSON file
        fetch(questionsUrl)
            .then(response => response.json())
            .then(data => {
                questions = data;
                startButton.disabled = false; // Enable start button after questions are loaded
            })
            .catch(error => {
                console.error('Error loading questions:', error);
                feedbackEl.style.display = 'block';
                feedbackEl.textContent = 'Failed to load questions.';
                feedbackEl.className = 'incorrect';
            });
    }


    // Show the current question
    function displayQuestion() {
        if (currentQuestionIndex < questions.length) {
            const currentQuestion = questions[currentQuestionIndex];
            questionEl.innerHTML = currentQuestion.question;
            optionsEl.innerHTML = '';

            currentQuestion.options.forEach((option, index) => {
                const li = document.createElement('li');
                li.textContent = option;
                li.addEventListener('click', () => checkAnswer(index));
                optionsEl.appendChild(li);
            });

            // Update display
            questionEl.style.display = 'block';
            optionsEl.style.display = 'block';
            feedbackEl.style.display = 'none'; // Hide feedback until answer is chosen
            nextButton.style.display = 'none'; // Hide next button until answer is correct
        } else {
            // Quiz is over
            questionEl.style.display = 'none';
            optionsEl.style.display = 'none';
            nextButton.style.display = 'none';
            feedbackEl.style.display = 'block';
            feedbackEl.textContent = `Quiz finished! Your score: ${score}/${questions.length}`;
            feedbackEl.className = '';
            startButton.textContent = 'Restart Quiz';
            startButton.style.display = 'block';
            currentQuestionIndex = 0; // Reset for restart
            score = 0; // Reset score
        }
    }

    // Check if the selected answer is correct
    function checkAnswer(selectedIndex) {
        let correctIndex;
        const currentQuestion = questions[currentQuestionIndex];

        // Determine if the question is True/False and adjust the correctIndex accordingly
        if (currentQuestion.options.length === 2 && currentQuestion.options.includes("True") && currentQuestion.options.includes("False")) {
            // True/False question
            correctIndex = currentQuestion.correct_answer === "True" ? 0 : 1;
        } else {
            // Multiple-choice question
            correctIndex = currentQuestion.correct_answer.charCodeAt(0) - 'A'.charCodeAt(0);
        }

        if (selectedIndex === correctIndex) {
            score++; // Increment score for correct answer
            feedbackEl.textContent = 'Correct!';
            feedbackEl.className = 'correct';
        } else {
            feedbackEl.textContent = 'Incorrect. Try again!';
            feedbackEl.className = 'incorrect';
        }
        feedbackEl.style.display = 'block';
        nextButton.style.display = 'block'; // Show next button
    }


    // Start the quiz
    startButton.addEventListener('click', function () {
        startButton.style.display = 'none'; // Hide start button
        displayQuestion();
    });

    // Move to the next question
    nextButton.addEventListener('click', function () {
        currentQuestionIndex++;
        displayQuestion();
    });

    fetchQuestions(); // Load questions when the document is ready
});
