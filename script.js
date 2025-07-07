async function checkValue() {
  const type = document.getElementById('cardType').value;
  const amount = parseFloat(document.getElementById('cardAmount').value);

  const res = await fetch('data/cardValues.json');
  const rates = await res.json();

  if (!rates[type]) {
    alert("Card type not supported.");
    return;
  }

  const estimatedValue = amount * rates[type];
  document.getElementById('result').innerText = `Estimated payout: $${estimatedValue.toFixed(2)}`;
}