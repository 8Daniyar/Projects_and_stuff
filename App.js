const { useReducer, useEffect } = React;

const initialState = {
  tests: [],
  selectedTest: null,
  currentIndex: 0,
  answers: {},
};

function color(score, maxScore) {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  canvas.width = 100;
  canvas.height = 10;

  let gradient = ctx.createLinearGradient(0, 0, 100, 0);
  gradient.addColorStop(0, "green");
  gradient.addColorStop(0.5, "yellow");
  gradient.addColorStop(1, "red");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 100, 10);

  let position = (score / maxScore) * 100 - 0.01;
  let pixel = ctx.getImageData(position, 5, 1, 1).data;

  return `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_TESTS":
      return { ...state, tests: action.payload };
    case "SELECT_TEST":
      return {
        ...state,
        selectedTest: action.payload,
        currentIndex: 0,
        answers: {},
      };
    case "ANSWER":
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.value },
      };
    case "NEXT":
      return { ...state, currentIndex: state.currentIndex + 1 };
    case "PREV":
      return { ...state, currentIndex: state.currentIndex - 1 };
    case "RESET":
      return { ...initialState, tests: state.tests };
    default:
      return state;
  }
}

window.App = function () {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    window
      .fetchTests()
      .then((data) => dispatch({ type: "SET_TESTS", payload: data.tests }));
  }, []);

  if (!state.selectedTest) {
    return (
      <window.TestSelection
        tests={state.tests}
        onSelect={(test) => dispatch({ type: "SELECT_TEST", payload: test })}
      />
    );
  }

  if (state.currentIndex >= state.selectedTest.questions.length) {
    const total = Object.values(state.answers).reduce(
      (sum, value) => sum + value,
      0
    );
    const maxScore = state.selectedTest.questions.reduce((sum, question) => {
      const maxVal = Math.max(...question.ans.map((a) => a.value));
      return sum + maxVal;
    }, 0);
    const percentage = (total / maxScore) * 100;
    const points =
      (
        state.selectedTest.results.find(
          (r) => total >= r.minVal && total <= r.maxVal
        ) || {}
      ).desc || "Не определено";
    const resultObj =
      state.selectedTest.results.find(
        (r) => total >= r.minVal && total <= r.maxVal
      ) || {};
    const advice = resultObj.advice || "Нет рекомендаций.";

    return (
      <div className="container">
        <div className="test-card">
          <h2>Ваш результат: {points}</h2>
          <div className="score-scale" style={{ margin: "20px 0" }}>
            <div
              style={{
                backgroundColor: color(total, maxScore),
                width: percentage + "%",
                height: "20px",
                borderRadius: "10px",
                transition: "width 0.5s ease",
              }}
            ></div>
          </div>
          <p>
            {Math.trunc(total)} баллов из {maxScore}
          </p>
          <h3>Совет:</h3>
          <p>{advice}</p>
          <button onClick={() => dispatch({ type: "RESET" })}>
            Пройти снова
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = state.selectedTest.questions[state.currentIndex];
  return (
    <div className="container">
      <window.QuestionCard
        question={currentQuestion}
        index={state.currentIndex}
        total={state.selectedTest.questions.length}
        selected={state.answers[currentQuestion.id]}
        onAnswer={(value) =>
          dispatch({ type: "ANSWER", questionId: currentQuestion.id, value })
        }
        onPrev={() => dispatch({ type: "PREV" })}
        onNext={() => dispatch({ type: "NEXT" })}
      />
    </div>
  );
};

const { render } = ReactDOM;
render(<window.App />, document.getElementById("root"));
