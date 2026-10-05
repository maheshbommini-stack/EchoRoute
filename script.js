const calculateButton =
  document.getElementById("calculate");

const results =
  document.getElementById("results");

const transportContainer =
  document.getElementById("transport");

const slider =
  document.getElementById("tripSlider");

const days =
  document.getElementById("days");

const monthly =
  document.getElementById("monthly");

const fromInput =
  document.getElementById("from");

const toInput =
  document.getElementById("to");


/*
TRANSPORT DATA

These values are demonstration estimates.
*/

const transportOptions = [

  {
    name: "Train",
    icon: "🚆",
    time: "5h 45m",
    cost: "₹850",
    carbon: 6.8,
    best: true
  },

  {
    name: "Bus",
    icon: "🚌",
    time: "7h 30m",
    cost: "₹650",
    carbon: 12.4,
    best: false
  },

  {
    name: "Car",
    icon: "🚗",
    time: "6h 10m",
    cost: "₹3,200",
    carbon: 48.2,
    best: false
  },

  {
    name: "Flight",
    icon: "✈️",
    time: "1h 05m",
    cost: "₹4,800",
    carbon: 55.7,
    best: false
  }

];


/*
CALCULATE JOURNEY
*/

calculateButton.addEventListener(
  "click",
  calculateJourney
);


function calculateJourney() {

  const from =
    fromInput.value.trim() ||
    "Chennai";

  const to =
    toInput.value.trim() ||
    "Bengaluru";


  /*
  UPDATE ROUTE TITLE
  */

  document.getElementById(
    "routeTitle"
  ).textContent =
    `${from} → ${to}`;


  /*
  GREEN SCORE
  */

  document.getElementById(
    "greenScore"
  ).textContent = "94";


  /*
  BEST OPTION
  */

  document.getElementById(
    "bestOption"
  ).textContent =
    transportOptions[0].name;


  /*
  CO2 SAVING
  */

  const highestCarbon =
    Math.max(
      ...transportOptions.map(
        option => option.carbon
      )
    );


  const lowestCarbon =
    Math.min(
      ...transportOptions.map(
        option => option.carbon
      )
    );


  const saved =
    highestCarbon - lowestCarbon;


  document.getElementById(
    "saved"
  ).textContent =
    saved.toFixed(1) + " kg";


  /*
  TRANSPORT CARDS
  */

  transportContainer.innerHTML =
    transportOptions
      .map(option => createCard(option))
      .join("");


  /*
  INITIAL MONTHLY VALUE
  */

  updateMonthlySaving();


  /*
  SHOW RESULTS
  */

  results.classList.remove(
    "hidden"
  );


  /*
  SCROLL TO RESULTS
  */

  setTimeout(() => {

    results.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }, 100);

}


/*
CREATE TRANSPORT CARD
*/

function createCard(option) {

  return `

    <article
      class="
        transport-card
        ${option.best ? "best" : ""}
      "
    >

      ${
        option.best
        ?
        `<span class="best-label">
          GREENEST CHOICE
        </span>`
        :
        ""
      }


      <div class="transport-icon">
        ${option.icon}
      </div>


      <h3>
        ${option.name}
      </h3>


      <div class="data">

        TRAVEL TIME

        <b>
          ${option.time}
        </b>

      </div>


      <div class="data">

        ESTIMATED COST

        <b>
          ${option.cost}
        </b>

      </div>


      <div class="data">

        CO₂ EMISSIONS

        <b
          class="${option.best ? "green" : ""}"
        >
          ${option.carbon} kg
        </b>

      </div>

    </article>

  `;
}


/*
SLIDER
*/

slider.addEventListener(
  "input",
  updateMonthlySaving
);


function updateMonthlySaving() {

  const tripCount =
    Number(slider.value);


  days.textContent =
    tripCount;


  /*
  Demonstration calculation.

  Car emissions:
  48.2 kg

  Train emissions:
  6.8 kg
  */

  const savingPerTrip =
    48.2 - 6.8;


  const monthlySaving =
    savingPerTrip * tripCount;


  monthly.textContent =
    monthlySaving.toFixed(1) + " kg";

}


/*
ENTER KEY SUPPORT
*/

[fromInput, toInput].forEach(
  input => {

    input.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter"
        ) {

          calculateJourney();

        }

      }
    );

  }
);
