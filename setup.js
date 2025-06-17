let selectedSubjects = [];
let selectedPoints = null;
let previouslySelectedRadio = null;

// Toggle dropdown
function toggleDropdown(type) {
  document.getElementById(`dropdown-options-${type}`).classList.toggle("show");
}

// Update selected options
function updateSelected(type) {
  const optionsContainer = document.getElementById(`dropdown-options-${type}`);
  const display = document.getElementById(`selected-options-${type}`);

  if (type === 'points') {
    const selected = optionsContainer.querySelector('input[type="radio"]:checked');
    selectedPoints = selected ? selected.value : null;
    display.textContent = selectedPoints || '';
  } else {
    const checkboxes = optionsContainer.querySelectorAll('input[type="checkbox"]');
    selectedSubjects = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    display.textContent = selectedSubjects.length ? selectedSubjects.join(', ') : '';
  }
}

// Close dropdowns on outside click
window.addEventListener('click', function(e) {
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    if (!dropdown.contains(e.target)) {
      dropdown.querySelector('.dropdown-content').classList.remove('show');
    }
  });
});

// Custom radio toggle
function handleRadioClick(radio, type) {
  if (radio === previouslySelectedRadio) {
    radio.checked = false;
    previouslySelectedRadio = null;
  } else {
    previouslySelectedRadio = radio;
  }
  updateSelected(type);
}

// Start game: save to localStorage & redirect
function startTriviaGame() {
  const player1Name = document.getElementById('player1-name').value.trim();
  const player2Name = document.getElementById('player2-name').value.trim();

  if (!player1Name || !player2Name || selectedSubjects.length === 0 || !selectedPoints) {
    alert('Please fill out all fields before starting the game!');
    return;
  }

  localStorage.setItem('player1Name', player1Name);
  localStorage.setItem('player2Name', player2Name);
  localStorage.setItem('selectedSubjects', JSON.stringify(selectedSubjects));
  localStorage.setItem('selectedPoints', selectedPoints);

  window.location.href = 'game.html';
}
