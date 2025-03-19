window.QuestionCard = function ({
  question,
  index,
  total,
  selected,
  onAnswer,
  onPrev,
  onNext,
}) {
  return (
    <div className="question-card">
      <div>
        Вопрос {index + 1} из {total}
      </div>
      <h3>{question.text}</h3>
      <div className="answers">
        {question.ans.map((answer, i) => (
          <button
            key={i}
            className={`answer-btn ${
              selected === answer.value ? "selected" : ""
            }`}
            onClick={() => onAnswer(answer.value)}
          >
            {answer.text}
          </button>
        ))}
      </div>
      <div
        className="navigation"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        {index > 0 ? <button onClick={onPrev}>Назад</button> : <div></div>}
        <button onClick={onNext} disabled={!selected}>
          {index === total - 1 ? "Завершить" : "Далее"}
        </button>
      </div>
    </div>
  );
};
