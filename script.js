const teams = [
  "Chicago Bears", "Washington Commanders", "New England Patriots", "Arizona Cardinals",
  "Los Angeles Chargers", "New York Giants", "Tennessee Titans", "Atlanta Falcons",
  "Chicago Bears (from CAR)", "New York Jets", "Minnesota Vikings", "Denver Broncos",
  "Las Vegas Raiders", "New Orleans Saints", "Indianapolis Colts", "Seattle Seahawks",
  "Jacksonville Jaguars", "Cincinnati Bengals", "Los Angeles Rams", "Pittsburgh Steelers",
  "Miami Dolphins", "Philadelphia Eagles", "Houston Texans (from CLE)", "Dallas Cowboys",
  "Green Bay Packers", "Tampa Bay Buccaneers", "Arizona Cardinals (from HOU)", "Buffalo Bills",
  "Detroit Lions", "Baltimore Ravens", "San Francisco 49ers", "Kansas City Chiefs"
];

const positionNeeds = {
  "Chicago Bears": ["WR", "OT", "CB"],
  "Washington Commanders": ["QB", "OL", "CB"],
  "New England Patriots": ["QB", "WR", "OT"],
  "Arizona Cardinals": ["WR", "CB", "DL"],
  "Los Angeles Chargers": ["WR", "CB", "OT"],
  "New York Giants": ["QB", "WR", "EDGE"],
  "Tennessee Titans": ["OT", "WR", "CB"],
  "Atlanta Falcons": ["EDGE", "WR", "CB"],
  "New York Jets": ["OT", "WR", "S"],
  "Minnesota Vikings": ["QB", "CB", "DL"],
  "Denver Broncos": ["QB", "CB", "EDGE"],
  "Las Vegas Raiders": ["QB", "CB", "OL"],
  "New Orleans Saints": ["OT", "WR", "CB"],
  "Indianapolis Colts": ["CB", "WR", "S"],
  "Seattle Seahawks": ["OL", "DL", "CB"],
  "Jacksonville Jaguars": ["CB", "WR", "DL"],
  "Cincinnati Bengals": ["OT", "WR", "CB"],
  "Los Angeles Rams": ["CB", "OL", "EDGE"],
  "Pittsburgh Steelers": ["OL", "CB", "WR"],
  "Miami Dolphins": ["OT", "DL", "CB"],
  "Philadelphia Eagles": ["CB", "WR", "S"],
  "Houston Texans": ["CB", "WR", "DL"],
  "Dallas Cowboys": ["OL", "WR", "CB"],
  "Green Bay Packers": ["CB", "OL", "S"],
  "Tampa Bay Buccaneers": ["CB", "DL", "OL"],
  "Buffalo Bills": ["WR", "CB", "S"],
  "Detroit Lions": ["CB", "DL", "WR"],
  "Baltimore Ravens": ["CB", "WR", "OT"],
  "San Francisco 49ers": ["CB", "OL", "WR"],
  "Kansas City Chiefs": ["WR", "OT", "CB"]
};

// Generate 100 fake players with varying positions
const positions = ["QB", "WR", "RB", "OT", "CB", "S", "EDGE", "DL", "OL"];
const players = Array.from({ length: 100 }, (_, i) => ({
  name: `Player ${i + 1}`,
  position: positions[i % positions.length],
  rank: i + 1
}));

let draftOrder = [];
for (let round = 1; round <= 3; round++) {
  teams.forEach((team, pick) => {
    draftOrder.push({ round, pick: pick + 1, team });
  });
}

let availablePlayers = [...players];
let userTeam = "";
let userPicks = [];

const teamSelectDiv = document.getElementById("teamSelect");
const draftDiv = document.getElementById("draft");
const draftBoard = document.getElementById("draftBoard");
const playerChoices = document.getElementById("playerChoices");
const draftGradeDiv = document.getElementById("draftGrade");

function showTeamSelection() {
  teamSelectDiv.innerHTML = "<h2>Select Your NFL Team</h2>";
  teams.forEach(team => {
    const btn = document.createElement("button");
    btn.textContent = team;
    btn.addEventListener("click", () => {
      userTeam = team;
      startDraft();
    });
    teamSelectDiv.appendChild(btn);
  });
}

function startDraft() {
  teamSelectDiv.style.display = "none";
  draftDiv.style.display = "block";
  draftBoard.innerHTML = "";
  playerChoices.innerHTML = "";
  draftGradeDiv.innerHTML = "";
  pickNext(0);
}

function pickNext(index) {
  if (index >= draftOrder.length) {
    showDraftGrade();
    return;
  }

  const currentPick = draftOrder[index];
  const roundPicks = draftOrder.filter(p => p.round === currentPick.round);
  const userHasPick = roundPicks.some(p => p.team === userTeam);
  const isStartOfRound = roundPicks[0].pick === currentPick.pick;

  if (!userHasPick && isStartOfRound) {
    simulateRound(currentPick.round);
    pickNext(index + roundPicks.length);
    return;
  }

  if (currentPick.team === userTeam) {
    playerChoices.innerHTML = "<h3>Your Pick — Choose a Player:</h3>";
    availablePlayers.slice(0, 10).forEach(player => {
      const btn = document.createElement("button");
      btn.textContent = `#${player.rank} ${player.name} (${player.position})`;
      btn.addEventListener("click", () => {
        availablePlayers = availablePlayers.filter(p => p !== player);
        userPicks.push({ ...player, round: currentPick.round, pick: currentPick.pick });
        addPickToBoard(currentPick, player, true);
        playerChoices.innerHTML = "";
        pickNext(index + 1);
      });
      playerChoices.appendChild(btn);
    });
  } else {
    const best = availablePlayers.shift();
    addPickToBoard(currentPick, best, false);
    pickNext(index + 1);
  }
}

function simulateRound(round) {
  const picks = draftOrder.filter(p => p.round === round);
  picks.forEach(p => {
    const best = availablePlayers.shift();
    addPickToBoard(p, best, false);
  });
}

function addPickToBoard(pick, player, isUser) {
  const row = document.createElement("div");
  row.textContent = `Round ${pick.round}, Pick ${pick.pick} - ${pick.team}: ${player.name} (${player.position})`;
  if (isUser) row.classList.add("bold");
  draftBoard.appendChild(row);
}

function showDraftGrade() {
  let score = 0;
  const needs = positionNeeds[userTeam] || [];
  userPicks.forEach(p => {
    const needScore = needs.includes(p.position) ? 10 : 5;
    const rankScore = 100 - p.rank;
    score += needScore + rankScore;
  });
  const avg = score / userPicks.length;
  let grade = "C";
  if (avg > 90) grade = "A+";
  else if (avg > 80) grade = "A";
  else if (avg > 70) grade = "B";
  else if (avg > 60) grade = "C";
  else grade = "D";

  draftGradeDiv.innerHTML = `<h2>Your Draft Grade: ${grade}</h2>`;
}

showTeamSelection();
