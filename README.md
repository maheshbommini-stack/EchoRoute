🌱 EcoRoute — Carbon-Aware Travel Planner

EcoRoute is a full-stack-ready sustainability web application that helps users compare different transportation options based on travel time, estimated cost, and carbon emissions.

The application encourages users to choose more environmentally friendly transportation and shows how much CO₂ they could save by making greener travel choices.

🌐 Live Demo

🚀 Try EcoRoute online:

https://maheshbommini-stack.github.io/EchoRoute/

The current live demo runs the frontend through GitHub Pages. The backend architecture is included for future API and database integration.

✨ Features

🌍 Source and destination selection

🚆 Train comparison

🚌 Bus comparison

🚗 Car comparison

✈️ Flight comparison

🌱 Greenest travel recommendation

📊 CO₂ emission comparison

💰 Estimated travel cost

⏱️ Travel time comparison

📈 Monthly carbon-saving calculator

🎚️ Interactive trip slider

📱 Responsive design

🔄 REST API-ready architecture

🗄️ MongoDB-ready backend

⚡ Frontend calculation

🌐 GitHub Pages deployment

🛠️ Technologies Used
Frontend

HTML5

CSS3

JavaScript

Responsive Web Design

DOM Manipulation

CSS Animations

Backend

Node.js

Express.js

REST API

CORS

dotenv

Database

MongoDB

Mongoose

Deployment

GitHub Pages — Frontend

Node.js hosting — Backend

📂 Full Project Structure
EchoRoute/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── .gitignore
│   │
│   ├── models/
│   │   └── Journey.js
│   │
│   ├── controllers/
│   │   └── journeyController.js
│   │
│   └── routes/
│       └── journeyRoutes.js
│
└── README.md

🏗️ Backend Architecture

The backend is designed using a simple MVC-style architecture.

                    ┌──────────────────┐
                    │    Frontend      │
                    │ HTML/CSS/JS      │
                    └────────┬─────────┘
                             │
                             │ HTTP Request
                             ▼
                    ┌──────────────────┐
                    │   Express API    │
                    │    server.js     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │      Routes      │
                    │ journeyRoutes.js │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Controller     │
                    │journeyController │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │      Model       │
                    │   Journey.js     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │     MongoDB      │
                    │    Database      │
                    └──────────────────┘

🔌 Backend API
Calculate Journey
POST /api/journeys/calculate


Example request:

{
  "from": "Chennai",
  "to": "Bengaluru",
  "transport": "train",
  "distance": 350,
  "carbon": 6.8,
  "cost": 850,
  "duration": "5h 45m"
}


Example response:

{
  "success": true,
  "message": "Journey calculated successfully",
  "journey": {
    "from": "Chennai",
    "to": "Bengaluru",
    "transport": "train",
    "carbon": 6.8,
    "cost": 850,
    "duration": "5h 45m"
  }
}

Journey History
GET /api/journeys/history


Returns previously calculated journeys.

Carbon Statistics
GET /api/journeys/stats


Returns overall carbon-saving statistics.

Example:

{
  "totalJourneys": 12,
  "totalCarbonSaved": 482.5,
  "averageGreenScore": 88
}

🗄️ Database Structure

The MongoDB database can store journey information using the Journey model.

Example document:

{
  "from": "Chennai",
  "to": "Bengaluru",
  "transport": "train",
  "duration": "5h 45m",
  "cost": 850,
  "carbon": 6.8,
  "greenScore": 94,
  "createdAt": "2026-01-01T10:30:00.000Z"
}

⚙️ Backend Environment

Create a .env file inside the backend folder:

MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/ecoroute
PORT=5000

.gitignore

Never upload your .env file.

node_modules/
.env

🚀 Backend Installation

Move into the backend directory:

cd backend


Install dependencies:

npm install


Start the server:

npm start


Development mode:

npm run dev


The API will run on:

http://localhost:5000

🔄 Application Flow
User
  │
  ▼
Enter From / To
  │
  ▼
Select Journey
  │
  ▼
Calculate Transportation Data
  │
  ├── Travel Time
  ├── Estimated Cost
  ├── CO₂ Emissions
  └── Green Score
  │
  ▼
Display Results
  │
  ▼
Express REST API
  │
  ▼
MongoDB
  │
  ▼
Journey History

🌱 Carbon Calculation

EcoRoute compares estimated carbon emissions for each transportation method.

The basic saving calculation is:

CO₂ Saved =
Higher-Emission Transport
-
Lower-Emission Transport


For example:

Car:
48.2 kg CO₂

Train:
6.8 kg CO₂

Potential Saving:

48.2 - 6.8
= 41.4 kg CO₂


The monthly calculator then estimates:

Monthly Saving =
Saving Per Trip × Trips Per Month

📊 Example
CHENNAI → BENGALURU

🚆 TRAIN
Time: 5h 45m
Cost: ₹850
CO₂: 6.8 kg

🚌 BUS
Time: 7h 30m
Cost: ₹650
CO₂: 12.4 kg

🚗 CAR
Time: 6h 10m
Cost: ₹3,200
CO₂: 48.2 kg

✈️ FLIGHT
Time: 1h 05m
Cost: ₹4,800
CO₂: 55.7 kg

🌱 Recommended Option
GREENEST CHOICE

🚆 TRAIN

Green Score: 94/100
CO₂ Saved: 41.4 kg

📱 Responsive Design

EcoRoute supports:

💻 Desktop

💻 Laptop

📱 Mobile

📱 Tablet

The layout automatically adapts using CSS media queries.

🚀 How to Run Locally
Frontend

Open:

frontend/index.html


in a browser.

Backend
cd backend
npm install
npm start


Frontend and backend can then communicate through the REST API.

🌐 GitHub Pages

The current frontend can be deployed using GitHub Pages.

GitHub Repository
       ↓
Settings
       ↓
Pages
       ↓
Deploy from branch
       ↓
main
       ↓
/root
       ↓
Save

Live Website

https://maheshbommini-stack.github.io/EchoRoute/

GitHub Pages hosts the static frontend. A separate Node.js hosting service is required to run the Express backend.

🔮 Future Improvements

🗺️ Real route calculation

📍 GPS/location integration

🌐 OpenStreetMap integration

🚦 Real-time traffic information

🌦️ Weather-aware recommendations

📡 Real transportation APIs

👤 User authentication

📜 Personal journey history

📊 Personal carbon dashboard

🤖 AI-powered travel recommendations

🌱 Carbon-offset recommendations

🏆 Eco travel achievements

🔔 Sustainable travel notifications

🔐 Security

Sensitive database credentials are stored in .env.

.env should never be committed to GitHub.

Backend validation should be used for API requests.

CORS can be configured for the production frontend domain.

MongoDB credentials should never be exposed in frontend JavaScript.

⚠️ Disclaimer

EcoRoute is an educational Web Technology project.

The transportation costs, travel times, and CO₂ emission values shown by the application are simplified demonstration estimates and should not be considered precise real-world measurements.

👨‍💻 Author

Mahesh Bommini

Built as a Web Technology project.

🌍 Live Website

🚀 EcoRoute:

https://maheshbommini-stack.github.io/EchoRoute/
