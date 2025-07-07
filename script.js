async function checkValue() {
  const type = document.getElementById('cardType').value;
  const amount = parseFloat(document.getElementById('cardAmount').value);
  const currencySymbol = document.getElementById('currency').value;

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid card amount.");
    return;
  }

  try {
    // Load payout rates
    const res = await fetch('data/cardValues.json');
    if (!res.ok) throw new Error("Failed to load card rates.");
    const rates = await res.json();

    if (!rates[type]) {
      alert("Card type not supported.");
      return;
    }

    const usdValue = amount * rates[type]; // Convert card to USD equivalent

    // Determine currency code from symbol
    let currencyCode = "USD";
    if (currencySymbol === "₦") currencyCode = "NGN";
    else if (currencySymbol === "€") currencyCode = "EUR";

    // Fetch real-time exchange rate
    const exchangeRes = await fetch(`https://api.exchangerate.host/convert?from=USD&to=${currencyCode}`);
    if (!exchangeRes.ok) throw new Error("Currency conversion failed.");
    const data = await exchangeRes.json();

    const convertedValue = usdValue * data.result;

    // Display result
    document.getElementById('result').innerText = `Estimated payout: ${currencySymbol}${convertedValue.toFixed(2)}`;

  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong. Please try again later.");
  }
}
