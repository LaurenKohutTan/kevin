const player1 = localStorage.getItem('player1Name');
const player2 = localStorage.getItem('player2Name');
const subjects = JSON.parse(localStorage.getItem('selectedSubjects') || '[]');
const pointsToWin = parseInt(localStorage.getItem('selectedPoints'), 10);

let p1Score = 0;
let p2Score = 0;
let currentQuestion = null;
let answered = false;

let availableQuestions = [];

// Creates progress bars based on points to win
function createProgressBars() {
  const player1Container = document.getElementById('player1-bars');
  const player2Container = document.getElementById('player2-bars');

  for (let i = 0; i < pointsToWin; i++) {
    const bar1 = document.createElement('div');
    bar1.classList.add('progress-bar');
    bar1.innerHTML = `<div class="progress-fill" id="p1-fill-${i}"></div>`;
    player1Container.appendChild(bar1);

    const bar2 = document.createElement('div');
    bar2.classList.add('progress-bar');
    bar2.innerHTML = `<div class="progress-fill" id="p2-fill-${i}"></div>`;
    player2Container.appendChild(bar2);
  }
}

// Dictionary of all questions and answers
const trivia = {
  "Math": [
    { question: "What is the probability that a coin lands on heads exactly one time in five coin flips?", choices: ["1/16", "3/32", "1/8", "5/32"], answer: 3 },
    { question: "What is the units digit of 3^2025?", choices: ["1", "3", "7", "9"], answer: 1 },
    { question: "How many ways are there to choose 5 senators out of 10 different candidates?", choices: ["180", "240", "252", "255"], answer: 2 },
    { question: "How many terms are in a geometric sequence with first term 9, last term 36864, and common ratio 4?", choices: ["6", "7", "8", "9"], answer: 1 },
    { question: "Given that x+y=2 and x-y=6, what is the value of xy?", choices: ["-8", "-6", "6", "8"], answer: 0 },
    { question: "What is the sum of the first 5 prime numbers?", choices: ["26", "28", "30", "32"], answer: 1 }
  ],
  "History": [
    { question: "Which president of the U.S. visited China during the Cold War?", choices: ["Kennedy", "Johnson", "Nixon", "Ford"], answer: 2 },
    { question: "In what year was Operation Barbarossa implemented?", choices: ["1941", "1942", "1943", "1944"], answer: 0 },
    { question: "Which of the following was a mistake of both Napoleon and Hitler?", choices: ["Invading Russia", "Using Zeppelins", "Invading Spain", "Utilizing Slavery"], answer: 0 },
    { question: "Which of the following best describes the time of the Vietnam War in respect to the Cold War?", choices: ["Started before and ended before", "Started before and ended after", "Started after and ended before", "Started after and ended after"], answer: 2 },
    { question: "Who was Brazil's first female president?", choices: ["Lula da Silva", "Dilma Rousseff", "Floriano Peixoto", "Itamar Franco"], answer: 1 },
    { question: "Which terrorist organization was responsible for the 9/11 incident?", choices: ["Al-Qaeda", "ISIS", "Hamas", "Hizbul Mujahideen"], answer: 0 }
  ],
  "Computer Science": [
    { question: "What does CPU stand for?", choices: ["Central Process Unit", "Central Processing Unit", "Computer Power Unit", "Control Processing Unit"], answer: 1 },
    { question: "Which of the following languages is used for web design?", choices: ["Python", "C++", "CSS", "Java"], answer: 2 },
    { question: "Which Python package allows for working with arrays?", choices: ["Matplotlib", "NumPy", "Django", "Pandas"], answer: 1 },
    { question: "What does HTML deal with?", choices: ["Variables and functions", "The functionality behind a webpage", "The design of a webpage", "The display of words and images on a webpage"], answer: 3 },
    { question: "Which of the following programming languages uses def() to define functions?", choices: ["C", "Javascript", "Java", "Python"], answer: 3 },
    { question: "What is the most admired programming language, according to a 2024 survey in Stack Overflow?", choices: ["Python", "SQL", "Rust", "JavaScript"], answer: 0 }
  ],
  "Biology": [
    { question: "Which of the following organs is not vestigial?", choices: ["Appendix", "Gallbladder", "Eyelid", "Coccyx"], answer: 2 },
    { question: "Which animals are the greatest common ancestor between cats and dogs?", choices: ["Miacids", "Cougars", "Foxes", "Hyenas"], answer: 0 },
    { question: "What is the function of golgi bodies within a cell?", choices: ["Synthesis, modification, and transport of proteins", "Processing and packaging proteins and lipid molecules to be exported outside the cell", "Translating genetic code into amino acid sequences", "Supporting the cell's structure"], answer: 1 },
    { question: "Which animal did Charles Darwin examine on the Galápagos Islands?", choices: ["Turtles", "Seagulls", "Tortoises", "Finches"], answer: 3 },
    { question: "How many Principles of Mendelian Inheritance are there?", choices: ["2", "3", "4", "5"], answer: 1 },
    { question: "A population is reduced significantly in number, minimizing genetic diversity. Then, it goes back to its original population number, but with lower variation. What is this phenomenon called?", choices: ["Founder Effect", "Gene Flow", "Population Bottleneck", "Natural Selection"], answer: 2 }
  ],
  "Tennis": [
    { question: "Who won the 2024 Next Gen ATP Finals?", choices: ["Learner Tien", "João Fonseca", "Carlos Alcaraz", "Jannik Sinner"], answer: 1 },
    { question: "Which of the following players is left-handed?", choices: ["Nadal", "Federer", "Djokovic", "Murray"], answer: 0 },
    { question: "In which year did Roger Federer retire?", choices: ["2021", "2022", "2023", "2024"], answer: 1 },
    { question: "Which tennis player had a total of 22 Grand Slams?", choices: ["Federer", "Sampras", "Djokovic", "Nadal"], answer: 3 },
    { question: "Who was the first player to enter Team Europe in the 2025 Laver Cup?", choices: ["Jannik Sinner", "Carlos Alcaraz", "Alexander Zverev", "Taylor Fritz"], answer: 1 },
    { question: "Who was the only semifinalist of Roland Garros 2025 who did not have a single Grand Slam title?", choices: ["Zverev", "Bublik", "Musetti", "Djokovic"], answer: 2 }
  ],
  "Basketball": [
    { question: "Which team won the 2024 NBA Finals?", choices: ["Celtics", "Nuggets", "Knicks", "Warriors"], answer: 0 },
    { question: "What was the average 3-point percentage of the NBA in the 2023-24 season?", choices: ["36.1%", "36.6%", "39.2%", "40.4%"], answer: 1 },
    { question: "As of 2025, which NBA player made the most half-court shots?", choices: ["Raymond Felton", "Luka Dončić", "Stephen Curry", "Nikola Jokić"], answer: 2 },
    { question: "According to an NBA player poll in 2024, who is the NBA GOAT?", choices: ["Lebron James", "Kobe Bryant", "Stephen Curry", "Michael Jordan"], answer: 3 },
    { question: "Which team did Shaquille O'Neal play on?", choices: ["Wizards", "Knicks", "Lakers", "Spurs"], answer: 2 },
    { question: "What is the weight of a normal basketball?", choices: ["16 oz", "20 oz", "22 oz", "30 oz"], answer: 2 }
  ],
  "Physics": [
    { question: "What term is defined as the change in momentum?", choices: ["Impulse", "Acceleration", "Work", "Viscosity"], answer: 0 },
    { question: "What are the units of the gravitational constant?", choices: ["m^2 kg^-1 s^-1", "m^3 kg^-1 s^-1", "m^3 kg^-1 s^-2", "m^2 kg^-2 s^-2"], answer: 2 },
    { question: "What is the power of the radius, R, in Poiseuille's Equation?", choices: ["-4", "-2", "2", "4"], answer: 0 },
    { question: "Object A is 10 kg and object B is 15 kg. In an idealized scenario (neglecting components such as air resistance), they are both dropped from the top of a building at the same height and time. Which object will hit the ground first?", choices: ["None of the objects will hit the ground", "Object A", "Object B", "Both objects will hit the ground at the same time"], answer: 3 },
    { question: "Which of the following units is for energy?", choices: ["Watt", "Joule", "Ampere", "Coulomb"], answer: 1 },
    { question: "What is defined as the change in acceleration over time?", choices: ["Jerk", "Snap", "Crackle", "Pop"], answer: 0 }
  ],
  "Brawl Stars": [
    { question: "Which brawler has a super with infinite range?", choices: ["Bibi", "Mandy", "Rico", "Edgar"], answer: 1 },
    { question: "Which brawler is in the superhero trio along with Max and Surge?", choices: ["Meg", "Stu", "Belle", "Bea"], answer: 0 },
    { question: "Who is Kenji's wife?", choices: ["Lumi", "Melodie", "Janet", "Kaze"], answer: 3 },
    { question: "How many legendary brawlers are there?", choices: ["9", "10", "11", "12"], answer: 3 },
    { question: "What is the maximum number of posts Chuck can place without his star power?", choices: ["2", "3", "4", "5"], answer: 1 },
    { question: "Which of the following players won the Brawl Stars World Finals multiple times?", choices: ["Achapi", "Sitetampo", "Sans", "LeNain"], answer: 0 }
  ]
};

// Initialize the list of available questions based on selected subjects
function initializeAvailableQuestions() {
  availableQuestions = [];
  subjects.forEach(subject => {
    const questions = trivia[subject];
    questions.forEach(q => {
      availableQuestions.push({ subject, question: q });
    });
  });
}

// Update the display of questions left
function updateProblemsLeft() {
  const left = availableQuestions.length;
  document.getElementById('problems-left').textContent = left;
}

// Randomly select and remove a question from availableQuestions
function getRandomQuestion() {
  if (availableQuestions.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  const selected = availableQuestions.splice(randomIndex, 1)[0];
  updateProblemsLeft();
  return selected;
}

// Load new question
function loadQuestion() {
  answered = false;
  player1Answered = false;
  player2Answered = false;
  player1AnswerCorrect = false;
  player2AnswerCorrect = false;

  const result = getRandomQuestion();

  if (!result) {
    // No questions left: determine winner or tie
    if (p1Score > p2Score) {
      endGame(player1);
    } else if (p2Score > p1Score) {
      endGame(player2);
    } else {
      document.getElementById('winnerText').textContent = "It's a tie!";
      document.getElementById('endGameMessage').style.display = 'block';
      window.removeEventListener('keydown', keydownHandler);
    }
    return;
  }

  const subject = result.subject;
  currentQuestion = result.question;

  document.getElementById('questionSubject').textContent = subject;
  document.getElementById('questionText').textContent = currentQuestion.question;

  const box = document.getElementById('choicesBox');
  box.innerHTML = '';

  const p1Keys = ['1', '2', '3', '4'];
  const p2Keys = ['U', 'I', 'O', 'P'];

  currentQuestion.choices.forEach((choice, i) => {
    const el = document.createElement('div');
    el.classList.add('answer-choice');

    el.innerHTML = `
      <span class="choice-text">${String.fromCharCode(65 + i)}: ${choice}</span>
      <span class="key-hint">[${p1Keys[i]} / ${p2Keys[i]}]</span>
    `;

    el.setAttribute('data-index', i);
    box.appendChild(el);
  });

  document.getElementById('resultText').textContent = '';
}

// Handle player's answer (right or wrong)
function handleAnswer(player, choiceIndex, clickedEl) {
  if (answered) return;

  if ((player === player1 && player1Answered) || (player === player2 && player2Answered)) return;

  const correctIndex = currentQuestion.answer;
  const allChoices = document.querySelectorAll('.answer-choice');

  clickedEl.classList.add('disabled');

  const isCorrect = choiceIndex === correctIndex;
  let resultText = document.getElementById('resultText');

  if (player === player1) {
    player1Answered = true;
    player1AnswerCorrect = isCorrect;
  } else {
    player2Answered = true;
    player2AnswerCorrect = isCorrect;
  }

  if (isCorrect) {
    clickedEl.classList.add('correct');
    resultText.textContent = `${player} got it right!`;
    new Audio('correct.mp3').play()

    if (player === player1) {
      document.getElementById(`p1-fill-${p1Score}`).style.width = '100%';
      p1Score++;
    } else {
      document.getElementById(`p2-fill-${p2Score}`).style.width = '100%';
      p2Score++;
    }

    answered = true;
    endOrNextQuestion();
  } else {
    resultText.textContent = `${player} got it wrong.`;
    new Audio('incorrect.mp3').play()

    clickedEl.classList.add('shake');
    setTimeout(() => clickedEl.classList.remove('shake'), 500);

    if (player1Answered && player2Answered && !player1AnswerCorrect && !player2AnswerCorrect) {
      allChoices[correctIndex].classList.add('correct');
      answered = true;
      endOrNextQuestion();
    }
  }
}

function endOrNextQuestion() {
  setTimeout(() => {
    if (p1Score >= pointsToWin) {
      endGame(player1);
    } else if (p2Score >= pointsToWin) {
      endGame(player2);
    } else {
      loadQuestion();
    }
  }, 2000);
}

// Keyboard controls for each player
const keyMap = {
  '1': { player: player1, index: 0 },
  '2': { player: player1, index: 1 },
  '3': { player: player1, index: 2 },
  '4': { player: player1, index: 3 },
  'u': { player: player2, index: 0 },
  'i': { player: player2, index: 1 },
  'o': { player: player2, index: 2 },
  'p': { player: player2, index: 3 }
};

function keydownHandler(e) {
  const key = e.key.toLowerCase();
  if (keyMap[key]) {
    const { player, index } = keyMap[key];
    const allChoices = document.querySelectorAll('.answer-choice');
    const el = allChoices[index];
    handleAnswer(player, index, el);
  }
}

window.addEventListener('keydown', keydownHandler);

// Initialize game
document.addEventListener("DOMContentLoaded", () => {
  initializeAvailableQuestions();
  updateProblemsLeft();
  createProgressBars();
  loadQuestion();
});

// End of game events
function endGame(winner) {
  document.getElementById('winnerText').textContent = `${winner} wins!`;
  document.getElementById('endGameMessage').style.display = 'block';
  window.removeEventListener('keydown', keydownHandler);
}

function goToSetup() {
  window.location.href = 'finalproject.html';
}
