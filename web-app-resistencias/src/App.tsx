import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from "react";
import {Finder} from "./components/finder/finder";
import {LogTable} from "./components/log-table/log-table";
import {ParaleloSerie} from "./components/paralelo-serie/paralelo-serie";

function App() {

  const [logData, setLogData] = useState([])
  const [dates, setDates] = useState([])

  // Esta funcion se ejecuta al cargar la aplicacion y se encarga de recuperar los datos de las fechas
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
          {
            /**
             * Llamamos a los componentes necesarios para que funcione la app
             */
          }
          <ParaleloSerie/>
          <Finder setLogData={setLogData} dates={dates}/>
          <LogTable logData={logData} />
      </div>
  );
}

export default App;