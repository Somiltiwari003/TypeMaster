const paragraphEl = document.getElementById("paragraph");
const inputEl = document.getElementById("input");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const startBtn = document.getElementById("startBtn");
const timeSelect = document.getElementById("timeSelect");
const historyEl = document.getElementById("history");

let timer;
let timeLeft;
let testText = "";

startBtn.addEventListener("click", startTest);

async function startTest() {
  let res=await fetch("/api/paragraph");
  let data=await res.json();
  testText=data.text;
  paragraphEl.textContent=testText;
  inputEl.value="";
  inputEl.disabled=false;
  inputEl.focus();

  timeLeft = parseInt(timeSelect.value);
  timeEl.textContent = timeLeft;

  wpmEl.textContent = 0;
  accuracyEl.textContent = 0;

  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeLeft--;
  timeEl.textContent = timeLeft;

  if (timeLeft === 0) {
    clearInterval(timer);
    finishTest();
  }
}

function finishTest() {
  inputEl.disabled = true;

  const typedText = inputEl.value;
  const wordsTyped = typedText.trim().split(/\s+/).length;

  const correctChars = countCorrectChars(testText, typedText);
  let accuracy;
  if(typedText.length===0){
    accuracy=0;
  }
  else{
    accuracy = Math.round((correctChars / typedText.length) * 100);
  }

  const timeMinutes = parseInt(timeSelect.value) / 60;
  let wpm;
  if(typedText.length===0){
    wpm=0;
  }
  else{
    wpm = Math.round(wordsTyped / timeMinutes);
  }
  wpmEl.textContent = wpm;
  accuracyEl.textContent = accuracy;

  saveHistory(wpm, accuracy);
  loadHistory();
}

function countCorrectChars(original, typed) {
  let count = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === original[i]) count++;
  }
  return count;
}

function saveHistory(wpm, accuracy) {
  const history = JSON.parse(localStorage.getItem("typingHistory")) || [];
  history.unshift({
    date: new Date().toLocaleString(),
    wpm,
    accuracy
  });

  if (history.length > 5) history.pop();
  localStorage.setItem("typingHistory", JSON.stringify(history));
}

function loadHistory() {
  historyEl.innerHTML = "";
  const history = JSON.parse(localStorage.getItem("typingHistory")) || [];

  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.date} | WPM: ${item.wpm} | Accuracy: ${item.accuracy}%`;
    historyEl.appendChild(li);
  });
}

loadHistory();
