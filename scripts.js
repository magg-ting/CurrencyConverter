document.addEventListener("DOMContentLoaded", function () {
  //API key
  const apiKey = "cur_live_cGaWh9YIZOzrDdtt6K5cPDJXqoefH64RJ8q0Wrl7";

  //Document elements
  var fromCurrency = document.getElementById("from");
  var toCurrency = document.getElementById("to");
  var amount = document.getElementById("amount");
  var convertBtn = document.getElementById("convert");
  var swapBtn = document.getElementById("swap");

  //Function to get all avialble currencies to populate the select dropdown menu
  function fetchCurrencyData() {

    //Check if there is existing session data on the list of available currencies
    var currencyData = sessionStorage.getItem("currencyData");
    if (currencyData) {
      console.log("Fetching locally stored session data...");
      setCurrencyOptions(JSON.parse(currencyData));
    } 
    
    //If not, make an API call to get the list of supported currencies
    else {
      const baseCurrencyUrl =
        "https://api.currencyapi.com/v3/currencies?apikey=";
      console.log("Making API call...");
      fetch(baseCurrencyUrl + apiKey)
        .then((response) => response.json())
        .then((jsonData) => {
          //Store the JSON response in session data for reuse
          sessionStorage.setItem("currencyData", JSON.stringify(jsonData.data));
          setCurrencyOptions(jsonData.data);
        })
        .catch((error) => {
          console.error("Error fetching currency list: ", error);
        });
    }
  }

  //Function to populate the select options using the list of available currencies
  function setCurrencyOptions(jsonData) {
    Object.keys(jsonData).forEach((currency) => {
      var currencyCode = jsonData[currency].code;
      var currencyName = jsonData[currency].name;
      //Create an <option> element for each currency
      var fromOption = document.createElement("option");
      fromOption.value = currencyCode;
      fromOption.innerText = currencyCode + " - " + currencyName;
      //Clone the <option> element for the other select dropdown as well
      var toOption = fromOption.cloneNode(true);
      //Append the newly created <option> elements to the select dropdown menus
      fromCurrency.appendChild(fromOption);
      toCurrency.appendChild(toOption);
    });
  }

  //Function to convert the input amount from one currency to another
  function convert() {
    const baseRateUrl = "https://api.currencyapi.com/v3/latest?apikey=";
    var from = fromCurrency.value;
    var to = toCurrency.value;
    var inputAmount = amount.value;
    var result = document.getElementById("result");
    var rate = document.getElementById("rate");

    //Make an API call to fetch the latest exchange rate of the currency pair
    if (inputAmount) {
      var getRateUrl =
        baseRateUrl + apiKey + `&base_currency=${from}&currencies[]=${to}`;
      console.log(getRateUrl);
      fetch(getRateUrl)
        .then((response) => response.json())
        .then((jsonData) => {
          var latestRate = jsonData.data[to].value;
          var resultValue = inputAmount * latestRate;

          //Display the result
          var resultText = `${inputAmount} ${from} = ${resultValue.toFixed(2)} ${to}`;
          result.textContent = resultText;
          result.style.color = "darkblue";

          var rateText = `1 ${from} = ${latestRate.toFixed(4)} ${to}`;
          rate.textContent = rateText;
        })
        .catch((error) => {
          console.error("Error fetching exchange rate: ", error);
        });
    } 
    
    //If user has not entered any amount, show an error message
    else {
      result.textContent = "Please enter an amount.";
      result.style.color = "red";
    }
  }

  //Function to swap the base currency and target currency
  function swap() {
    var from = fromCurrency.value;
    var to = toCurrency.value;
    fromCurrency.value = to;
    toCurrency.value = from;
  }


  //Call the fetchCurrencyData function to populate the select currency options
  fetchCurrencyData();

  //Add event listeners to the convert button and the swap currency icon respectively
  convertBtn.addEventListener("click", convert);
  swapBtn.addEventListener("click", swap);
  
});
