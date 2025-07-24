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
const btnGetCode         = document.querySelector('#btnGetCode');
const codeBox            = document.querySelector('#codeBox');
const sideNav            =document.querySelector('#sideNiv');
const display            = document.querySelector('#display');
const pricePerUnit       = document.querySelector('#pricePerUnit');

// === State Variables ===
let currentCreditAmount = parseInt(sliderConfig.value, 10);
let currentUnitType = unitTypeInput.value.trim() || 'credits';
let discountPercent = parseFloat(percentageDiscount.value) || 0;
let unitDiscountStartFrom = parseInt(unitDiscountStart.value, 10) || 5;
let templatePhrase = phraseInput.value.trim();

// === Price Config ===
let basePricePerUnit = 10; // Example price per unit

pricePerUnit.addEventListener('input', (e) => {
  const value = parseFloat(e.target.value); // use parseFloat for decimal support
  basePricePerUnit = isNaN(value) ? 1 : value; // fallback to 1 if input is empty or invalid

  sliderValueSpan.textContent = basePricePerUnit;
  updateSliderOutput();
});

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

// Get Code Button 
btnGetCode.addEventListener('click', () => {
  const htmlCode = `
<div id="pricingSlider">
  <h2 id="sliderOutput">Purchase ${currentCreditAmount} ${currentUnitType} and receive a ${getDiscountText()}, making your total just $${calculatePrice()}!</h2>
  <input type="range" id="sliderInput" min="1" max="20" value="${currentCreditAmount}" step="1" />
</div>`;

  const jsCode = `
<script>
const sliderInput = document.getElementById('sliderInput');
const sliderOutput = document.getElementById('sliderOutput');

const basePricePerUnit = ${basePricePerUnit};
const discountPercent = ${discountPercent};
const unitDiscountStartFrom = ${unitDiscountStartFrom};
const unitType = "${currentUnitType}";

function calculatePrice(units) {
  let total = units * basePricePerUnit;
  if (units >= unitDiscountStartFrom) {
    total *= (1 - discountPercent / 100);
  }
  return total.toFixed(2);
}

function getDiscountText(units) {
  return units >= unitDiscountStartFrom ? discountPercent + '%' : '0%';
}

function updateOutput(units) {
  sliderOutput.textContent = \`${templatePhrase
    .replace(/\[UNITS_AMOUNT\]/g, "\${units}")
    .replace(/\[UNITS\]/g, "\${unitType}")
    .replace(/\[DISCOUNT\]/g, "\${getDiscountText(units)}")
    .replace(/\[PRICE\]/g, "\${calculatePrice(units)}")}\`;
}

sliderInput.addEventListener('input', (e) => {
  updateOutput(parseInt(e.target.value, 10));
});

updateOutput(${currentCreditAmount});
<\/script>`;

  document.getElementById('htmlCode').textContent = htmlCode.trim();
  document.getElementById('jsCode').textContent = jsCode.trim();

  openPopup();
});


function openPopup() {
  document.getElementById('codeBox').classList.add('codeParent-flex');
}

function closePopup() {
  document.getElementById('codeBox').classList.remove('codeParent-flex');
}

document.getElementById('closePopup').addEventListener('click', closePopup);


// Side Navigation functionality 
function openNav() {
  document.getElementById("sideNav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("sideNav").style.width = "50px";
  document.getElementById("main").style.marginLeft = "0";
}

////////// DESIGN 
const box = document.getElementById('box');
const pickr = Pickr.create({
  el: '#color-picker-button',
  theme: 'classic',
  default: '#ff0000',
  components: {
      preview: true,
      opacity: true,
      hue: true,

      interaction: {
          hex: true,
          rgba: true,
          hsla: true,
          input: true,
          save: true
      }
  }
});

pickr.on('save', (color) => {
  const hex = color.toHEXA().toString();
  document.documentElement.style.setProperty('--track-color', hex);
  pickr.hide();
});
