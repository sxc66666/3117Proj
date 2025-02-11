import React from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = () => <h1>Hello World!</h1>;

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
