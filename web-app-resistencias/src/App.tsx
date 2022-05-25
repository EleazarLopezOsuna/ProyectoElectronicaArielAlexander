import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from "react";
import {Finder} from "./components/finder/finder";
import {LogTable} from "./components/log-table/log-table";
import {ParaleloSerie} from "./components/paralelo-serie/paralelo-serie";

function App() {

  const [logData, setLogData] = useState([])
  const [dates, setDates] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // @ts-ignore
        const response = await fetch('http://localhost:5000/dates')
        setDates(await response.json())
      } catch (error) {
        console.log("error", error)
      }
    }
    fetchData()
  }, [])

  return (
      <div className="container">
          <ParaleloSerie/>
          <Finder setLogData={setLogData} dates={dates}/>
          <LogTable logData={logData} />
      </div>
  );
}

export default App;