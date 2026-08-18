const passwordOutput = document.getElementById("passwordOutput");
const copyBtn = document.getElementById("copyBtn");
const message = document.getElementById("message");
const lengthInput = document.getElementById("lengthInput");
const lengthValue = document.getElementById("lengthValue");
const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");
const strengthText = document.getElementById("strengthText");
const strengthFill = document.getElementById("strengthFill");
const generateBtn = document.getElementById("generateBtn");

const characterSets = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
};

function showMessage(text, type = "") {
  message.textContent = text;
  message.className = `message ${type}`.trim();
}

function getSelectedSets() {
  const selectedSets = [];

  if (uppercase.checked) selectedSets.push(characterSets.uppercase);
  if (lowercase.checked) selectedSets.push(characterSets.lowercase);
  if (numbers.checked) selectedSets.push(characterSets.numbers);
  if (symbols.checked) selectedSets.push(characterSets.symbols);

  return selectedSets;
}

function getRandomCharacter(characters) {
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
}

function shuffleText(text) {
  return text
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

function updateStrength() {
  const length = Number(lengthInput.value);
  const selectedCount = getSelectedSets().length;
  const score = length + selectedCount * 4;

  let label = "Weak";
  let width = "34%";
  let color = "#dc2626";

  if (score >= 24) {
    label = "Strong";
    width = "85%";
    color = "#16a34a";
  } else if (score >= 16) {
    label = "Medium";
    width = "58%";
    color = "#f59e0b";
  }

  strengthText.textContent = label;
  strengthText.style.color = color;
  strengthFill.style.width = width;
  strengthFill.style.background = color;
}

function generatePassword() {
  const length = Number(lengthInput.value);
  const selectedSets = getSelectedSets();

  if (selectedSets.length === 0) {
    passwordOutput.value = "";
    showMessage("Please select at least one character option.", "error");
    return;
  }

  let password = "";
  const allCharacters = selectedSets.join("");

  selectedSets.forEach((set) => {
    if (password.length < length) {
      password += getRandomCharacter(set);
    }
  });

  while (password.length < length) {
    password += getRandomCharacter(allCharacters);
  }

  passwordOutput.value = shuffleText(password);
  showMessage("Password generated successfully.", "success");
}

async function copyPassword() {
  if (!passwordOutput.value) {
    showMessage("Generate a password first.", "error");
    return;
  }

  try {
    await navigator.clipboard.writeText(passwordOutput.value);
    showMessage("Password copied to clipboard.", "success");
  } catch {
    passwordOutput.select();
    document.execCommand("copy");
    showMessage("Password copied to clipboard.", "success");
  }
}

lengthInput.addEventListener("input", () => {
  lengthValue.textContent = lengthInput.value;
  updateStrength();
});

[uppercase, lowercase, numbers, symbols].forEach((checkbox) => {
  checkbox.addEventListener("change", updateStrength);
});

generateBtn.addEventListener("click", generatePassword);
copyBtn.addEventListener("click", copyPassword);

updateStrength();
generatePassword();
