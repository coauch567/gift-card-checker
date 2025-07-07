async function checkValue() {
  const type = document.getElementById('cardType').value;
  const amount = parseFloat(document.getElementById('cardAmount').value);
  const currency = document.getElementById('currency').value;

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid card amount.");
    return;
  }

  // Load local payout rates
  const res = await fetch('data/cardValues.json');
  const rates = await res.json();

  if (!rates[type]) {
    alert("Card type not supported.");
    return;
  }

  const usdValue = amount * rates[type]; // Convert card to USD equivalent

  // Get real-time exchange rate from USD to selected currency
  const currencySymbol = currency;
  let currencyCode = "USD";

  if (currency === "₦") currencyCode = "NGN";
  else if (currency === "€") currencyCode = "EUR";
  else currencyCode = "USD";

  const apiRes = await fetch(`https://api.exchangerate.host/convert?from=USD&to=${currencyCode}`);
  const data = await apiRes.json();

  const convertedValue = usdValue * data.result;

  // Show converted payout
  document.getElementById('result').innerText = `Estimated payout: ${currencySymbol}${convertedValue.toFixed(2)}`;
}
