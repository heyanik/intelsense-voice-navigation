import React from 'react'
import Search from '../search/Search';
import initialDetails from '../../data/initialDetails';

const Home = () => {
  return (
    <div className="tc min-vh-100"><Search details={initialDetails}/></div>
  )
}

export default Home