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
  currentDefaultUnitAmount = e.target.value, 10;
  sliderConfig.value = currentDefaultUnitAmount;
  updateSliderOutput();
})

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
    updateIntervalDiscountsFromUI(); // <- This line is key
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

// === Code Generation Button ===
btnGetCode.addEventListener('click', () => {
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
  const unitLabel = units === 1 ? unitType : unitTypePlural;
  sliderOutput.textContent = \`${templatePhrase
    .replace(/\[UNITS_AMOUNT\]/g, "\${units}")
    .replace(/\[UNITS\]/g, "\${unitLabel}")
    .replace(/\[DISCOUNT\]/g, "\${getDiscountText(units)}")
    .replace(/\[PRICE\]/g, "\${calculatePrice(units)}")
    .replace(/\[CURRENCY_TYPE\]/g, "\${symbol}")}\`;
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

// === Popup Controls ===
function openPopup() {
  codeBox.classList.add('codeParent-flex');
}

function closePopup() {
  codeBox.classList.remove('codeParent-flex');
}
document.getElementById('closePopup').addEventListener('click', closePopup);

// === Optional: SideNav Logic
function openNav() {
  document.getElementById("sideNav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}
function closeNav() {
  document.getElementById("sideNav").style.width = "50px";
  document.getElementById("main").style.marginLeft = "0";
}

// ====== DESIGN ========

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('sliderConfig');
  const trackColorInput = document.getElementById('trackColor');
  const progressColorInput = document.getElementById('progressColor');

  let trackColor = getComputedStyle(document.documentElement).getPropertyValue('--slider-track').trim() || '#cccccc';
  let progressColor = getComputedStyle(document.documentElement).getPropertyValue('--slider-progress').trim() || '#ff0000';


  // Set initial color inputs
  trackColorInput.value = trackColor;
  progressColorInput.value = progressColor;

  function updateSliderBackground() {
  const value = slider.value;
  const min = slider.min || 0;
  const max = slider.max || 100;
  const percentage = ((value - min) / (max - min)) * 100;

  const gradient = `linear-gradient(to right, ${progressColor} 0%, ${progressColor} ${percentage}%, ${trackColor} ${percentage}%, ${trackColor} 100%)`;

  slider.style.setProperty('--slider-track-gradient', gradient);
}


  // === Native input listeners ===
  trackColorInput.addEventListener('input', (e) => {
    trackColor = e.target.value;
    document.documentElement.style.setProperty('--slider-track', trackColor);
    trackPickr.setColor(trackColor);
    updateSliderBackground();
  });

  slider.addEventListener('input', updateSliderBackground);
  updateSliderBackground();

  // === Pickr for Track Color ===
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
    trackColorInput.value = hex;
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

    progressColorInput.addEventListener('input', (e) => {
    progressColor = e.target.value;
    document.documentElement.style.setProperty('--slider-progress', progressColor);
    progressPickr.setColor(progressColor);
    updateSliderBackground();
  });

  progressPickr.on('change', (color) => {
    const hex = color.toHEXA().toString();
    progressColor = hex;
    document.documentElement.style.setProperty('--slider-progress', hex);
    progressColorInput.value = hex;
    updateSliderBackground();
  });
});
