window.onload = (event) => {
    var confettiElement = document.getElementById("my-canvas");
    var confettiSettings = { target: confettiElement };
    var confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
    console.log("page is fully loaded");
  };