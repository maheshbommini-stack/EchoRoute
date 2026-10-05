/* =========================================================
   ECOROUTE
   Carbon-Aware Travel Planner
   Frontend JavaScript
========================================================= */


/* =========================================================
   DOM ELEMENTS
========================================================= */

const fromInput =
  document.getElementById("from");

const toInput =
  document.getElementById("to");

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

const greenScore =
  document.getElementById("greenScore");

const bestOption =
  document.getElementById("bestOption");

const saved =
  document.getElementById("saved");

const routeTitle =
  document.getElementById("routeTitle");


/* =========================================================
   APPLICATION DATA
========================================================= */


/*
  Approximate distance database.

  This keeps the project frontend-only while still
  allowing different destinations to produce different
  results.
*/

const routes = {

  "chennai-bengaluru": 350,

  "bengaluru-chennai": 350,

  "chennai-hyderabad": 630,

  "hyderabad-chennai": 630,

  "chennai-mumbai": 1330,

  "mumbai-chennai": 1330,

  "chennai-delhi": 2180,

  "delhi-chennai": 2180,

  "bengaluru-hyderabad": 570,

  "hyderabad-bengaluru": 570,

  "bengaluru-mumbai": 980,

  "mumbai-bengaluru": 980,

  "delhi-mumbai": 1400,

  "mumbai-delhi": 1400,

  "delhi-bengaluru": 2150,

  "bengaluru-delhi": 2150,

  "hyderabad-mumbai": 710,

  "mumbai-hyderabad": 710

};


/*
  Default distance if the city is not found.
*/

const DEFAULT_DISTANCE = 500;


/*
  Transportation models.

  emission = kg CO₂ per kilometer

  cost = approximate ₹ per kilometer
*/

const transportTypes = [

  {
    name: "Train",
    icon: "🚆",
    speed: 65,
    emission: 0.019,
    cost: 2.4,
    color: "#3d9b59"
  },

  {
    name: "Bus",
    icon: "🚌",
    speed: 50,
    emission: 0.035,
    cost: 1.8,
    color: "#4d83c2"
  },

  {
    name: "Car",
    icon: "🚗",
    speed: 57,
    emission: 0.138,
    cost: 7.2,
    color: "#d28c3d"
  },

  {
    name: "Flight",
    icon: "✈️",
    speed: 700,
    emission: 0.255,
    cost: 5.8,
    color: "#8a70bd"
  }

];


/*
  Local storage key.
*/

const HISTORY_KEY =
  "ecoroute_history";


/*
  Current journey.
*/

let currentJourney = null;


/* =========================================================
   CITY / DISTANCE FUNCTIONS
========================================================= */


/*
  Normalize city names.
*/

function normalizeCity(city) {

  return city
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");

}


/*
  Create route key.
*/

function createRouteKey(from, to) {

  return `${normalizeCity(from)}-${normalizeCity(to)}`;

}


/*
  Get distance.

  If route isn't in our database,
  generate a reasonable demo distance.
*/

function getDistance(from, to) {

  const key =
    createRouteKey(from, to);

  if (routes[key]) {

    return routes[key];

  }


  /*
    Generate a deterministic distance
    from city names.

    This prevents every unknown city
    from having exactly the same result.
  */

  const combined =
    normalizeCity(from) +
    normalizeCity(to);

  let value = 0;

  for (let i = 0; i < combined.length; i++) {

    value +=
      combined.charCodeAt(i) *
      (i + 1);

  }

  return 250 + (value % 1000);

}


/* =========================================================
   FORMAT FUNCTIONS
========================================================= */


/*
  Convert minutes into readable time.
*/

function formatTime(minutes) {

  const hours =
    Math.floor(minutes / 60);

  const mins =
    Math.round(minutes % 60);

  if (hours === 0) {

    return `${mins}m`;

  }

  if (mins === 0) {

    return `${hours}h`;

  }

  return `${hours}h ${mins}m`;

}


/*
  Format currency.
*/

function formatCurrency(value) {

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }
  ).format(value);

}


/*
  Format carbon.
*/

function formatCarbon(value) {

  if (value < 1) {

    return `${value.toFixed(2)} kg`;

  }

  return `${value.toFixed(1)} kg`;

}


/* =========================================================
   CALCULATE TRANSPORT OPTIONS
========================================================= */

function calculateOptions(distance) {

  return transportTypes.map(
    transport => {

      const rawMinutes =
        (distance / transport.speed) * 60;


      /*
        Add realistic extra time.

        Flights get airport overhead.
        Trains/buses get station stops.
      */

      let extraMinutes = 0;

      if (transport.name === "Flight") {

        extraMinutes = 120;

      } else if (
        transport.name === "Train"
      ) {

        extraMinutes = 20;

      } else if (
        transport.name === "Bus"
      ) {

        extraMinutes = 15;

      } else {

        extraMinutes = 10;

      }


      const duration =
        rawMinutes + extraMinutes;


      const carbon =
        distance *
        transport.emission;


      const cost =
        distance *
        transport.cost;


      return {

        ...transport,

        distance,

        duration,

        carbon,

        cost

      };

    }
  );

}


/* =========================================================
   GREEN SCORE
========================================================= */

function calculateGreenScores(options) {

  const maxCarbon =
    Math.max(
      ...options.map(
        option => option.carbon
      )
    );


  const minCarbon =
    Math.min(
      ...options.map(
        option => option.carbon
      )
    );


  const range =
    maxCarbon - minCarbon;


  return options.map(option => {

    let score = 100;

    if (range > 0) {

      score =
        100 -
        (
          (option.carbon - minCarbon)
          / range
        ) * 70;

    }


    return {

      ...option,

      greenScore:
        Math.round(score)

    };

  });

}


/* =========================================================
   FIND BEST OPTION
========================================================= */

function getBestOption(options) {

  return options.reduce(
    (best, current) => {

      return current.carbon < best.carbon
        ? current
        : best;

    }
  );

}


/* =========================================================
   RENDER TRANSPORT CARDS
========================================================= */

function renderTransportCards(options, best) {

  transportContainer.innerHTML =
    options.map(option => {

      const isBest =
        option.name === best.name;


      return `

        <article
          class="transport-card
          ${isBest ? "best" : ""}"
          data-transport="${option.name}"
        >

          ${
            isBest
              ?
              `
              <span class="best-label">
                GREENEST CHOICE
              </span>
              `
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
              ${formatTime(option.duration)}
            </b>

          </div>

          <div class="data">

            ESTIMATED COST

            <b>
              ${formatCurrency(option.cost)}
            </b>

          </div>

          <div class="data">

            CO₂ EMISSIONS

            <b class="${
              isBest ? "green" : ""
            }">

              ${formatCarbon(option.carbon)}

            </b>

          </div>

          <div class="data">

            GREEN SCORE

            <b class="${
              isBest ? "green" : ""
            }">

              ${option.greenScore}/100

            </b>

          </div>

        </article>

      `;

    }).join("");

}


/* =========================================================
   ANIMATED NUMBER
========================================================= */

function animateNumber(
  element,
  target,
  duration = 800
) {

  const start = 0;

  const startTime =
    performance.now();


  function update(time) {

    const progress =
      Math.min(
        (time - startTime) / duration,
        1
      );


    const value =
      Math.floor(
        start +
        (target - start) *
        progress
      );


    element.textContent =
      value;


    if (progress < 1) {

      requestAnimationFrame(update);

    }

  }


  requestAnimationFrame(update);

}


/* =========================================================
   CALCULATE MAIN JOURNEY
========================================================= */

function calculateJourney() {

  const from =
    fromInput.value.trim();

  const to =
    toInput.value.trim();


  /*
    Validation.
  */

  if (!from || !to) {

    showMessage(
      "Please enter both locations."
    );

    return;

  }


  if (
    normalizeCity(from) ===
    normalizeCity(to)
  ) {

    showMessage(
      "Starting point and destination cannot be the same."
    );

    return;

  }


  /*
    Distance.
  */

  const distance =
    getDistance(from, to);


  /*
    Transport calculations.
  */

  let options =
    calculateOptions(distance);


  /*
    Green scores.
  */

  options =
    calculateGreenScores(options);


  /*
    Find best.
  */

  const best =
    getBestOption(options);


  /*
    Highest carbon option.
  */

  const highestCarbon =
    Math.max(
      ...options.map(
        option => option.carbon
      )
    );


  /*
    Potential saving.
  */

  const carbonSaved =
    highestCarbon -
    best.carbon;


  /*
    Overall green score.

    Higher score means bigger advantage
    from selecting the greenest option.
  */

  const overallScore =
    Math.round(
      (
        1 -
        best.carbon /
        highestCarbon
      ) * 100
    );


  /*
    Save current journey.
  */

  currentJourney = {

    from,

    to,

    distance,

    options,

    best,

    carbonSaved,

    overallScore,

    createdAt:
      new Date().toISOString()

  };


  /*
    Update route.
  */

  routeTitle.textContent =
    `${from} → ${to}`;


  /*
    Update summary.
  */

  animateNumber(
    greenScore,
    overallScore
  );


  bestOption.textContent =
    best.name;


  saved.textContent =
    formatCarbon(carbonSaved);


  /*
    Render cards.
  */

  renderTransportCards(
    options,
    best
  );


  /*
    Reset slider.
  */

  slider.value = 8;

  updateMonthlySaving();


  /*
    Show results.
  */

  results.classList.remove(
    "hidden"
  );


  /*
    Save history.
  */

  saveJourney(
    currentJourney
  );


  /*
    Scroll.
  */

  setTimeout(() => {

    results.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }, 100);

}


/* =========================================================
   MONTHLY SAVING
========================================================= */

function updateMonthlySaving() {

  const tripCount =
    Number(slider.value);


  days.textContent =
    tripCount;


  if (!currentJourney) {

    monthly.textContent =
      "0 kg";

    return;

  }


  const saving =
    currentJourney.carbonSaved *
    tripCount;


  monthly.textContent =
    formatCarbon(saving);

}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function getHistory() {

  try {

    const history =
      localStorage.getItem(
        HISTORY_KEY
      );


    return history
      ? JSON.parse(history)
      : [];

  } catch (error) {

    console.error(
      "Unable to read history:",
      error
    );

    return [];

  }

}


/*
  Save journey.

  Maximum 10 recent journeys.
*/

function saveJourney(journey) {

  try {

    let history =
      getHistory();


    const item = {

      from:
        journey.from,

      to:
        journey.to,

      distance:
        journey.distance,

      best:
        journey.best.name,

      carbonSaved:
        journey.carbonSaved,

      score:
        journey.overallScore,

      createdAt:
        journey.createdAt

    };


    history.unshift(item);


    history =
      history.slice(0, 10);


    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history)
    );

  } catch (error) {

    console.error(
      "Unable to save journey:",
      error
    );

  }

}


/* =========================================================
   HISTORY STATISTICS
========================================================= */

function getStatistics() {

  const history =
    getHistory();


  if (!history.length) {

    return {

      journeys: 0,

      carbonSaved: 0,

      averageScore: 0

    };

  }


  const carbonSaved =
    history.reduce(
      (total, item) =>
        total + item.carbonSaved,
      0
    );


  const score =
    history.reduce(
      (total, item) =>
        total + item.score,
      0
    ) /
    history.length;


  return {

    journeys:
      history.length,

    carbonSaved,

    averageScore:
      Math.round(score)

  };

}


/* =========================================================
   USER MESSAGE
========================================================= */

function showMessage(message) {

  /*
    Use browser alert as a fallback.
    This keeps the project dependency-free.
  */

  alert(message);

}


/* =========================================================
   RANDOM DEMO ROUTE
========================================================= */

function randomRoute() {

  const examples = [

    {
      from: "Chennai",
      to: "Bengaluru"
    },

    {
      from: "Chennai",
      to: "Hyderabad"
    },

    {
      from: "Bengaluru",
      to: "Mumbai"
    },

    {
      from: "Delhi",
      to: "Mumbai"
    },

    {
      from: "Hyderabad",
      to: "Bengaluru"
    }

  ];


  const route =
    examples[
      Math.floor(
        Math.random() *
        examples.length
      )
    ];


  fromInput.value =
    route.from;

  toInput.value =
    route.to;


  calculateJourney();

}


/* =========================================================
   KEYBOARD SHORTCUT
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    /*
      Ctrl + Enter
      = calculate journey
    */

    if (
      event.ctrlKey &&
      event.key === "Enter"
    ) {

      calculateJourney();

    }

  }
);


/* =========================================================
   EVENT LISTENERS
========================================================= */

calculateButton.addEventListener(
  "click",
  calculateJourney
);


slider.addEventListener(
  "input",
  updateMonthlySaving
);


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


/* =========================================================
   INITIAL APPLICATION STATE
========================================================= */

function initialize() {

  /*
    Set default example.
  */

  fromInput.value =
    "Chennai";

  toInput.value =
    "Bengaluru";


  /*
    Do not automatically show results.
    User must click calculate.
  */

  monthly.textContent =
    "0 kg";

}


initialize();
