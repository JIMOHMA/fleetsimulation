import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'

import Home from "./routes/Home";
import Acquisitions from "./routes/Acquisitions";
import About from "./routes/About";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route index element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path="acquisitions" element={<Acquisitions />} />
          <Route path="about" element={<About />} />
          {/* <Route path="*" element={<NoPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
