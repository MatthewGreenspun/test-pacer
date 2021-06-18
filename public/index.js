let totalQuestions = 0;
let totalTime = 0;
let paused = false;
let questionOvertime = false;
let testOvertime = false;

const questionTime = document.getElementById("question-time");
const testTime = document.getElementById("test-time");
const pauseBtn = document.getElementById("pause");
const endBtn = document.getElementById("end-test");
const nextQuestionBtn = document.getElementById("next");
const lastQuestionBtn = document.getElementById("last");
const settings = document.getElementById("settings-container");
const timerContainer = document.getElementById("timer");

const questionsRemainingDiv = document.getElementById("questions-remaining");
const currentQuestionDiv = document.getElementById("current-question");

let currentQuestion = 1;
let questionsRemaining = totalQuestions;

let testMinutesRemaining = totalTime;
let testSecondsRemaining = 0;

let questionMinutesRemaining = 0;
let questionSecondsRemaining = 0;

document.getElementById("settings").addEventListener("submit", (e) => {
  e.preventDefault();
  settings.classList.add("hide");
  timerContainer.classList.remove("hide");

  totalQuestions = Number(document.getElementById("questions").value);
  questionsRemaining = totalQuestions;
  totalTime = Number(document.getElementById("time").value);

  testMinutesRemaining = totalTime;
  testSecondsRemaining = 0;

  questionMinutesRemaining = Math.floor(testMinutesRemaining / totalQuestions);
  questionSecondsRemaining = Math.floor(
    60 * (testMinutesRemaining / totalQuestions - questionMinutesRemaining)
  );

  drawTimer();
  this.timer = setInterval(timerLogic, 1000);
});

function handleFinishQuestion() {
  questionTime.classList.remove("text-danger");
  questionOvertime = false;
  lastQuestionBtn.classList.remove("disabled");
  if (questionsRemaining > 0) {
    if (questionsRemaining > 1) currentQuestion++;
    questionsRemaining--;
  } else nextQuestionBtn.classList.add("disabled");
  if (questionsRemaining > 0) {
    questionMinutesRemaining = Math.floor(
      (testMinutesRemaining + testSecondsRemaining / 60) / questionsRemaining
    );
    questionSecondsRemaining = Math.floor(
      60 *
        ((testMinutesRemaining + testSecondsRemaining / 60) /
          questionsRemaining -
          questionMinutesRemaining)
    );
  } else {
    nextQuestionBtn.classList.add("diabled");
    lastQuestionBtn.classList.remove("disabled");
  }
}

function handleUndoQuestion() {
  questionTime.classList.remove("text-danger");
  nextQuestionBtn.classList.remove("disabled");
  questionOvertime = false;
  if (questionsRemaining < totalQuestions) {
    if (currentQuestion > 1 && questionsRemaining > 0) currentQuestion--;
    questionsRemaining++;
  }
  if (questionsRemaining === totalQuestions)
    lastQuestionBtn.classList.add("disabled");
  if (questionsRemaining > 0) {
    questionMinutesRemaining = Math.floor(
      (testMinutesRemaining + testSecondsRemaining / 60) / questionsRemaining
    );
    questionSecondsRemaining = Math.floor(
      60 *
        ((testMinutesRemaining + testSecondsRemaining / 60) /
          questionsRemaining -
          questionMinutesRemaining)
    );
  }
}
function drawTimer() {
  testTime.textContent = `${testOvertime ? "-" : ""}${
    testMinutesRemaining < 10 ? "0" : ""
  }${testMinutesRemaining}:${
    testSecondsRemaining < 10 ? "0" : ""
  }${testSecondsRemaining}`;

  questionTime.textContent = `${questionOvertime ? "-" : ""}${
    questionMinutesRemaining < 10 ? "0" : ""
  }${questionMinutesRemaining}:${
    questionSecondsRemaining < 10 ? "0" : ""
  }${questionSecondsRemaining}`;

  currentQuestionDiv.textContent = currentQuestion;
  questionsRemainingDiv.textContent = questionsRemaining;
}

function timerLogic() {
  drawTimer();
  if (!testOvertime) {
    if (testSecondsRemaining === 0) {
      if (testMinutesRemaining === 0 && questionsRemaining !== 0) {
        testOvertime = true;
        testTime.classList.add("text-danger");
      } else if (testMinutesRemaining === 0 && questionsRemaining === 0) {
        testMinutesRemaining = 0;
        testSecondsRemaining = 1;
      } else {
        testMinutesRemaining -= 1;
        testSecondsRemaining = 60;
      }
    }
    if (!testOvertime) testSecondsRemaining -= 1;

    if (questionSecondsRemaining === 0) {
      if (questionMinutesRemaining === 0 && questionsRemaining > 0) {
        questionOvertime = true;
        questionTime.classList.add("text-danger");
      }
      if (!questionOvertime) questionMinutesRemaining -= 1;
      if (!questionOvertime) questionSecondsRemaining = 60;
    }

    if (questionOvertime && questionSecondsRemaining === 59) {
      questionSecondsRemaining = -1; //it becomes 0 becuase 1 is added
      questionMinutesRemaining += 1;
    }

    if (!questionOvertime) questionSecondsRemaining -= 1;
    else questionSecondsRemaining += 1;

    if (questionsRemaining === 0) {
      nextQuestionBtn.classList.add("disabled");
      questionMinutesRemaining = 0;
      questionSecondsRemaining = 0;
    }
  }
  if (testOvertime) {
    questionTime.classList.remove("text-danger");
    nextQuestionBtn.classList.add("disabled");
    lastQuestionBtn.classList.add("disabled");
    questionOvertime = false;
    questionMinutesRemaining = 0;
    questionSecondsRemaining = 0;
    if (testSecondsRemaining === 59) {
      testSecondsRemaining = -1;
      testMinutesRemaining += 1;
    }
    testSecondsRemaining += 1;
  }
}

nextQuestionBtn.addEventListener("click", handleFinishQuestion);
lastQuestionBtn.addEventListener("click", handleUndoQuestion);

pauseBtn.addEventListener("click", () => {
  if (paused) {
    this.timer = setInterval(timerLogic, 1000);
    paused = false;
    pauseBtn.textContent = "Pause";
    nextQuestionBtn.addEventListener("click", handleFinishQuestion);
  } else {
    clearInterval(this.timer);
    paused = true;
    pauseBtn.textContent = "Resume";
    nextQuestionBtn.removeEventListener("click", handleFinishQuestion);
  }
});

endBtn.addEventListener("click", () => {
  clearInterval(this.timer);
  totalQuestions = 0;
  totalTime = 0;
  paused = false;
  questionOvertime = false;
  testOvertime = false;
  currentQuestion = 1;
  questionsRemaining = totalQuestions;

  testMinutesRemaining = totalTime;
  testSecondsRemaining = 0;

  questionMinutesRemaining = 0;
  questionSecondsRemaining = 0;
  testTime.classList.remove("text-danger");
  questionTime.classList.remove("text-danger");
  nextQuestionBtn.classList.remove("disabled");
  lastQuestionBtn.classList.add("disabled");
  settings.classList.remove("hide");
  timerContainer.classList.add("hide");
});
