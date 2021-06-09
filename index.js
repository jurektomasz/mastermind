(function () {
  const colors = ["red", "blue", "yellow", "green", "magenta", "orange"];
  const hiddenColors = [];
  let gameOver = false;
  let pickedColor;
  let rowNumber = 1;
  let wins = 0;
  let losses = 0;

  const colorsToPick = document.querySelector("#colors");
  const guess = document.querySelector("#guess");
  const toGuess = document.querySelector("#hidden-colors");
  const submitButton = document.querySelector(".button");
  const rows = document.querySelectorAll(".row");
  const winsScore = document.querySelector("#wins");
  const lossesScore = document.querySelector("#losses");
  let colorBoxes = document.querySelectorAll(`.row-${rowNumber} .chosen-color`);

  function init() {
    winsScore.innerHTML = wins;
    lossesScore.innerHTML = losses;
    displayColorsToChoose();
    pickRandomColors(colors);
    submitButton.addEventListener("click", submit);
    rows[rowNumber - 1].style.background =
      "linear-gradient(to right,#ada996, #f2f2f2, #dbdbdb, #eaeaea)";
    colorBoxes.forEach((cb) => cb.addEventListener("click", setColor));
  }

  function playAgain() {
    reset();
    init();
  }

  function pickRandomColors(arr) {
    for (let i = 0; i < 4; i++) {
      const randomColor = Math.floor(Math.random() * arr.length);
      hiddenColors.push(arr[randomColor]);
    }
  }

  function pickColor() {
    pickedColor = this.dataset.color;
    document.querySelector("#container").style.borderColor = pickedColor;
    document.querySelector(
      "#container"
    ).style.boxShadow = `${pickedColor} 0px 2px 4px 0px,
  ${pickedColor} 0px 2px 16px 0px`;
  }

  function setColor() {
    if (pickedColor) {
      this.style.background = pickedColor;
      this.setAttribute("data-color", pickedColor);
    }
  }

  function compare(hidden, chosen) {
    let black = 0,
      white = 0;

    // Color and position match
    chosen.forEach((cc, ind) => {
      for (let i = 0; i < chosen.length; i++) {
        if (cc === hidden[i] && ind === i) {
          black++;
          hidden.splice(i, 1, NaN);
          chosen.splice(ind, 1, NaN);
          break;
        }
      }
    });

    // Only color match
    chosen.forEach((cc, ind) => {
      for (let i = 0; i < chosen.length; i++) {
        if (cc === hidden[i] && ind !== i) {
          white++;
          hidden.splice(i, 1, NaN);
          chosen.splice(ind, 1, NaN);
          break;
        }
      }
    });

    return { black, white };
  }

  function gameOverRules(black) {
    // LOSS
    if (rowNumber === rows.length && black < 4) {
      gameOver = true;
      losses++;
    }
    // WIN
    if (rowNumber <= rows.length && black === 4) {
      gameOver = true;
      wins++;
    }
    // Stop game
    if (gameOver) {
      toGuess
        .querySelectorAll(".color")
        .forEach((c, i) => (c.style.background = hiddenColors[i]));
      submitButton.textContent = "Play again?";
      submitButton.removeEventListener("click", submit);
      submitButton.addEventListener("click", playAgain);
      colorBoxes.forEach((cb) => cb.removeEventListener("click", setColor));
    }
  }

  function submit() {
    const hiddenColorsCopy = [...hiddenColors];
    const chosenColors = [];
    colorBoxes.forEach((cb) => chosenColors.push(cb.dataset.color));

    if (chosenColors.includes(undefined)) {
      alert("Fill entire row!");
      return;
    }

    let { black, white } = compare(hiddenColorsCopy, chosenColors);

    gameOverRules(black);

    const indicators = document.querySelectorAll(
      `.row-${rowNumber} .indicator`
    );
    indicators.forEach((i) => {
      if (black > 0) {
        i.style.background = "black";
        black--;
      } else if (white > 0) {
        i.style.background = "white";
        white--;
      } else {
        return;
      }
    });

    if (gameOver) return;

    chosenColors.splice(0);
    rowNumber++;
    rows[rowNumber - 1].style.background =
      "linear-gradient(to right,#ada996, #f2f2f2, #dbdbdb, #eaeaea)";
    colorBoxes.forEach((cb) => cb.removeEventListener("click", setColor));
    colorBoxes = document.querySelectorAll(`.row-${rowNumber} .chosen-color`);
    colorBoxes.forEach((cb) => cb.addEventListener("click", setColor));
  }

  function displayColorsToChoose() {
    for (let color of colors) {
      const div = document.createElement("div");
      div.classList.add("color");
      div.style.background = color;
      div.setAttribute("data-color", color);
      div.addEventListener("click", pickColor);

      colorsToPick.appendChild(div);
    }
  }

  function reset() {
    rowNumber = 1;
    gameOver = false;
    colorBoxes = document.querySelectorAll(`.row-${rowNumber} .chosen-color`);
    submitButton.removeEventListener("click", playAgain);
    submitButton.addEventListener("click", submit);
    submitButton.textContent = "SUBMIT";
    hiddenColors.splice(0);

    toGuess
      .querySelectorAll(".color")
      .forEach((c) => (c.style.background = "black"));

    while (colorsToPick.firstChild) {
      colorsToPick.removeChild(colorsToPick.lastChild);
    }

    rows.forEach((row) => (row.style.background = "inherit"));

    document.querySelectorAll(".chosen-color").forEach((cc) => {
      cc.style.background = "inherit";
      cc.removeAttribute("data-color");
    });
    document
      .querySelectorAll(".indicator")
      .forEach((cc) => (cc.style.background = "#999"));
  }

  init();
})();
