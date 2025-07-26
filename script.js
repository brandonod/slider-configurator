// === Element Selectors ===
const sliderConfig         = document.querySelector('#sliderConfig');
const sliderValueSpan      = document.querySelector('#sliderValue');
const maxValue             = document.querySelector('#maxValue');
const minValue             = document.querySelector('#minValue');
const unitTypeInput        = document.querySelector('#unitType');
const unitTypeInputPlural  = document.querySelector('#unitTypePlural');
const phraseInput          = document.querySelector('#phrase');
const sliderOutputText     = document.querySelector('#sliderOutputText');
const percentageDiscount   = document.querySelector('#percentageDiscount');
const unitDiscountStart    = document.querySelector('#unitDiscountStartFrom');
const btnGetCode           = document.querySelector('#btnGetCode');
const codeBox              = document.querySelector('#codeBox');
const pricePerUnit         = document.querySelector('#pricePerUnit');
const currency             = document.querySelector('#currency');
const defaultUnitAmount   = document.querySelector('#defaultUnitAmount');

// === Currency Map ===
const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£"
};

// === State Variables ===
let currentCreditAmount     = parseInt(sliderConfig.value, 10);
let currentUnitType         = unitTypeInput.value.trim() || "credit";
let currentUnitTypePlural   = unitTypeInputPlural.value.trim() || "credits";
let discountPercent         = parseFloat(percentageDiscount.value) || 0;
let unitDiscountStartFrom   = parseInt(unitDiscountStart.value, 10) || 5;
let currentMinValue         = parseInt(minValue.value, 10) || 1;
let currentMaxValue         = parseInt(maxValue.value, 10) || 100;
let templatePhrase          = phraseInput.value.trim() || "Purchase [UNITS_AMOUNT] [UNITS] and receive a [DISCOUNT] discount, making your total just [CURRENCY_TYPE][PRICE]!";
let basePricePerUnit        = parseFloat(pricePerUnit.value) || 10;
let currentCurrencyCode     = currency.value;
let currentCurrencySymbol   = currencySymbols[currentCurrencyCode] || "$";
let currentDefaultUnitAmount = defaultUnitAmount.value;

// === Design Variables ===
let trackColor = '#cccccc';
let progressColor = '#ff0000';
let thumbColor = '#000000';
let thumbRadius = '50%';
let thumbWidth = '20px';
let sliderHeight = '8px';
let sliderOutputTextColor = '#333333';

// Initialize interval discounts array
let intervalDiscounts = [];

// === Price Config ===
pricePerUnit.addEventListener('input', (e) => {
  const value = parseFloat(e.target.value);
  basePricePerUnit = isNaN(value) ? 1 : value;
  updateSliderOutput();
});

// === Event Listeners ===
sliderConfig.addEventListener('input', (e) => {
  currentCreditAmount = parseInt(e.target.value, 10);
  sliderValueSpan.textContent = currentCreditAmount;
  updateSliderOutput();
});

defaultUnitAmount.addEventListener('input', (e) => {
  currentDefaultUnitAmount = e.target.value;
  sliderConfig.value = currentDefaultUnitAmount;
  currentCreditAmount = parseInt(currentDefaultUnitAmount, 10);
  updateSliderOutput();
});

unitTypeInput.addEventListener('input', (e) => {
  currentUnitType = e.target.value.trim() || 'credit';
  updateSliderOutput();
});

unitTypeInputPlural.addEventListener('input', (e) => {
  currentUnitTypePlural = e.target.value.trim() || 'credits';
  updateSliderOutput();
});

percentageDiscount.addEventListener('input', (e) => {
  discountPercent = parseFloat(e.target.value) || 0;
  updateSliderOutput();
});

unitDiscountStart.addEventListener('input', (e) => {
  unitDiscountStartFrom = parseInt(e.target.value, 10) || 5;
  updateSliderOutput();
});

phraseInput.addEventListener('input', (e) => {
  templatePhrase = e.target.value.trim() || "Purchase [UNITS_AMOUNT] [UNITS] and receive a [DISCOUNT] discount, making your total just [CURRENCY][PRICE]!";
  updateSliderOutput();
});

minValue.addEventListener('input', (e) => {
  currentMinValue = parseInt(e.target.value, 10);
  sliderConfig.min = currentMinValue;
  updateSliderOutput();
});

maxValue.addEventListener('input', (e) => {
  currentMaxValue = parseInt(e.target.value, 10);
  sliderConfig.max = currentMaxValue;
  updateSliderOutput();
});

currency.addEventListener('change', (e) => {
  currentCurrencyCode = e.target.value;
  currentCurrencySymbol = currencySymbols[currentCurrencyCode] || "$";
  updateSliderOutput();
});

// === Interval Logic ===
const discountMethodSelect = document.getElementById('discountMethod');
const linearOptions = document.getElementById('linearOptions');
const intervalOptions = document.querySelector('#intervalOptions');

function updateDiscountOptionsUI(method) {
    if (method === 'linear') {
        linearOptions.style.display = 'block';
        intervalOptions.style.display = 'none';
    } else if (method === 'intervals') {
        linearOptions.style.display = 'none';
        intervalOptions.style.display = 'block';
    }
}

// Initial state
updateDiscountOptionsUI(discountMethodSelect.value);

// Listen for changes
discountMethodSelect.addEventListener('change', (e) => {
    updateDiscountOptionsUI(e.target.value);
});

// Populate Interval Data 
function updateIntervalDiscountsFromUI() {
  intervalDiscounts = []; // Clear the old array

  const intervalDivs = document.querySelectorAll('.interval');

  intervalDivs.forEach(div => {
    const inputs = div.querySelectorAll('input');
    const from = parseInt(inputs[0].value, 10);
    const discount = parseFloat(inputs[1].value);

    if (!isNaN(from) && !isNaN(discount)) {
      intervalDiscounts.push({ from, discount });
    }
  });

  // Sort descending so highest thresholds are matched first
  intervalDiscounts.sort((a, b) => b.from - a.from);
}

// === Pricing Logic ===
function calculatePrice() {
  let total = currentCreditAmount * basePricePerUnit;

  if (discountMethodSelect.value === 'linear') {
    if (currentCreditAmount >= unitDiscountStartFrom) {
      total *= (1 - discountPercent / 100);
    }
  } else if (discountMethodSelect.value === 'intervals') {
    const applicable = intervalDiscounts
      .filter(tier => currentCreditAmount >= tier.from)
      .sort((a, b) => b.from - a.from)[0];
    if (applicable) {
      total *= (1 - applicable.discount / 100);
    }
  }

  return total.toFixed(2);
}

function getDiscountText() {
  if (discountMethodSelect.value === 'linear') {
    return currentCreditAmount >= unitDiscountStartFrom ? `${discountPercent}%` : '0%';
  } else if (discountMethodSelect.value === 'intervals') {
    const applicable = intervalDiscounts
      .filter(tier => currentCreditAmount >= tier.from)
      .sort((a, b) => b.from - a.from)[0];
    return applicable ? `${applicable.discount}%` : '0%';
  }
}

// === Output Update Function ===
function updateSliderOutput() {
  if (discountMethodSelect.value === 'intervals') {
    updateIntervalDiscountsFromUI();
  }

  const unitLabel = currentCreditAmount === 1 ? currentUnitType : currentUnitTypePlural;

  let output = templatePhrase
    .replace(/\[UNITS_AMOUNT\]/g, currentCreditAmount)
    .replace(/\[UNITS\]/g, unitLabel)
    .replace(/\[DISCOUNT\]/g, getDiscountText())
    .replace(/\[PRICE\]/g, calculatePrice())
    .replace(/\[CURRENCY_TYPE\]/g, currentCurrencySymbol)
    .replace(/\[CURRENCY\]/g, currentCurrencySymbol);

  sliderOutputText.textContent = output;
}

// === Initialize UI on Load ===
sliderValueSpan.textContent = currentCreditAmount;
updateSliderOutput();


// ====== DESIGN ========

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('sliderConfig');
  const trackColorInput = document.getElementById('trackColor');
  const progressColorInput = document.getElementById('progressColor');
  const thumbColorInput = document.querySelector('#thumbColorInput');

  // Initialize design variables from CSS or defaults
  trackColor = getComputedStyle(document.documentElement).getPropertyValue('--slider-track').trim() || '#cccccc';
  progressColor = getComputedStyle(document.documentElement).getPropertyValue('--slider-progress').trim() || '#ff0000';
  thumbColor = getComputedStyle(document.documentElement).getPropertyValue('--slider-thumb').trim() || "#000000";

  // Set initial color inputs
  if (trackColorInput) trackColorInput.value = trackColor;
  if (progressColorInput) progressColorInput.value = progressColor;
  if (thumbColorInput) thumbColorInput.value = thumbColor;

  function updateSliderBackground() {
    const value = slider.value;
    const min = slider.min || 0;
    const max = slider.max || 100;
    const percentage = ((value - min) / (max - min)) * 100;

    const gradient = `linear-gradient(to right, ${progressColor} 0%, ${progressColor} ${percentage}%, ${trackColor} ${percentage}%, ${trackColor} 100%)`;

    slider.style.setProperty('--slider-track-gradient', gradient);
  }

  // === Native input listeners ===
  if (thumbColorInput) {
    thumbColorInput.addEventListener('input', (e) => {
      thumbColor = e.target.value;
      document.documentElement.style.setProperty('--slider-thumb', thumbColor);
    });
  }

  if (trackColorInput) {
    trackColorInput.addEventListener('input', (e) => {
      trackColor = e.target.value;
      document.documentElement.style.setProperty('--slider-track', trackColor);
      updateSliderBackground();
    });
  }

  if (progressColorInput) {
    progressColorInput.addEventListener('input', (e) => {
      progressColor = e.target.value;
      document.documentElement.style.setProperty('--slider-progress', progressColor);
      updateSliderBackground();
    });
  }

  slider.addEventListener('input', updateSliderBackground);
  updateSliderBackground();

  // === Pickr for Track Color ===
  if (typeof Pickr !== 'undefined') {
    const trackPickr = Pickr.create({
      el: '.track-pickr',
      theme: 'classic',
      default: trackColor,
      swatches: null,
      components: {
        preview: true,
        opacity: false,
        hue: true,
        interaction: {
          hex: true,
          input: true,
          clear: false,
          save: false
        }
      }
    });

    trackPickr.on('change', (color) => {
      const hex = color.toHEXA().toString();
      trackColor = hex;
      document.documentElement.style.setProperty('--slider-track', hex);
      if (trackColorInput) trackColorInput.value = hex;
      updateSliderBackground();
    });

    // === Pickr for Progress Color ===
    const progressPickr = Pickr.create({
      el: '.progress-pickr',
      theme: 'classic',
      default: progressColor,
      swatches: null,
      components: {
        preview: true,
        opacity: false,
        hue: true,
        interaction: {
          hex: true,
          input: true,
          clear: false,
          save: false
        }
      }
    });

    progressPickr.on('change', (color) => {
      const hex = color.toHEXA().toString();
      progressColor = hex;
      document.documentElement.style.setProperty('--slider-progress', hex);
      if (progressColorInput) progressColorInput.value = hex;
      updateSliderBackground();
    });

    const thumbPickr = Pickr.create({
      el: '.thumb-pickr',
      theme: 'classic',
      default: thumbColor,
      swatches: null,
      components: {
        preview: true,
        opacity: false,
        hue: true,
        interaction: {
          hex: true,
          input: true,
          clear: false,
          save: false
        }
      }
    });

    thumbPickr.on('change', (color) => {
      const hex = color.toHEXA().toString();
      thumbColor = hex;
      document.documentElement.style.setProperty('--slider-thumb', hex);
      if (thumbColorInput) thumbColorInput.value = hex;
    });
  }
});

const sliderOutputTextColorInput = document.querySelector('#sliderOutputTextColor');

if (sliderOutputTextColorInput) {
  sliderOutputTextColorInput.addEventListener('input', (e) => {
    sliderOutputTextColor = e.target.value;
    document.documentElement.style.setProperty('--sliderOutputText', sliderOutputTextColor);
    if (sliderOutputText) sliderOutputText.style.color = sliderOutputTextColor;
  });
}

// Thumb Radius 
const thumbRadiusInput = document.querySelector('#thumbRadiusInput');
if (thumbRadiusInput) {
  thumbRadiusInput.addEventListener('input', (e) => {
    thumbRadius = e.target.value + "%";
    document.documentElement.style.setProperty('--thumb-radius', thumbRadius);
  });
}

//Thumb width 
const thumbWidthInput = document.querySelector('#thumbWidthInput');
if (thumbWidthInput) {
  thumbWidthInput.addEventListener('input', (e) => {
    thumbWidth = e.target.value + "px";
    document.documentElement.style.setProperty('--thumb-width', thumbWidth);
  });
}

//slider height 
const sliderHeightInput = document.querySelector('#sliderHeightInput');
if (sliderHeightInput) {
  sliderHeightInput.addEventListener('input', (e) => {
    sliderHeight = e.target.value + "px";
    document.documentElement.style.setProperty('--slider-height', sliderHeight);
  });
}

// === Code Generation Button ===
btnGetCode.addEventListener('click', () => {
  // Update all variables from current form values before generating code
  currentCreditAmount = parseInt(sliderConfig.value, 10);
  currentUnitType = unitTypeInput.value.trim() || "credit";
  currentUnitTypePlural = unitTypeInputPlural.value.trim() || "credits";
  discountPercent = parseFloat(percentageDiscount.value) || 0;
  unitDiscountStartFrom = parseInt(unitDiscountStart.value, 10) || 5;
  currentMinValue = parseInt(minValue.value, 10) || 1;
  currentMaxValue = parseInt(maxValue.value, 10) || 100;
  templatePhrase = phraseInput.value.trim() || "Purchase [UNITS_AMOUNT] [UNITS] and receive a [DISCOUNT] discount, making your total just [CURRENCY_TYPE][PRICE]!";
  basePricePerUnit = parseFloat(pricePerUnit.value) || 10;
  currentCurrencyCode = currency.value;
  currentCurrencySymbol = currencySymbols[currentCurrencyCode] || "$";
  
  // Get current design values
  const trackColorInput = document.getElementById('trackColor');
  const progressColorInput = document.getElementById('progressColor');
  const thumbColorInput = document.getElementById('thumbColorInput');
  const sliderOutputTextColorInput = document.getElementById('sliderOutputTextColor');
  const thumbRadiusInput = document.getElementById('thumbRadiusInput');
  const thumbWidthInput = document.getElementById('thumbWidthInput');
  const sliderHeightInput = document.getElementById('sliderHeightInput');
  
  if (trackColorInput) trackColor = trackColorInput.value;
  if (progressColorInput) progressColor = progressColorInput.value;
  if (thumbColorInput) thumbColor = thumbColorInput.value;
  if (sliderOutputTextColorInput) sliderOutputTextColor = sliderOutputTextColorInput.value;
  if (thumbRadiusInput) thumbRadius = thumbRadiusInput.value + "%";
  if (thumbWidthInput) thumbWidth = thumbWidthInput.value + "px";
  if (sliderHeightInput) sliderHeight = sliderHeightInput.value + "px";

  const htmlCode = `
<div id="pricingSlider">
  <h2 id="sliderOutput">Purchase ${currentCreditAmount} ${currentUnitType} and receive a ${getDiscountText()} discount, making your total just ${currentCurrencySymbol}${calculatePrice()}!</h2>
  <input type="range" id="sliderInput" min="${currentMinValue}" max="${currentMaxValue}" value="${currentCreditAmount}" step="1" />
</div>`;

  const jsCode = `
<script>
const sliderInput = document.getElementById('sliderInput');
const sliderOutput = document.getElementById('sliderOutput');
const basePricePerUnit = ${basePricePerUnit};
const discountPercent = ${discountPercent};
const unitDiscountStartFrom = ${unitDiscountStartFrom};
const unitType = "${currentUnitType}";
const unitTypePlural = "${currentUnitTypePlural}";
const symbol = "${currentCurrencySymbol}";
const trackColor = "${trackColor}";
const progressColor = "${progressColor}";

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

function updateSliderBackground() {
  const value = sliderInput.value;
  const min = sliderInput.min || 0;
  const max = sliderInput.max || 100;
  const percentage = ((value - min) / (max - min)) * 100;
  const gradient = \`linear-gradient(to right, \${progressColor} 0%, \${progressColor} \${percentage}%, \${trackColor} \${percentage}%, \${trackColor} 100%)\`;
  sliderInput.style.background = gradient;
}

function updateOutput(units) {
  const unitLabel = units === 1 ? unitType : unitTypePlural;
  sliderOutput.textContent = \`${templatePhrase
    .replace(/\[UNITS_AMOUNT\]/g, "\${units}")
    .replace(/\[UNITS\]/g, "\${unitLabel}")
    .replace(/\[DISCOUNT\]/g, "\${getDiscountText(units)}")
    .replace(/\[PRICE\]/g, "\${calculatePrice(units)}")
    .replace(/\[CURRENCY_TYPE\]/g, "\${symbol}")
    .replace(/\[CURRENCY\]/g, "\${symbol}")}\`;
  updateSliderBackground();
}

sliderInput.addEventListener('input', (e) => {
  updateOutput(parseInt(e.target.value, 10));
});

updateOutput(${currentCreditAmount});
updateSliderBackground();
<\/script>`;

const cssCode = `
#pricingSlider {
  --slider-track: ${trackColor};
  --slider-progress: ${progressColor};
  --slider-thumb: ${thumbColor};
  --thumb-radius: ${thumbRadius};
  --thumb-width: ${thumbWidth};
  --slider-height: ${sliderHeight};
  --sliderOutputText: ${sliderOutputTextColor};
}

input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: var(--slider-height);
  border-radius: 4px;
  outline: none;
  margin: 20px 0;
  background: linear-gradient(to right, ${trackColor} 0%, ${trackColor} 100%);
}

/* WebKit Thumb */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  width: var(--thumb-width);
  height: var(--thumb-width);
  border-radius: var(--thumb-radius);
  background-color: var(--slider-thumb);
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  z-index: 2;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Firefox Thumb */
input[type="range"]::-moz-range-thumb {
  width: var(--thumb-width);
  height: var(--thumb-width);
  border-radius: var(--thumb-radius);
  background-color: var(--slider-thumb);
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* WebKit Track */
input[type="range"]::-webkit-slider-runnable-track {
  background: transparent;
  height: var(--slider-height);
  border-radius: 4px;
}

/* Firefox Track */
input[type="range"]::-moz-range-track {
  background: transparent;
  height: var(--slider-height);
  border-radius: 4px;
  border: none;
}

#sliderOutput {
  color: var(--sliderOutputText);
}`;

  document.getElementById('htmlCode').textContent = htmlCode.trim();
  document.getElementById('jsCode').textContent = jsCode.trim();
  document.getElementById('cssCode').textContent = cssCode.trim();
  openPopup();
});

// === Popup Controls ===
function openPopup() {
  codeBox.classList.add('codeParent-flex');
}

function closePopup() {
  codeBox.classList.remove('codeParent-flex');
}

if (document.getElementById('closePopup')) {
  document.getElementById('closePopup').addEventListener('click', closePopup);
}
