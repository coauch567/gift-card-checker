async function checkValue() {
  const type = document.getElementById('cardType').value;
  const amount = parseFloat(document.getElementById('cardAmount').value);
  const currencySymbol = document.getElementById('currency').value;

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid card amount.");
    return;
  }

  try {
    // Fetch card payout rates
    const res = await fetch('data/cardValues.json');
    if (!res.ok) throw new Error("Failed to load card rates.");
    const rates = await res.json();

    if (!rates[type]) {
      alert(`Card type "${type}" not supported.`);
      return;
    }

    const usdValue = amount * rates[type];
    if (isNaN(usdValue)) throw new Error("Invalid USD value calculated.");

    // Determine target currency code
    let currencyCode = "USD";
    if (currencySymbol === "₦") currencyCode = "NGN";
    else if (currencySymbol === "€") currencyCode = "EUR";

    // Fetch exchange rate
    const exchangeRes = await fetch(`https://api.exchangerate.host/convert?from=USD&to=${currencyCode}`);
    if (!exchangeRes.ok) throw new Error("Currency conversion failed.");
    const data = await exchangeRes.json();

    const rate = data.result;
    if (!rate || isNaN(rate)) {
      alert("Could not fetch valid exchange rate.");
      return;
    }

    const convertedValue = usdValue * rate;
    document.getElementById('result').innerText = `Estimated payout: ${currencySymbol}${convertedValue.toFixed(2)}`;
    
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong. Please try again.");
  }
}
