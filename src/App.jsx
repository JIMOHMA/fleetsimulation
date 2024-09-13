import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'

// routes or pages
import Home from "./pages/Home";
import About from "./pages/About";
import NewAcquisition from "./pages/NewAcquisition";
import Company from "./pages/Company";
import Vehicle from "./pages/Vehicle";
import Acquisitions from "./pages/Acquisitions";
import NoPage from "./pages/NoPage";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route index element={<Home />} />
          <Route path='home' element={<Home />} />
          <Route path="acquisitions" element={<Acquisitions />} />
          <Route path="new" element={<NewAcquisition />} />
          <Route path="about" element={<About />} />
          <Route path="vehicle/:vehicleId" element={<Vehicle />} />
          <Route path="company/:companyId" element={<Company />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
