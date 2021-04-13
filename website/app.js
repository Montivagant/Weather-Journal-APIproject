// Wrapping some const(s) in local function
(function () {
  const baseUrl = "https://api.openweathermap.org/data/2.5/weather"; //Initial URL
  const apiKey = "80fd0c28caaeba68344b22209ee521c1"; //You have to Generate your own from (https://openweathermap.org/api)
  // Getting and formmating Date
  const date = new Date().toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  // Global const(s)
  const zipElem = document.getElementById("zip");
  const feelingsElem = document.getElementById("feelings");
  const generateBtn = document.getElementById("generate");

  /*
  const dateElem = document.getElementById("date");
  const tempElem = document.getElementById("temp");
  const contentElem = document.getElementById("content"); */

  /* Function to GET Web API Data*/
  // Fetching API data using user inserted values
  const getWeatherInfo = async (zip) =>
    await fetch(`${baseUrl}?zip=${zip}&units=metric&APPID=${apiKey}`);

  const saveEntry = async ({ temperature, date, feeling }) =>
    await fetch("/api/v1/entry", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ temperature, date, feeling }),
    });
  // Now Updating the UI using the "updateUI"
  const updateUI = async () => {
    const request = await fetch("/api/v1/entry");
    try {
      const allData = await request.json();
      document.getElementById("date").innerHTML = "Date: " + allData.date;
      document.getElementById("temp").innerHTML =
        "Temperature: " + allData.temperature;
      document.getElementById("content").innerHTML = "Note: " + allData.feeling;
    } catch (error) {
      console.log("error", error);
    }
  };
  // Event listener to add function to existing HTML DOM element
  generateBtn.addEventListener("click", async () => {
    generateBtn.textContent = "Loading......";
    const zip = zipElem.value;
    const feeling = feelingsElem.value;
    const res = await getWeatherInfo(zip);
    generateBtn.textContent = "Generate";

    try {
      const {
        main: { temp: temperature },
      } = await res.json();
      await saveEntry({ temperature, date, feeling });
      await updateUI();
    } catch (err) {
      console.error(err);
    }
  });
})();
