const sliderConfig = document.querySelector('#sliderConfig');
const maxValue = document.querySelector('#maxValue');
const minValue = document.querySelector('#minValue');
const unitType = document.querySelector('#unitType');
const sliderOutputText = document.querySelector('#sliderOutputText');
const unitTypeText = document.querySelector('#unitTypeText')
const creditValueText = document.querySelector('#creditValueText');

// Update the range slider's max value live
maxValue.addEventListener('input', (e) => {
  const newMax = parseInt(e.target.value, 10);

  sliderConfig.max = newMax;
})

minValue.addEventListener('input', (e) => {
  const newMin = parseInt(e.target.value, 5);

  sliderConfig.min = newMin;
})

unitType.addEventListener('input', (e) => {
  const newUnitType = e.target.value.trim();

  // If the input is empty, fall back to "credits"
  if (newUnitType === '') {
    unitTypeText.textContent = ' credits';
  } else {
    unitTypeText.textContent = ' ' + newUnitType;
  }
});

/* get the phrase to reflect the value of the slider
*/