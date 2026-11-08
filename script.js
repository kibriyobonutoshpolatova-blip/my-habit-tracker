
let habits = JSON.parse(localStorage.getItem("habits")) || [];

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

function toggleHabit(index) {
  const today = new Date().toISOString().slice(0, 10);
  const days = habits[index].days;

  if (days.includes(today)) {
    habits[index].days = days.filter(day => day !== today);
  } else {
    days.push(today);
  }

  saveHabits();
  renderHabits();
}

function renderHabits() {
  const list = document.getElementById("habitList");
  const stats = document.getElementById("stats");
  list.innerHTML = "";

  const today = new Date().toISOString().slice(0, 10);
  let completed = 0;

  habits.forEach((habit, index) => {
    const done = habit.days.includes(today);

    if (done) completed++;

    const div = document.createElement("div");
    div.className = "habit";

    const name = document.createElement("span");
    name.textContent = habit.name;
    if (done) name.classList.add("done");

    const button = document.createElement("button");
    button.textContent = done ? "✓ Bajarildi" : "Bajarildi";
    button.onclick = () => toggleHabit(index);

    div.appendChild(name);
    div.appendChild(button);
    list.appendChild(div);
  });

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6);
  const weekStart = weekAgo.toISOString().slice(0, 10);

  const weeklyTotal = habits.reduce((sum, habit) =>
    sum + habit.days.filter(day => day >= weekStart).length, 0
  );

  const possible = habits.length * 7;
  const percent = possible
    ? Math.round(weeklyTotal / possible * 100)
    : 0;

  stats.textContent = habits.length
    ? `Bugun: ${completed}/${habits.length} ta bajarildi. Haftalik natija: ${weeklyTotal} ta bajarilish (${percent}%).`
    : "Hozircha odatlar yo‘q.";
}

renderHabits();
