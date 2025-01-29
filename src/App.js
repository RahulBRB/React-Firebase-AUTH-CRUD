import React from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

//Pages
import Homepage from "./pages/homepage"
import Profile from "./pages/profile"

const App = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Homepage/>}></Route>
        <Route path="/profile" element={<Profile/>}></Route>
      </Routes>
    </Router>
    </>
  )
}

export default App