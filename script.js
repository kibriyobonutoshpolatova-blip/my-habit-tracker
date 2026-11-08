
let habits = JSON.parse(localStorage.getItem("habits")) || [];

function getDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function addHabit() {
  const input = document.getElementById("habitInput");
  const name = input.value.trim();

  if (name === "") {
    alert("Iltimos, odat nomini kiriting!");
    return;
  }

  habits.push({
    name: name,
    days: []
  });

  input.value = "";
  saveHabits();
  renderHabits();
}

function toggleHabit(index, day) {
  const days = habits[index].days;

  if (days.includes(day)) {
    habits[index].days =
      days.filter(item => item !== day);
  } else {
    days.push(day);
  }

  saveHabits();
  renderHabits();
}

function deleteHabit(index) {
  if (confirm("Odatni o‘chirishni xohlaysizmi?")) {
    habits.splice(index, 1);
    saveHabits();
    renderHabits();
  }
}

function renderHabits() {
  const list = document.getElementById("habitList");
  const stats = document.getElementById("stats");

  list.innerHTML = "";

  const today = getDateKey(new Date());
  let completed = 0;

  habits.forEach((habit, index) => {
    const done = habit.days.includes(today);

    if (done) completed++;

    const div = document.createElement("div");
    div.className = "habit";

    const name = document.createElement("span");
    name.textContent = habit.name;

    if (done) {
      name.classList.add("done");
    }

    const actions = document.createElement("div");
    actions.className = "habit-actions";

    const button = document.createElement("button");
    button.textContent = done ? "✓ Bajarildi" : "Bajarildi";
    button.onclick = () => toggleHabit(index, today);

    const del = document.createElement("button");
    del.textContent = "🗑";
    del.className = "delete-btn";
    del.onclick = () => deleteHabit(index);

    actions.append(button, del);
    div.append(name, actions);
    list.appendChild(div);
  });

  let weeklyTotal = 0;
  const calendar = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const key = getDateKey(date);
    const count = habits.filter(h =>
      h.days.includes(key)
    ).length;

    weeklyTotal += count;

    const names = [
      "Yak", "Du", "Se", "Ch", "Pa", "Ju", "Sh"
    ];

    calendar.push(`
      <div class="day-card">
        <small>${names[date.getDay()]}</small>
        <strong>${date.getDate()}</strong>
        <span>${count}/${habits.length}</span>
        <div class="day-dot ${
          count === habits.length && habits.length > 0
            ? "active" : ""
        }"></div>
      </div>
    `);
  }

  const possible = habits.length * 7;
  const percent = possible
    ? Math.round(weeklyTotal / possible * 100)
    : 0;

  stats.innerHTML = `
    <h3>📅 Haftalik kalendar</h3>
    <div class="weekly-calendar">
      ${calendar.join("")}
    </div>

    <h3>📊 Haftalik natija</h3>
    <p>Bugun: ${completed}/${habits.length} ta bajarildi.</p>
    <p>Haftalik bajarilish: ${weeklyTotal} ta</p>
    <p>Umumiy natija: ${percent}%</p>

    <div class="progress">
      <div class="progress-fill"
        style="width:${percent}%"></div>
    </div>
  `;
}

renderHabits();
