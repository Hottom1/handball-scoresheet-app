let teamAScore = 0;
let teamBScore = 0;
let timer = 1800; // 30 minutes in seconds
let interval;
let players = [];

// Add Player to Roster
function addPlayer(rosterId) {
  const number = prompt("Enter player number:");
  const name = prompt("Enter player name:");
  const table = document.getElementById(rosterId);
  const row = table.insertRow(-1);
  const cell1 = row.insertCell(0);
  const cell2 = row.insertCell(1);
  const cell3 = row.insertCell(2);
  cell1.textContent = number;
  cell2.textContent = name;
  cell3.innerHTML = `
    <div class="actions">
      <button onclick="recordShot('${rosterId}', ${number}, '${name}', true)">Goal Scored</button>
      <button onclick="recordShot('${rosterId}', ${number}, '${name}', false)">Shot Missed</button>
      <button onclick="recordSave('${rosterId}', ${number}, '${name}')">Save Made</button>
    </div>
  `;
  players.push({ rosterId, number, name, shotsAttempted: 0, goalsScored: 0, saves: 0, goalsConceded: 0 });
}

// Record Shot (Goal Scored or Shot Missed)
function recordShot(rosterId, number, name, isGoal) {
  const player = players.find(p => p.rosterId === rosterId && p.number === number);
  if (player) {
    player.shotsAttempted++;
    if (isGoal) {
      player.goalsScored++;
      if (rosterId === 'rosterA') {
        teamAScore++;
        document.getElementById('scoreA').textContent = teamAScore;
      } else {
        teamBScore++;
        document.getElementById('scoreB').textContent = teamBScore;
      }
    }
    updateShooterStats();
  }
}

// Record Save
function recordSave(rosterId, number, name) {
  const player = players.find(p => p.rosterId === rosterId && p.number === number);
  if (player) {
    player.saves++;
    updateGoalkeeperStats();
  }
}

// Update Goalkeeper Stats
function updateGoalkeeperStats() {
  const statsDiv = document.getElementById('goalkeeperStats');
  statsDiv.innerHTML = '<h3>Goalkeepers</h3>';
  players.filter(p => p.saves > 0).forEach(gk => {
    statsDiv.innerHTML += `
      <p>${gk.name} (${gk.number}): Saves - ${gk.saves}, Goals Conceded - ${gk.goalsConceded}, Save % - ${((gk.saves / (gk.saves + gk.goalsConceded)) * 100 || 0).toFixed(2)}%</p>
    `;
  });
}

// Update Shooter Stats
function updateShooterStats() {
  const statsDiv = document.getElementById('shooterStats');
  statsDiv.innerHTML = '<h3>Shooters</h3>';
  players.filter(p => p.shotsAttempted > 0).forEach(sh => {
    statsDiv.innerHTML += `
      <p>${sh.name} (${sh.number}): Shots Attempted - ${sh.shotsAttempted}, Goals Scored - ${sh.goalsScored}, Shooting % - ${((sh.goalsScored / sh.shotsAttempted) * 100 || 0).toFixed(2)}%</p>
    `;
  });
}

// Update Team Names
function updateTeamName(teamId) {
  const teamName = document.getElementById(teamId).value;
  if (teamId === 'teamA') {
    document.getElementById('teamAName').textContent = `${teamName} Roster`;
    document.getElementById('teamAScoreName').textContent = teamName;
  } else {
    document.getElementById('teamBName').textContent = `${teamName} Roster`;
    document.getElementById('teamBScoreName').textContent = teamName;
  }
}

// Start Timer
function startTimer() {
  clearInterval(interval);
  interval = setInterval(() => {
    timer--;
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    if (timer <= 0) clearInterval(interval);
  }, 1000);
}

// Stop Timer
function stopTimer() {
  clearInterval(interval);
}

// Export Data as CSV
function exportData() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Match Information\n";
  csvContent += `Date: ${document.getElementById('date').value}\n`;
  csvContent += `Location: ${document.getElementById('location').value}\n`;
  csvContent += `Team A: ${document.getElementById('teamA').value}\n`;
  csvContent += `Team B: ${document.getElementById('teamB').value}\n\n`;
  csvContent += "Goalkeeper Stats\n";
  players.filter(p => p.saves > 0).forEach(gk => {
    csvContent += `${gk.name} (${gk.number}): Saves - ${gk.saves}, Goals Conceded - ${gk.goalsConceded}, Save % - ${((gk.saves / (gk.saves + gk.goalsConceded)) * 100 || 0).toFixed(2)}%\n`;
  });
  csvContent += "\nShooter Stats\n";
  players.filter(p => p.shotsAttempted > 0).forEach(sh => {
    csvContent += `${sh.name} (${sh.number}): Shots Attempted - ${sh.shotsAttempted}, Goals Scored - ${sh.goalsScored}, Shooting % - ${((sh.goalsScored / sh.shotsAttempted) * 100 || 0).toFixed(2)}%\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "handball_scoresheet.csv");
  document.body.appendChild(link);
  link.click();
}

// Email Data
function emailData() {
  const subject = "Handball Scoresheet Data";
  const body = `Match Information:\nDate: ${document.getElementById('date').value}\nLocation: ${document.getElementById('location').value}\nTeam A: ${document.getElementById('teamA').value}\nTeam B: ${document.getElementById('teamB').value}\n\nGoalkeeper Stats:\n${players.filter(p => p.saves > 0).map(gk => `${gk.name} (${gk.number}): Saves - ${gk.saves}, Goals Conceded - ${gk.goalsConceded}, Save % - ${((gk.saves / (gk.saves + gk.goalsConceded)) * 100 || 0).toFixed(2)}%`).join("\n")}\n\nShooter Stats:\n${players.filter(p => p.shotsAttempted > 0).map(sh => `${sh.name} (${sh.number}): Shots Attempted - ${sh.shotsAttempted}, Goals Scored - ${sh.goalsScored}, Shooting % - ${((sh.goalsScored / sh.shotsAttempted) * 100 || 0).toFixed(2)}%`).join("\n")}`;
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}