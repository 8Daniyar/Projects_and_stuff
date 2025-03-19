window.TestSelection = function ({ tests, onSelect }) {
  return (
    <div className="container">
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
