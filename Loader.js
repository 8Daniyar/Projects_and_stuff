window.fetchTests = async function () {
  const response = await fetch("tests.json");
  return response.json();
};
