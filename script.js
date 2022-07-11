"use strict";

const prizes = [
  0.01, 1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750, 1000, 5000, 10000,
  25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000,
];

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
const playerNum = document.querySelector(".player-number");
const playerCase = document.querySelector(".player-case");
const prizesAll = document.querySelectorAll(".prize");
const promptMsg = document.querySelector(".prompt-msg");
const caseRevealModal = document.querySelector(".case-reveal-modal");
const caseAmount = document.querySelector(".case-amount");
const offerModal = document.querySelector(".offer-modal");
const offerAmount = document.querySelector(".offer-amount");
const noDealBtn = document.querySelector(".no-deal-btn");
const prevOffersList = document.querySelector(".previous-offers-list");

const oneMoreCaseMsg = "Please choose 1 more case to open.";
let chosenCase = null;
const hideFunc = (el) => el.classList.toggle("hidden");

const caseElim = function () {
  imgDiv.forEach((div) => {
    div.addEventListener("click", function () {
      ///////////////////////////////////CALCULATE CASE AMOUNT/////////////////////////////////
      if (chosenCase) {
        const i = Math.round(Math.random() * (prizes.length - 1));
        console.log(i);
        const prizeAmount = `$${prizes[i].toLocaleString("en-US")}`;
        prizes.splice(i, 1);
        console.log(prizeAmount);

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
                if (prizes.length > number) {
                  promptMsg.innerText = `Please choose ${
                    prizes.length - number
                  } more cases to open.`;
                  if (prizes.length - number === 1)
                    promptMsg.innerText = oneMoreCaseMsg;
                }
              };

              promptMsgFunc(6);
              promptMsgFunc(8);
              promptMsgFunc(11);
              promptMsgFunc(15);
              promptMsgFunc(20);
            });

            ///////////////////////////////////BANK OFFER/////////////////////////////////
            const offerFunc = function (percent) {
              hideFunc(offerModal);
              const offer = prizes.reduce((acc, prize, _, arr) => {
                return acc + prize * (1 / arr.length);
              }, 0);
              return Math.round(
                (((offer / 100) * 100 * percent) / 100) * 100
              ).toLocaleString("en-US");
            };

            const prevOffersFunc = (i) => {
              const li = document.createElement("li");
              li.innerText = offers[i];
              prevOffersList.appendChild(li);
            };

            const offers = [];

            const offerRoundFunc = function () {
              if (prizes.length === 20) {
                const offer1 = (offerAmount.innerText = `$${offerFunc(0.2)}`);
                offers.push(offer1);
                console.log(offers[0]);
              }
              if (prizes.length === 15) {
                const offer2 = (offerAmount.innerText = `$${offerFunc(0.3)}`);
                offers.push(offer2);
                console.log(offers);
                prevOffersFunc(0);
              }
              if (prizes.length === 11) {
                const offer3 = (offerAmount.innerText = `$${offerFunc(0.6)}`);
              }
              if (prizes.length === 8) {
                const offer4 = (offerAmount.innerText = `$${offerFunc(0.8)}`);
              }
              if (prizes.length === 6) {
                const offer5 = (offerAmount.innerText = `$${offerFunc(0.9)}`);
              }
              if (prizes.length === 5) {
                const offer6 = (offerAmount.innerText = `$${offerFunc(1)}`);
              }
              if (prizes.length === 4) {
                const offer7 = (offerAmount.innerText = `$${offerFunc(1.1)}`);
              }
              if (prizes.length === 3) {
                const offer8 = (offerAmount.innerText = `$${offerFunc(1.2)}`);
              }
              if (prizes.length === 2) {
                const offer9 = (offerAmount.innerText = `$${offerFunc(1.25)}`);
              }
            };
            offerRoundFunc();

            noDealBtn.addEventListener("click", () => {
              offerModal.classList.add("hidden");
            });
          }, 1800);
        }, 1500);
      }
      if (chosenCase === null) {
        chosenCase = playerNum.innerText = div.lastElementChild.innerText;
        hideFunc(div);
        promptMsg.innerText = `Please choose 6 more cases to open`;
      }
    });
  });
};

caseElim();
