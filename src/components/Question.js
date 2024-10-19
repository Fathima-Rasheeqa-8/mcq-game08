import React from 'react';

const Question = ({ question, options, onAnswer, onFlag, currentQuestionIndex, totalQuestions, isFlagged }) => {
  return (
    <div className="question-container">
      <h2>{`Question ${currentQuestionIndex + 1} of ${totalQuestions}`}</h2>
      <p>{question}</p>
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onAnswer(index)}
          className="option-button"
        >
          {option}
        </button>
      ))}
      <button onClick={onFlag} className="flag-button">
        {isFlagged ? 'Unflag' : 'Flag'} Question
      </button>
    </div>
  );
};

export default Question;
