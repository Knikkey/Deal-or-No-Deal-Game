"use strict";

const prizes = [
  0.01, 1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750, 1000, 5000, 10000,
  25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000,
];

const offers = [];

//////////////////////////////////////////////////////////////////////////////
// Render board

const prizesLeft = document.querySelector(".prizes--left");
const prizesRight = document.querySelector(".prizes--right");
const cases = document.querySelector(".cases");

const renderPrizes = function () {
  for (let i = 0; i < 13; i++) {
    const prize = document.createElement("span");
    prize.className = "prize";
    prize.innerHTML = `$${prizes[i].toLocaleString("en-US")}`;
    prizesLeft.appendChild(prize);
  }

  for (let i = 13; i < 26; i++) {
    const prize = document.createElement("span");
    prize.className = "prize";
    prize.innerHTML = `$${prizes[i].toLocaleString("en-US")}`;
    prizesRight.appendChild(prize);
  }
};

const renderCases = function () {
  for (let i = 1; i < 27; i++) {
    const caseBox = document.createElement("div");
    const caseImg = document.createElement("img");
    const caseNum = document.createElement("span");

    caseBox.className = "img-div";
    caseNum.className = "number";
    caseImg.className = "case-img";

    caseBox.appendChild(caseImg);
    caseBox.appendChild(caseNum);

    caseImg.src = "img/briefcase upright.png";
    caseNum.innerText = i;
    cases.appendChild(caseBox);
  }
};

renderPrizes();
renderCases();

//////////////////////////////////////////////////////////////////////////////
// Game logic
const imgDiv = document.querySelectorAll(".img-div");
const playerNum = document.querySelectorAll(".player-number");
const lastPlayerNum = document.querySelector("#last-player-number");
const playerCase = document.querySelectorAll(".player-case");
const playerCaseContainer = document.querySelector(".your-case");
const prizesAll = document.querySelectorAll(".prize");
const promptMsg = document.querySelector(".prompt-msg");
const promptContainer = document.querySelector(".prompt-container");
const caseRevealModal = document.querySelector(".case-reveal-modal");
const caseAmount = document.querySelector(".case-amount");
const offerModal = document.querySelector(".offer-modal");
const offerLine = document.querySelector(".offer-line");
const offerAmount = document.querySelector(".offer-amount");
const btns = document.querySelectorAll(".btn");
const noDealBtn = document.querySelector(".no-deal-btn");
const dealBtn = document.querySelector(".deal-btn");
const bankerOffer = document.querySelector(".banker-offer");
const prevOffersList = document.querySelector(".previous-offers-list");
const lastCase = document.querySelector(".last-case");

const oneMoreCaseMsg = "Please choose 1 more case to open.";
let chosenCase = null;
const hideFunc = (el) => el.classList.toggle("hidden");

const caseElim = function () {
  imgDiv.forEach((div) => {
    div.addEventListener("click", function () {
      if (chosenCase) {
        ///////////////////////////////////CALCULATE CASE AMOUNT/////////////////////////////////

        const i = Math.round(Math.random() * (prizes.length - 1));
        const prizeAmount = `$${prizes[i].toLocaleString("en-US")}`;
        prizes.splice(i, 1);

        ///////////////////////////////////CALCULATE BANK OFFER/////////////////////////////////

        const offerFunc = function (percent) {
          hideFunc(offerModal);
          offerModal.classList.remove("hidden");

          const offer = prizes.reduce((acc, prize, _, arr) => {
            return acc + prize * (1 / arr.length);
          }, 0);

          const calc = Math.round((offer * percent) / 100) * 100;
          offers.push(calc.toLocaleString("en-US"));
          console.log(offers);
          return calc.toLocaleString("en-US");
        };

        ///////////////////////////////////HIDE CASES & PRIZES/////////////////////////////////

        hideFunc(caseRevealModal);

        setTimeout(function () {
          caseRevealModal.style.backgroundImage =
            "url('img/briefcase open.png')";
          caseAmount.innerText = prizeAmount;

          setTimeout(() => {
            hideFunc(caseRevealModal);
            prizesAll.forEach((prize) => {
              if (prize.textContent === prizeAmount) {
                prize.style.opacity = 0;
              }

              div.classList.add("hidden");
              caseRevealModal.style.backgroundImage =
                "url('img/briefcase closed.png')";
              caseAmount.innerText = "";

              ///////////////////////////////////CHANGE PROMPT MSG/////////////////////////////////
              const promptMsgFunc = function (number) {
                if (prizes.length > number)
                  promptMsg.innerText = `Please choose ${
                    prizes.length - number
                  } more cases to open.`;
                if (prizes.length - number === 1 && prizes.length > 2)
                  promptMsg.innerText = oneMoreCaseMsg;
                if (prizes.length === 2)
                  promptMsg.innerText = "Would you like to swap your case? \n";
              };

              promptMsgFunc(6);
              promptMsgFunc(8);
              promptMsgFunc(11);
              promptMsgFunc(15);
              promptMsgFunc(20);
            });

            ///////////////////////////////////LAST 2 CASES/////////////////////////////////

            if (prizes.length === 2) {
              const btnBox = document.createElement("div");
              const yesBtn = document.createElement("button");
              const noBtn = document.createElement("button");

              btnBox.classList.add("btn-box", "hidden");
              yesBtn.classList.add("deal-btn", "btn");
              noBtn.classList.add("no-deal-btn", "btn");

              noDealBtn.addEventListener(
                "click",
                () => (btnBox.style.zIndex = 2)
              );

              yesBtn.innerText = "Yes";
              noBtn.innerText = "No";

              promptContainer.append(btnBox);
              btnBox.append(yesBtn, noBtn);

              const overlay = document.createElement("div");
              overlay.classList.add("modal", "overlay");
              cases.append(overlay);

              const btnResults = () => {
                hideFunc(offerModal);
                offerAmount.innerText = "";
                endGameScreen("Open your case and reveal your prize!");
                btnBox.style.display = "none";
              };

              noBtn.addEventListener("click", () => {
                btnResults();
              });

              yesBtn.addEventListener("click", () => {
                btnResults();
                const otherCase = document.querySelector(
                  ".img-div:not(.hidden)"
                );
                const otherCaseNum =
                  otherCase.querySelector(".number").innerText;

                lastPlayerNum.innerText = otherCaseNum;
              });
            }

            ///////////////////////////////////START FIXING/////////////////////////////////
            const prevOffersFunc = () => {
              const li = document.createElement("li");
              li.innerText = `$${offers[offers.length - 2]}`;
              prevOffersList.appendChild(li);
            };

            ///////////////////////////////////END FIXING/////////////////////////////////

            ///////////////////////////////////OFFER ROUND/////////////////////////////////

            const offerRoundFunc = function (prizesLength, percent) {
              if (prizes.length === prizesLength) {
                const offer = `$${offerFunc(percent)}`;
                offerAmount.innerText = offer;

                if (prizesLength <= 15) prevOffersFunc();
              }
            };

            offerRoundFunc(20, 0.2);
            offerRoundFunc(15, 0.3);
            offerRoundFunc(11, 0.4);
            offerRoundFunc(8, 0.6);
            offerRoundFunc(6, 0.7);
            offerRoundFunc(5, 0.8);
            offerRoundFunc(4, 0.9);
            offerRoundFunc(3, 1);
            offerRoundFunc(2, 1.05);
          }, 1);
        }, 1);
      }
      ///////////////////////////////////PLAYER CASE SELECTION/////////////////////////////////
      if (chosenCase === null) {
        chosenCase = div.lastElementChild.innerText;
        playerNum.forEach((num) => (num.innerText = chosenCase));
        hideFunc(div);
        promptMsg.innerText = `Please choose 6 more cases to open`;
      }
    });
  });
};

///////////////////////////////////DEAL/////////////////////////////////
const endGameScreen = (innerText) => {
  btns.forEach((btn) => (btn.style.display = "none"));
  offerModal.style.backgroundImage = "url('img/Deal or No Deal Wallpaper.png')";
  lastCase.classList.remove("hidden");

  bankerOffer.innerText = `${innerText}`;

  lastCase.addEventListener("click", () => {
    const i = Math.round(Math.random() * (prizes.length - 1));
    const prizeAmount = `$${prizes[i].toLocaleString("en-US")}`;
    prizes.splice(i, 1);
    hideFunc(caseRevealModal);
    hideFunc(lastCase);
    setTimeout(() => {
      caseRevealModal.style.backgroundImage = "url('img/briefcase open.png')";
      caseAmount.innerText = prizeAmount;
    }, 1800);
  });
};

dealBtn.addEventListener("click", () => {
  endGameScreen("Deal! You have won: ");

  const endGameMsg = document.createElement("span");
  endGameMsg.innerText = "Open your case to see if you made a good deal!";
  endGameMsg.classList.add("end-game-msg");
  offerModal.append(endGameMsg);
});

///////////////////////////////////NO DEAL/////////////////////////////////
noDealBtn.addEventListener("click", () => {
  hideFunc(offerModal);
  offerModal.classList.add("hidden");
});

caseElim();
