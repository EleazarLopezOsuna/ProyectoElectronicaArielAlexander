import React, {useState} from "react";
//import './Finder.scss'

// @ts-ignore
export const TrianguloEstrella =  () => {

    const [resultado, setResultado] = useState([0,0,0])
    const [resistencia1, setResistencia1] = useState(0)
    const [resistencia2, setResistencia2] = useState(0)
    const [resistencia3, setResistencia3] = useState(0)
    // @ts-ignore
    return (
        <div className="row date-selector">
            <div className="col">
                <input type="number" className="form-control" onChange={
                    e => setResistencia1(e.target.value as unknown as number)
                }/>
                <input type="number" className="form-control" onChange={
                    e => setResistencia2(e.target.value as unknown as number)
                }/>
                <input type="number" className="form-control" onChange={
                    e => setResistencia3(e.target.value as unknown as number)
                }/>
            </div>
            <div className="col">
                <button type="button" className="btn btn-light" onClick={
                    async () => {
                        const response = await fetch('http://localhost:5000/log', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                'resistencia1': resistencia1,
                                'resistencia2': resistencia2,
                                'resistencia3': resistencia3,
                                'metodo': 'Paralelo',
                            })
                        })
                        alert(response.json())
                    }
                }>Operar Paralelo</button>
            </div>
            <div className="col">
                <button type="button" className="btn btn-light" onClick={
                    async () => {
                        const response = await fetch('http://localhost:5000/log', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                'resistencia1': resistencia1,
                                'resistencia2': resistencia2,
                                'resistencia3': resistencia3,
                                'metodo': 'Serie',
                            })
                        })
                        alert(response.json())
                    }
                }>Operar Serie</button>
            </div>
        </div>
    )
}