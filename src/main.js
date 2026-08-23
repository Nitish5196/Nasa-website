import './style.css'; 

const API_KEY = import.meta.env.VITE_NASA_API_KEY;
const datePicker = document.querySelector("#datepicker");
const randomBtn = document.querySelector("#random-btn");
const app = document.querySelector("#app");
const rocketOverlay = document.querySelector("#rocket-overlay");
g
function triggerRocketLaunch(callback) {
  rocketOverlay.classList.add("launching");
  setTimeout(() => {
    callback();
  }, 600);
  setTimeout(() => {
    rocketOverlay.classList.remove("launching");
  }, 1200);
}

function getRandomDate() {
  const start = new Date(1995, 5, 16);
  const end = new Date();
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString().split("T")[0];
}

function fetchAPOD(date = "") {
  app.innerHTML = "<p>loading...</p>";

  const dateQuery = date ? `&date=${date}` : "";
  
  fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}${dateQuery}`)
    .then(response => response.json())
    .then(data => {
      let media;

      if (data.media_type === "image") {
        media = `<img src="${data.url}" alt="${data.title}" />`;
      } else if (data.url.includes("youtube")) {
        media = `<iframe src="${data.url}" width="100%" height="400" frameborder="0" allowfullscreen></iframe>`;
      } else {
        media = `<video src="${data.url}" controls></video>`;
      }

      app.innerHTML = `
        <h1>${data.title}</h1>
        ${media}
        <p>${data.explanation}</p>
      `;
    })
    .catch(err => {
      app.innerHTML = `<p>Error: ${err.message}</p>`;
    });
}

datePicker.addEventListener("change", (e) => {
  triggerRocketLaunch(() => fetchAPOD(e.target.value));
});

randomBtn.addEventListener("click", () => {
  const randomDateStr = getRandomDate();
  datePicker.value = randomDateStr;
  triggerRocketLaunch(() => fetchAPOD(randomDateStr));
});

triggerRocketLaunch(() => fetchAPOD());