import React, { useState, useEffect } from 'react';
import Question from './components/Question';
import './App.css';

const questionsData = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "Berlin", "Madrid", "Rome"],
    correctAnswer: 0,
    flagged: false,
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
    flagged: false,
  },
  {
    question: "Which language is used to style web pages?",
    options: ["HTML", "Python", "CSS", "Java"],
    correctAnswer: 2,
    flagged: false,
  },
  {
    question: "What is the largest planet in our solar system?",
    options: ["Earth", "Jupiter", "Mars", "Saturn"],
    correctAnswer: 1,
    flagged: false,
  },
  {
    question: "What is the freezing point of water?",
    options: ["0°C", "32°F", "100°C", "212°F"],
    correctAnswer: 0,
    flagged: false,
  },
];

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questionsData.length).fill(null));
  const [showReview, setShowReview] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timer, setTimer] = useState(null);
  const [finalScore, setFinalScore] = useState(0); // Score to be calculated at the end

  // Timer logic for each question
  useEffect(() => {
    if (timer) {
      clearInterval(timer); // Clear any previous timer
    }

    setTimeLeft(30); // Reset the time for each question
    const newTimer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          handleAnswer(null); // If time runs out, mark as incorrect
          clearInterval(newTimer); // Clear timer when time is up
          return 0;
        }
        return prevTime - 1; // Countdown
      });
    }, 1000); // 1 second interval

    setTimer(newTimer);

    // Cleanup timer when question changes or component unmounts
    return () => clearInterval(newTimer);
  }, [currentQuestionIndex]);

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers];
    if (answerIndex !== null) {
      newAnswers[currentQuestionIndex] = answerIndex;
    } else {
      newAnswers[currentQuestionIndex] = -1; // Mark as incorrect if no answer
    }

    setAnswers(newAnswers);

    // Move to the next question or show review
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateFinalScore(newAnswers); // Calculate final score at the end
      setShowReview(true); // Show review at the end
    }
  };

  const calculateFinalScore = (finalAnswers) => {
    let score = 0;
    finalAnswers.forEach((answer, index) => {
      if (answer !== null && answer !== -1 && answer === questionsData[index].correctAnswer) {
        score += 1; // Increment for each correct answer
      }
    });
    setFinalScore(score); // Set the final score after calculation
  };

  const handleFlag = () => {
    const newFlaggedQuestions = [...flaggedQuestions];
    if (!newFlaggedQuestions.includes(currentQuestionIndex)) {
      newFlaggedQuestions.push(currentQuestionIndex);
      questionsData[currentQuestionIndex].flagged = true;
    } else {
      const index = newFlaggedQuestions.indexOf(currentQuestionIndex);
      newFlaggedQuestions.splice(index, 1);
      questionsData[currentQuestionIndex].flagged = false;
    }
    setFlaggedQuestions(newFlaggedQuestions);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const unansweredCount = answers.filter((answer) => answer === null).length;
      if (unansweredCount > 0) {
        alert(`You have ${unansweredCount} unanswered questions. Please answer all questions before finishing.`);
      } else {
        calculateFinalScore(answers); // Calculate score when finishing
        setShowReview(true);
      }
    }
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setFinalScore(0); // Reset score on retake
    setAnswers(Array(questionsData.length).fill(null));
    setShowReview(false);
    setFlaggedQuestions([]);
    setTimeLeft(30);
    clearInterval(timer); // Clear timer when retaking quiz
  };

  const unansweredCount = answers.filter((answer) => answer === null).length;

  return (
    <div className="App">
      {showReview ? (
        <div className="score-section">
          <h2>Your Final Score: {finalScore} / {questionsData.length}</h2> {/* Display final score */}
          <h3>Unanswered Questions: {unansweredCount}</h3>
          <h3>Review Your Answers:</h3>
          <ul>
            {questionsData.map((q, index) => (
              <li key={index}>
                <strong>{q.question}</strong>
                <p>Your Answer: {answers[index] !== null ? (answers[index] === -1 ? "Not answered" : q.options[answers[index]]) : "Not answered"}</p>
                <p>Correct Answer: {q.options[q.correctAnswer]}</p>
                {q.flagged && <p style={{ color: 'orange' }}>Flagged for review</p>}
              </li>
            ))}
          </ul>
          <button onClick={handleRetake} className="retake-button">Retake Quiz</button>
        </div>
      ) : (
        <div className="question-navigation">
          <h3 className="timer">Time Left: {timeLeft} seconds</h3> {/* Timer Display */}
          <Question
            question={questionsData[currentQuestionIndex].question}
            options={questionsData[currentQuestionIndex].options}
            onAnswer={handleAnswer}
            onFlag={handleFlag}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questionsData.length}
            isFlagged={questionsData[currentQuestionIndex].flagged}
          />
          <div className="navigation-buttons">
            <button onClick={handleBack} disabled={currentQuestionIndex === 0} className="nav-button">Back</button>
            <button onClick={handleNext} className="nav-button">
              {currentQuestionIndex === questionsData.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
