async function checkValue() {
  const type = document.getElementById('cardType').value;
  const amount = parseFloat(document.getElementById('cardAmount').value);
  const currencySymbol = document.getElementById('currency').value;
  const resultEl = document.getElementById('result');
  const rateInfoEl = document.getElementById('rateInfo');
  const spinnerEl = document.getElementById('loadingSpinner');

  resultEl.innerText = "";
  rateInfoEl.innerText = "";

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid card amount.");
    return;
  }

  try {
    spinnerEl.classList.remove('hidden'); // Show loading spinner

    const res = await fetch('data/cardValues.json');
    if (!res.ok) throw new Error("Failed to load card rates.");
    const rates = await res.json();

    if (!rates[type]) {
      alert(`Card type "${type}" not supported.`);
      return;
    }

    const usdValue = amount * rates[type];

    let currencyCode = "USD";
    if (currencySymbol === "₦") currencyCode = "NGN";
    else if (currencySymbol === "€") currencyCode = "EUR";

    const exchangeRes = await fetch(`https://api.exchangerate.host/convert?from=USD&to=${currencyCode}`);
    if (!exchangeRes.ok) throw new Error("Failed to fetch exchange rate.");
    const data = await exchangeRes.json();

    // ✅ Fix: Check if result is valid
    if (!data || typeof data.result !== 'number') {
      throw new Error("Exchange rate not found.");
    }

    const rate = data.result;
    const convertedValue = usdValue * rate;

    resultEl.innerText = `Estimated payout: ${currencySymbol}${convertedValue.toFixed(2)}`;
    rateInfoEl.innerText = `1 USD = ${rate.toFixed(2)} ${currencyCode}`;

  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong. Please try again later.");
  } finally {
    spinnerEl.classList.add('hidden'); // Hide spinner
  }
}
