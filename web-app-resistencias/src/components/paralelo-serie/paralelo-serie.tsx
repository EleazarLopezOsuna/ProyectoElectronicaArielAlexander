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
        // Actualizamos el valor del estado que sirve para manejar los valores y el tipo de metodo a ejecutar
        setState({
            ...state,
            [name]: value
        });
    };

    // @ts-ignore
    const handleSubmit = async event => {
        event.preventDefault();

        // Realizamos una peticion al servidor, esta peticion permite insertar un nuevo registro en la base de datos
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
        // Esperamos la respuesta del servidor
        const respuesta = await response.json();

        // Si la respuesta no contiene el codigo 200 entonces ocurrio un error y se muestra el mensaje
        if(response.status != 200){
            alert('Hubo un error: ' + respuesta['message']);
        }else{
            // Verificamos si el metodo fue Estrella e imprimimos sus resultados
            if(state['metodo'] === 'Estrella'){
                alert('El resultado es: \nR12: ' + respuesta['resultado']['R12'] + '\nR13: ' +
                    respuesta['resultado']['R13'] + '\nR23: ' + respuesta['resultado']['R23']);
            } else if(state['metodo'] === 'Triangulo'){
                // Si el metodo fue Triangulo imprimimos sus resultados
                alert('El resultado es: \nR1: ' + respuesta['resultado']['R1'] + '\nR2: ' +
                    respuesta['resultado']['R2'] + '\nR3: ' + respuesta['resultado']['R3']);
            } else {
                // De lo contrario, se realizo el calculo por el metodo de Paralelo o Serie
                alert('El resultado es: ' + respuesta['resultado']);
            }
        }
    };

    // @ts-ignore
    return (
        // Creamos un nuevo formulario
        <form onSubmit={handleSubmit}>
            <Form.Group controlId="resistencias">
                {
                    /**
                     * Colocamos un label el cual sirve para proporcionar informacion
                     * Tambien hacemos uso de un input text en el cual se colocaran los valores
                     */
                }
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
                {
                    /**
                     * Colocamos un label el cual sirve para proporcionar informacion
                     * Tambien hacemos uso de un select en el cual se colocaran los metodos disponibles
                     */
                }
                <Form.Label>Metodo</Form.Label>
                <Form.Select aria-label="Default select example" name="metodo" onChange={onInputChange}>
                    <option>Seleccione una opcion</option>
                    <option value="Paralelo">Paralelo</option>
                    <option value="Serie">Serie</option>
                    <option value="Triangulo">Triangulo -- Estrella</option>
                    <option value="Estrella">Estrella -- Triangulo</option>
                </Form.Select>
            </Form.Group>
            {
                /**
                 * Colocamos un boton para enviar la informacion
                 */
            }
            <Button variant="primary" type="submit">
                Procesar
            </Button>
        </form>
    )
}