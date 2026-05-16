# HelloWorld Tech Conference Website

A modern, premium 1-day event website built with **Node.js**, **Vanilla JavaScript**, and **Custom CSS**. This application features a single-track schedule for a technical conference with 6 talks, automatic timing calculations, and real-time category filtering.

## 🚀 Features

- **Dynamic Schedule**: 6 talks (1 hour each) starting from 10:00 AM.
- **Automated Timings**: Includes 10-minute transitions between talks and a 1-hour lunch break.
- **Dual-Criteria Search**: Instant search functionality to filter talks by **Category** or **Speaker**.
- **Interactive Talk View**: Modal-based detailed view for every talk.
- **Premium Design**: 
  - Sleek dark theme with deep purples and blues.
  - Glassmorphism effects and modern typography (Orbitron & Inter).
  - Fully responsive for mobile and desktop.
- **Lightweight Architecture**: No heavy frameworks, just pure Node.js and standard web technologies.

## 🛠️ Tech Stack

- **Server**: Node.js, Express
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (Vanilla)
- **Data**: JSON-based storage

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (installed with Node.js)

## 📥 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rominirani/ri-event-talks-app.git
   cd ri-event-talks-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Access the website**:
   Open [http://localhost:3000](http://localhost:3000) in your favorite browser.

## 📅 Schedule Structure

- **Start Time**: 10:00 AM
- **Talk Duration**: 60 Minutes
- **Transition**: 10 Minutes
- **Lunch Break**: 1 Hour (After the 3rd talk)
- **Total Talks**: 6

## 📄 License

This project is open-source and available under the [ISC License](LICENSE).
