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
  let res = await fetch("/api/paragraph");
  let data = await res.json();

  if (!data || !data.text) {
    paragraphEl.textContent = "Error: no paragraph available.";
    return;
  }

  testText = data.text;
  paragraphEl.textContent = testText;

  inputEl.value = "";
  inputEl.disabled = false;
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

  if (timeLeft <= 0) {
    clearInterval(timer);
    finishTest();
  }
}

function finishTest() {
  inputEl.disabled = true;

  const typed = inputEl.value.trim();
  if (!typed) {
    wpmEl.textContent = 0;
    accuracyEl.textContent = 0;
    saveHistory(0, 0);
    loadHistory();
    return;
  }

  const originalWords = testText.trim().split(/\s+/);
  const typedWords = typed.split(/\s+/);

  let totalTypedChars = 0;
  let correctChars = 0;

  for (let i = 0; i < typedWords.length; i++) {
    const typedWord = typedWords[i];
    const origWord = originalWords[i];

    if (!origWord) continue; 
    if(i==typedWords.length-1){
      totalTypedChars+=typedWord.length;
      correctChars+=countLastCorrectChars(origWord,typedWord);
    }
    else{
      totalTypedChars+=typedWord.length;
      correctChars+=countCorrectChars(origWord, typedWord);
    }
  }

  const accuracy = Math.round((correctChars / totalTypedChars) * 100);

  const timeMinutes = parseInt(timeSelect.value) / 60;
  const completedWords = typedWords.filter(w => w.length > 0).length;
  const wpm = Math.round(completedWords / timeMinutes);

  wpmEl.textContent = wpm;
  accuracyEl.textContent = accuracy;

  saveHistory(wpm, accuracy);
  loadHistory();
}
function countLastCorrectChars(original,typed){
  let count=0;
  const limit = Math.min(original.length, typed.length);

  for(let i=0;i<limit;i++){
     if(original[i]===typed[i]) count++;
  }

  return count;
}
function countCorrectChars(original, typed) {
  let count = 0;
  const limit = Math.min(original.length, typed.length);
  
  for (let i = 0; i < limit; i++) {
    if (original[i] === typed[i]) count++;
  }
  if(original.length>typed.length){
    count-=(original.length-typed.length);
  }
  else{
    count-=(typed.length-original.length);
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
