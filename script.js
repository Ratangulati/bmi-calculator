const form = document.getElementById("bmi-form");
const resultDiv = document.getElementById("result");
const historyList = document.getElementById("history-list");
const toggleBtn = document.getElementById("toggle-history");

let showAll = false;

function getStatus(bmi) {
  if (bmi < 18.5) return "Underweight";
  else if (bmi < 24.9) return "Normal";
  else if (bmi < 29.9) return "Overweight";
  else return "Obese";
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("bmiHistory")) || [];
  historyList.innerHTML = "";

  const entriesToShow = showAll ? history : history.slice(0, 2);
  entriesToShow.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.date} — BMI: ${entry.bmi} (${entry.status})`;
    historyList.appendChild(li);
  });

  if (history.length > 3) {
    toggleBtn.style.display = "inline-block";
    toggleBtn.textContent = showAll ? "See Less" : "See More";
  } else {
    toggleBtn.style.display = "none";
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const height = parseFloat(document.getElementById("height").value) / 100;
  const weight = parseFloat(document.getElementById("weight").value);

  if (height > 0 && weight > 0) {
    const bmi = weight / (height * height);
    const status = getStatus(bmi);

    resultDiv.innerHTML = `Your BMI is <strong>${bmi.toFixed(1)}</strong> — <span>${status}</span>`;

    const history = JSON.parse(localStorage.getItem("bmiHistory")) || [];
    const date = new Date().toLocaleString();
    history.unshift({ date, bmi: bmi.toFixed(1), status });

    if (history.length > 20) history.pop();
    localStorage.setItem("bmiHistory", JSON.stringify(history));

    loadHistory();
  } else {
    resultDiv.innerHTML = "<span>Please enter valid height and weight.</span>";
  }
});

toggleBtn.addEventListener("click", () => {
  showAll = !showAll;
  loadHistory();
});

window.onload = loadHistory;
