async function checkValue() {
  const type = document.getElementById('cardType').value;
  const amount = parseFloat(document.getElementById('cardAmount').value);
  const currency = document.getElementById('currency').value;

  const res = await fetch('data/cardValues.json');
  const rates = await res.json();

  if (!rates[type]) {
    alert("Card type not supported.");
    return;
  }

  const estimatedValue = amount * rates[type];
  document.getElementById('result').innerText = `Estimated payout: ${currency}${estimatedValue.toFixed(2)}`;
}
