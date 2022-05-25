import React, {useState} from "react";
import { Form, Button } from 'react-bootstrap';
import './ParaleloSerie.scss'

// @ts-ignore
export const ParaleloSerie =  () => {

    const [resultado, setResultado] = useState()
    const [state, setState] = useState({
        valores: '',
        metodo: ''
    })

    // @ts-ignore
    const onInputChange = event => {
        const { name, value } = event.target;

        setState({
            ...state,
            [name]: value
        });
    };

    // @ts-ignore
    const handleSubmit = async event => {
        event.preventDefault();
        const response = await fetch('http://localhost:5000/log', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, Accept-Language, X-Authorization"
            },
            body: JSON.stringify(state)
        })
        const respuesta = await response.json();
        if(response.status != 200){
            alert('Hubo un error: ' + respuesta['message']);
        }else{
            if(state['metodo'] === 'Estrella'){
                alert('El resultado es: \nR12: ' + respuesta['resultado']['R12'] + '\nR13: ' +
                    respuesta['resultado']['R13'] + '\nR23: ' + respuesta['resultado']['R23']);
            } else if(state['metodo'] === 'Triangulo'){
                alert('El resultado es: \nR1: ' + respuesta['resultado']['R1'] + '\nR2: ' +
                    respuesta['resultado']['R2'] + '\nR3: ' + respuesta['resultado']['R3']);
            } else {
                alert('El resultado es: ' + respuesta['resultado']);
            }
        }
    };

    // @ts-ignore
    return (
        <form onSubmit={handleSubmit}>
            <Form.Group controlId="resistencias">
                <Form.Label>Resistencias</Form.Label>
                <Form.Control
                    type="text"
                    name="valores"
                    value={state.valores}
                    placeholder="Valores separados por ;"
                    onChange={onInputChange}
                />
            </Form.Group>
            <Form.Group controlId="metodo">
                <Form.Label>Metodo</Form.Label>
                <Form.Select aria-label="Default select example" name="metodo" onChange={onInputChange}>
                    <option>Seleccione una opcion</option>
                    <option value="Paralelo">Paralelo</option>
                    <option value="Serie">Serie</option>
                    <option value="Triangulo">Triangulo -- Estrella</option>
                    <option value="Estrella">Estrella -- Triangulo</option>
                </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
                Procesar
            </Button>
        </form>
    )
}