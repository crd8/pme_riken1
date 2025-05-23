import React from "react";
import ChartCurrentLLDisplay from "./components/ChartCurrentLLDisplay";
import ChartVoltLLDisplay from "./components/ChartVoltLLDisplay";
import ChartCosphiDisplay from "./components/ChartCosphiDisplay";
import Navbar from "./components/Navbar";
import DataTable from "./components/DataTable";
import UsageTable from "./components/UsageTable";
import "./App.css"

function App() {
  return (
    <div>
      <Navbar />
      <div className="container-fluid m-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 rounded-2xl p-5 bg-white">
            <h1 className="mb-4 font-bold text-gray-600 text-xl text-center">Grafik Voltage (voltLL)</h1>
            <ChartVoltLLDisplay />
          </div>
          <div className="rounded-2xl p-5 bg-white">
            <ChartCosphiDisplay />
          </div>
        </div>
      </div>
      <div className="container-fluid m-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 rounded-2xl p-5 bg-white">
            <h1 className="mb-4 font-bold text-gray-600 text-xl text-center">Grafik Arus Line-to-Line (currentLL)</h1>
            <ChartCurrentLLDisplay />
          </div>
        </div>
      </div>
      {/* <div className="container-fluid m-6">
       <div className="col-span-3 rounded-2xl p-5 bg-white">
         <h1 className="mb-4 font-bold text-gray-600 text-xl text-center">
           Data Usage
         </h1>
         <UsageTable />
       </div>
      </div>
      <div className="container-fluid m-6">
       <div className="col-span-3 rounded-2xl p-5 bg-white">
         <h1 className="mb-4 font-bold text-gray-600 text-xl text-center">
           Tabel Data Realtime
         </h1>
         <DataTable />
       </div>
      </div> */}
    </div>
  );
}

export default App;
