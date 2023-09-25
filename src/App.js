import React from 'react';
import { BrowserRouter as Router, Route, Switch, Routes, Outlet } from 'react-router-dom';
import "./global.css"
import Home from './components/home/Home';
import CardDetail from './components/card/CardDetail';
import personData from './data/initialDetails';

function App() {
  


  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/:id" element={<CardDetail person={personData}/>} />
      </Routes>
  </Router>
  );
}

export default App;
