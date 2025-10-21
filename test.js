const fetchFromApi = async (i) => {
  try {
    console.time(`fetchFromApi ${i}`);
    const response = await fetch(`http://localhost:8000/api/ping/?id=${i}`);
    const data = await response.text();
    console.log(data);
    console.timeEnd(`fetchFromApi ${i}`);
  } catch (error) {
    console.error(error);
  }
};
console.time("fetchFromApiCalls");
for (let i = 0; i < 10; i++) {
  fetchFromApi(i);
}
console.timeEnd("fetchFromApiCalls");
console.log("\n\n\n\n\n");
