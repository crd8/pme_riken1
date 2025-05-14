import React from 'react';
import ChartDisplay from './components/ChartDisplay';
import './App.css'

function App() {
  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Realtime kWh Monitoring</h1>
      <ChartDisplay />
    </div>
  );
}

export default App;
