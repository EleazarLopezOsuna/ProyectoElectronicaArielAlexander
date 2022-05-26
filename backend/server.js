// En esta seccion realizamos los require necesarios para que la app funcione correctamente
const express = require('express');
const sqlite = require('better-sqlite3');
const path = require('path');
const cors = require('cors');
var bodyParser = require('body-parser')

const app = express();

// Configuramos la app
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({
    origin: '*'
}));
app.listen(5000, () => console.log('El servidor esta escuchando en el puerto 5000'));

// Creamos una instancia de la base de datos en la locacion definida
const db = new sqlite(path.resolve('./data/logs.db'), {fileMustExist: true});

// Funcion que permite pasar una consulta con la estructura de SQL y enviarla a la base de datos
function query(sql) {
    return db.prepare(sql).all();
}

// Funcion que permite ejecutar una consulta con la estructura de SQL y enviarla a la base de datos
function run(sql) {
    return db.prepare(sql).run();
}

// Ruta que permite obtener todas las fechas registradas en la base de datos
app.get("/dates", (req, res) => {
    let data = query('SELECT DISTINCT Fecha FROM Log;');
    let casa = data.map((value) => value.Fecha)
    res.status(200).json(casa);
});

// Ruta que permite obtener todos los logs realizados en una fecha en especifico
app.get("/dates/:dateInput", (req, res) => {
    let data = query(`SELECT * FROM Log WHERE Fecha = '${req.params.dateInput}';`);
    res.status(200).json(data);
});

// Ruta que permite obtener un log conforme un id
app.get("/id/:id", (req, res) => {
    let data = query(`SELECT * FROM Log WHERE Id = '${req.params.id}';`);
    res.status(200).json(data);
});

// Ruta que permite crear un nuevo log en la base de datos
app.post("/log", (req, res) => {
    let result = 0.0;

    // Verificamos si tenemos que realizar el calculo con el metodo paralelo
    if(req.body['metodo'] === 'Paralelo'){
        const resistencias = req.body['valores'].split(';');
        // Verificamos que se utilicen unicamente 5 datos
        if(resistencias.length > 5){
            res.status(400).json({message: "No se pueden procesar mas de 5 resistencias"});
            return;
        }
        result = calcularParalelo(resistencias)
        guardarDatos(resistencias, result, 'Paralelo')
        res.status(200).json({resultado: result})
        return;
    }

    // Verificamos si tenemos que realizar el calculo con el metodo serie
    if(req.body['metodo'] === 'Serie'){
        const resistencias = req.body['valores'].split(';');
        // Verificamos que se utilicen unicamente 5 datos
        if(resistencias.length > 5){
            res.status(400).json({message: "No se pueden procesar mas de 5 resistencias"});
            return;
        }
        result = calcularSerie(resistencias)
        guardarDatos(resistencias, result, 'Serie')
        res.status(200).json({resultado: result})
        return;
    }

    // Verificamos si que realizar la transformacion Triangulo -> Estrella
    if(req.body['metodo'] === 'Triangulo'){
        const resistencias = req.body['valores'].split(';');
        // Verificamos que se utilicen unicamente 3 datos
        if(resistencias.length != 3){
            res.status(400).json({message: "El metodo de Triangulo necesita exactamente 3 resistencias"});
            return;
        }
        result = calcularTriangulo(resistencias)
        guardarDatos(resistencias, result, 'Triangulo')
        res.status(200).json({resultado: result})
        return;
    }

    // Verificamos si que realizar la transformacion Estrella -> Triangulo
    if(req.body['metodo'] === 'Estrella'){
        const resistencias = req.body['valores'].split(';');
        // Verificamos que se utilicen unicamente 3 datos
        if(resistencias.length != 3){
            res.status(400).json({message: "El metodo de Estrella necesita exactamente 3 resistencias"});
            return;
        }
        result = calcularEstrella(resistencias)
        guardarDatos(resistencias, result, 'Estrella')
        res.status(200).json({resultado: result})
        return;
    }
});

// Funcion para realizar el calculo en paralelo
function calcularParalelo(resistencias){
    if(resistencias.length === 1){
        return 0;
    }
    if(resistencias.length === 2){
        return (parseFloat(resistencias[0]) + parseFloat(resistencias[1])) / (parseFloat(resistencias[0]) * parseFloat(resistencias[1]));
    }
    let sumaInversas = 0;
    for (let index = 0; index < resistencias.length; index++) {
        if (parseInt(resistencias[index]) == 0) {
            break;
        }
        // Calculamos la inversa de la resistencia actual y las sumamos
        inversaResistencia = 1 / parseFloat(resistencias[index]);
        sumaInversas += inversaResistencia;
    }
    if (sumaInversas == 0) {
        return 0;
    }
    // Calculamos la inversa de la suma de las inversas
    return 1 / sumaInversas;
}

// Realizamos un calculo en serie
function calcularSerie(resistencias){
    // Utilizamos la funcion reduce para sumar todos los valores dentro del arreglo
    return resistencias.reduce(
        (previousValue, currentValue) => parseInt(previousValue) + parseInt(currentValue)
    );
}

// Funcion para calcular las resistencias Triangulo -> Estrella
function calcularTriangulo(resistencias){

    // Obtenemos las resistencias
    let r12 = parseFloat(resistencias[0]);
    let r23 = parseFloat(resistencias[1]);
    let r13 = parseFloat(resistencias[2]);

    // Obtenemos los resultados
    let resultadoR1 = (r13 * r12) / (r12 + r23 + r13);
    let resultadoR2 = (r12 * r23) / (r12 + r23 + r13);
    let resultadoR3 = (r13 * r23) / (r12 + r23 + r13);

    return {
        R1: resultadoR1,
        R2: resultadoR2,
        R3: resultadoR3
    }
}

// Funcion para calcular las resistencias Estrella -> Triangulo
function calcularEstrella(resistencias){
    // Obtenemos las resistencias
    let r1 = parseFloat(resistencias[0]);
    let r2 = parseFloat(resistencias[1]);
    let r3 = parseFloat(resistencias[2]);
    
    // Obtenemos los resultados
    let resultadoR12 = (r1 * r2 + r1 * r3 + r2 * r3) / r3;
    let resultadoR13 = (r1 * r2 + r1 * r3 + r2 * r3) / r2;
    let resultadoR23 = (r1 * r2 + r1 * r3 + r2 * r3) / r1;
    
    return {
        R12: resultadoR12,
        R13: resultadoR13,
        R23: resultadoR23
    }
}

function guardarDatos(resistencias, resultados, metodo){
    let resultado = ''
    if(metodo == 'Estrella' || metodo == 'Triangulo'){
        // Obtenemos el nombre de la resistencia
        let llaves = Object.keys(resultados).flat()

        // Obtenemos el valor de la resistencia
        let valores = Object.values(resultados).flat()

        // Formamos una cadena en la cual se muestra el nombre y el valor de cada resistencia
        for(let i = 0; i < llaves.length; i++){
            resultado += llaves[i] + ": " + valores[i] + ' '
        }
    } else {
        resultado = 'R: ' + resultados
    }
    // Ejecutamos el comando SQL para insertar los datos en la base de datos
    run(`INSERT INTO Log(Datos, Resultados, Metodo, Fecha) VALUES('${resistencias}', '${resultado}', '${metodo}', date('now'));`);
}