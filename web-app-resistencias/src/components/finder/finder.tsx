import React, {useState} from "react";
import './Finder.scss'

// @ts-ignore
export const Finder =  ({setLogData, dates}) => {

    const [dia, setDia] = useState('')
    const [id, setId] = useState('0')
    // @ts-ignore
    return (
        <div className="row date-selector">
            <div className="col">
                <select className="form-select" aria-label="Default select example" value={dia} onChange={
                    e => setDia(e.target.value)
                }>
                    {
                        /* 
                            dates contiene los valores de cada fecha en forma de arreglo.
                            Por cada item del arreglo se generara una opcion dentro del select en la cual
                            se mostrara la fecha que contenga.
                        */
                    }
                    <option value={1}>Selecciona un dia</option>
                    {
                        dates.map((fecha: string) => (
                            <option value={fecha} key={fecha}>{fecha}</option>
                        ))
                    }
                </select>
            </div>
            <div className="col">
                {
                    /*
                        Hacemos un boton el cual al momento de darle click, enviara una peticion al servidor en el cual.
                        Obtendra los datos de un dia en especifico
                    */
                }
                <button type="button" className="btn btn-light" onClick={
                    async () => {
                        let url = "http://localhost:5000/dates/" + dia
                        const response = await fetch(url)
                        setLogData(await response.json())
                    }
                }>Buscar</button>
            </div>
            <div className="col">
                <input type="text" className="form-control" aria-label="Default select example" value={id} onChange={
                    e => setId(e.target.value)
                }/>
            </div>
            <div className="col">
            {
                    /*
                        Hacemos un boton el cual al momento de darle click, enviara una peticion al servidor en el cual.
                        Obtendra los datos de un id en especifico
                    */
                }
                <button type="button" className="btn btn-light" onClick={
                    async () => {
                        let url = "http://localhost:5000/id/" + id
                        const response = await fetch(url)
                        setLogData(await response.json())
                    }
                }>Buscar</button>
            </div>
        </div>
    )
}