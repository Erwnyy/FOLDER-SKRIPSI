import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import { DataProvider } from './GlobalState'
import Header from './components/headers/Header'
import MainPages from './components/mainpages/Pages'
import Swipers from './components/swiper/Swipers';

function App() {
  return (
    <DataProvider>
      <Router>
        <div style={{backgroundColor:"white"}}>
          <Header />
          <div className="App" style={{backgroundColor:"white"}}>
            <MainPages />
          </div>
        </div>

      </Router>
    </DataProvider>
  );
}

export default App;
