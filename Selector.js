window.TestSelection = function ({ tests, onSelect }) {
  return (
    <div className="container">
      <p id="welcome">
        Добро пожаловать! Здесь вы можете проходить психологические тесты и
        узнавать о возможных проблемах с вашим ментальным здоровьем. Берегите
        себя!
      </p>
      <h1>Выберите тест</h1>
      {tests.map((test) => (
        <div key={test.id} className="test-card" onClick={() => onSelect(test)}>
          <h2>{test.title}</h2>
          <p>{test.desc}</p>
        </div>
      ))}
    </div>
  );
};
