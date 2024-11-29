import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Calc from './pages/Calc';
import Home from './pages/Home';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div><Home/></div>} />
        <Route path='/calc' element={<div><Calc/></div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App