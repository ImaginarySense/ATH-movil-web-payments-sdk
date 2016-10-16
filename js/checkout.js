(function() {
  // Use JavaScript Strict Mode.
  "use strict";

  // QuickLog
  var log = console.log,
    subtotal, tax, total, notif;

  //document.domain = 'http://salaera.com';

  // Random intefer generator
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // HTTP Server Constants
  var bundleId = "imaginaryStore", // Identif name
    phone = "787-123-1234", // Commercial ATH Móvil Phone Number, for use in API
    ref_id = sessionStorage.ref_id,
    auth_key = "80fcfafc18a1f6d6ad82c95b994401b6", // Store ID, for use in Transaction
    // Client variables
    qrcode; // do not init
  console.log({ref_id,auth_key});
  
  // Getters
  function setSubtotal() {
    subtotal = parseFloat( sessionStorage.orderSubtotal );
    return subtotal.toFixed(2);
  }
  function setTax() {
    tax = subtotal*0.11;
    return tax.toFixed(2);
  }
  function setTotal() {
    total = subtotal + tax;
    return total.toFixed(2);
  }
  // Main function
  function init() {
    // Set order values
    document.getElementById("subtotal").innerText = setSubtotal();
    document.getElementById("sh").innerText = 0.00.toFixed(2);
    document.getElementById("tax").innerText = setTax();
    document.getElementById("total").innerText = setTotal();
    // Set Payment
    document.getElementById("athmovil").onclick = payUsingATHMovil;
    // Set QR + Notification Area
    notif = document.getElementById("qrcode");
    // Set fancybox
    $(".fancybox")
      .fancybox({
        openEffect  : 'fade',
        closeEffect : 'fade'
      });
  }

  function payUsingATHMovil() {
    // Generate QR
    var response = { };
    response.bundleId = bundleId; // From http server
    response.phone = phone; // From http server
    response.ref_id = ref_id; //_ From API server
    response.auth_key = auth_key; //_ From API server
    response.amount = total; // From Web Client
    
    // Show QR
    showQR( response );

    // Wait for QR
    waitForQR();
  }

  // QR generation should be server sided or this data be provided from the mentioned sources.
  var dataStatus;
  function waitForQR() {
    $.get("http://api.salaera.com/receipts",
      {
          bundle: bundleId,
          auth_key: auth_key,
          transaction: ref_id
      },
      function(data, status){
        if(data.data.length!=0)
          dataStatus = data.data[0].status;
        // Check reply.
        log("Status response: "+dataStatus);
        log("  Full response:");
        log(data);
        if (dataStatus==undefined)
          waitForQR();
        else if(dataStatus==1) {
          showWaitingForPaymentInUI();
          log("Begin seccond loop");
          waitForPaymentConfirmation();
        }
        else if(dataStatus==2)
          orderComplete();
        else
          QuickLog("Unknown status: "+dataStatus);
      });
   }

  function waitForPaymentConfirmation( success ) {
    log("QR Read. Waiting for payment confirmation.");
    $.get("http://api.salaera.com/receipts",
      {
          bundle: bundleId,
          auth_key: auth_key,
          transaction: ref_id
      },
      function(data, status){
        dataStatus = data.data[0].status;
        // Check reply.
        log("Server response: "+dataStatus);
        log("  Full response:");
        log(data);
        if(dataStatus==1) {
          waitForPaymentConfirmation();
        }
        else if(dataStatus==2)
          orderComplete();
        else
          log("Unknown status: "+dataStatus);
      });
    }

    function showQR( success ) {
    // If success and no QR has been generated
    if (qrcode===undefined && success) {
      // Generate QR
      qrcode = new QRCode("qrcode", {
        text: JSON.stringify(success),
        width: 256,
        height: 256,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
      });
    }
    else if (!success)
      alert("Failed to generate QR."); 
  }

  function showWaitingForPaymentInUI() {
    notif.innerHTML = '<img src="img/loading.gif"><h3>Awaiting for payment...</h3>';
  }

  function orderComplete() {
    notif.innerHTML = '<h2>Order complete!</h2>';
    //alert("Order Complete");
    setTimeout(function () {
       window.location.href = "index.html"; //will redirect to your blog page (an ex: blog.html)
    }, 3000);
  }

  // Initialize objects after DOM is loaded
  if (document.readyState === "interactive" || document.readyState === "complete")
    // Call init if the DOM (interactive) or document (complete) is ready.
    init();
  else
    // Set init as a listener for the DOMContentLoaded event.
    document.addEventListener("DOMContentLoaded", init);
}());
