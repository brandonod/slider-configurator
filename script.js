// === Element Selectors ===
const sliderConfig       = document.querySelector('#sliderConfig');
const sliderValueSpan    = document.querySelector('#sliderValue');
const maxValue           = document.querySelector('#maxValue'); // Optional if you want dynamic max
const minValue           = document.querySelector('#minValue'); // Optional if you want dynamic min
const unitTypeInput      = document.querySelector('#unitType');
const phraseInput        = document.querySelector('#phrase');
const sliderOutputText   = document.querySelector('#sliderOutputText');
const percentageDiscount = document.querySelector('#percentageDiscount');
const unitDiscountStart  = document.querySelector('#unitDiscountStartFrom');

// === State Variables ===
let currentCreditAmount = parseInt(sliderConfig.value, 10);
let currentUnitType = unitTypeInput.value.trim() || 'credits';
let discountPercent = parseFloat(percentageDiscount.value) || 0;
let unitDiscountStartFrom = parseInt(unitDiscountStart.value, 10) || 5;
let templatePhrase = phraseInput.value.trim();

// === Price Config ===
const basePricePerUnit = 10; // Example price per unit

// === Event Listeners ===

// Update slider value and output
sliderConfig.addEventListener('input', (e) => {
  currentCreditAmount = parseInt(e.target.value, 10);
  sliderValueSpan.textContent = currentCreditAmount;
  updateSliderOutput();
});

// Update unit type and output
unitTypeInput.addEventListener('input', (e) => {
  currentUnitType = e.target.value.trim() || 'credits';
  updateSliderOutput();
});

// Update discount percent and output
percentageDiscount.addEventListener('input', (e) => {
  discountPercent = parseFloat(e.target.value) || 0;
  updateSliderOutput();
});

// Update discount start threshold and output
unitDiscountStart.addEventListener('input', (e) => {
  unitDiscountStartFrom = parseInt(e.target.value, 10) || 5;
  updateSliderOutput();
});

// Update phrase template and output
phraseInput.addEventListener('input', (e) => {
  templatePhrase = e.target.value.trim() || "Purchase [UNITS_AMOUNT] [UNITS] and receive a [DISCOUNT] discount, making your total just [PRICE]!";
  updateSliderOutput();
});

// === Pricing Logic ===
function calculatePrice() {
  let total = currentCreditAmount * basePricePerUnit;
  if (currentCreditAmount >= unitDiscountStartFrom) {
    total *= (1 - discountPercent / 100);
  }
  return total.toFixed(2);
}

function getDiscountText() {
  if (currentCreditAmount >= unitDiscountStartFrom) {
    return discountPercent + '%';
  }
  return '0%';
}

// === Update Output Text ===
function updateSliderOutput() {
  let output = templatePhrase;

  output = output.replace(/\[UNITS_AMOUNT\]/g, currentCreditAmount);
  output = output.replace(/\[UNITS\]/g, currentUnitType);
  output = output.replace(/\[DISCOUNT\]/g, getDiscountText());
  output = output.replace(/\[PRICE\]/g, calculatePrice());

  sliderOutputText.textContent = output;
}

// Initialize display on page load
sliderValueSpan.textContent = currentCreditAmount;
updateSliderOutput();
