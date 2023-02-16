window.onload = (event) => {
  var confettiElement = document.getElementById("my-canvas");
  var confettiSettings = {
    target: confettiElement,
    max: "1000",
    size: "1",
    animate: true,
    props: ["circle", "square", "triangle", "line"],
    colors: [
      [165, 104, 246],
      [230, 61, 135],
      [0, 199, 228],
      [253, 214, 126],
    ],
    clock: "25",
    rotate: true,
    width: "1920",
    height: "944",
    start_from_edge: true,
    respawn: true,
  };
  var confetti = new ConfettiGenerator(confettiSettings);
  confetti.render();
  console.log("page is fully loaded");
};
