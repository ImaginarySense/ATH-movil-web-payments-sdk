(function() {
  // Use JavaScript Strict Mode.
  "use strict";

  // QuickLog
  var log = console.log;
  log("Web transaction simulation begin");

  // Random intefer generator
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // HTTP Server Constants
  var cart_id = getRandomInt(299999,100000); // Cart Session ID
  log("Cart ID: "+cart_id);

  // Cart variables
  var itemValues = [
    {
      title: "Teleprompter by Imaginary Films",
      shortcode: "teleprompter",
      cost: "19.99",
      unit: "USD",
      quantity: "1"
    },
    {
      name: "Duplex Printer",
      shortcode: "duplexprinter",
      cost: "4.99",
      unit: "USD",
      quantity: "1"
    } ],
    amountDOM = [],
    priceDOM = [],
    total = [];
 
  // Main function
  function init() {
    // Get item's quantity update from DOM
    amountDOM = document.getElementsByClassName("amount");
    priceDOM = document.getElementsByClassName("price");
    total = [0, document.getElementById("total") ];
    document.getElementById("update").onclick = function(){ updateAmounts(); return false; };
    document.getElementById("continueShopping").onclick = function(){ alert("The cake is a lie! You can't continue shopping."); return false; };
    document.getElementById("checkout").onclick = function(){ proceedToCheckout(); return false; };

    // Set initial amounts from hardcoded HTML
    updateAmounts();
  }

  // Push data to sidebar
  function updateAmounts() {
    // Update quantities in js
    amountDOM = document.getElementsByClassName("amount");
    // Get Subtotal
    var len = amountDOM.length,
      acum = 0;
    for (var i=0; i<len; i++)
      acum += parseFloat( priceDOM[i].innerText ) * parseFloat( amountDOM[i].value );
    // Update Total
    total[0] = acum.toFixed(2);
    total[1].innerText = acum.toFixed(2);
  }

  function proceedToCheckout() {
    // Update cart
    updateAmounts();
    // Save transaction data
    sessionStorage.orderSubtotal = total[0];
    sessionStorage.ref_id = cart_id;

    log(sessionStorage.orderTotal);
    log(sessionStorage.ref_id);

    window.location = "checkout.html";
  }

  // Initialize objects after DOM is loaded
  if (document.readyState === "interactive" || document.readyState === "complete")
    // Call init if the DOM (interactive) or document (complete) is ready.
    init();
  else
    // Set init as a listener for the DOMContentLoaded event.
    document.addEventListener("DOMContentLoaded", init);
}());
