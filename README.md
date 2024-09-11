# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


# Element Fleet Simulation
This goal of this web application was to simulate my understanding of what a real-time analytics for a fleet of vehicles would entail. 

### Screenshots
- Home Page
![Home Page](screenshots/home.png "Fleet Manager Home Page")
- New Acquisition Page
![New](screenshots/newacquisition.png "New Acquisition Page")
- Companies Acquried
![Companies](screenshots/acquired.png "Companies Acquried Page")
- Company Vehicles 
![Vehicles](screenshots/company-vehicles.png "Company Vehicles Page")
- Vehicle Analytics 
![Analytics](Screenshots/analytics.png "Vehicle Analytics Page")
- About Page
![About](Screenshots/about.png "About Page")

### Application File Structure

└── fleetsimulation/
    ├── database/
    │   ├── simulation.js
    │   ├── package.json
    │   └── other files
    ├── server/
    │   ├── server.js
    │   ├── package.json
    │   └── other files
    └── src/
        ├── components/
        │   ├── Driver.jsx
        │   ├── FuelGuage.jsx
        │   ├── Header.jsx
        │   ├── Maintenance.jsx
        │   ├── SpeedAreaChart.jsx
        │   └── TirePressure.jsx
        ├── pages/
        │   ├── Acquisitions.jsx
        │   ├── Company.jsx
        │   ├── Home.jsx
        │   ├── NewAcquisition.jsx
        │   └── Vehicle.jsx
        ├── App.css
        ├── App.jsx
        ├── main.jsx
        ├── package.json
        └── otherfiles