const express = require('express');
const app = express();
const sqlite = require('better-sqlite3');
const path = require('path');
const cors = require('cors');
const db = new sqlite(path.resolve('./data/logs.db'), {fileMustExist: true});

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({
    origin: '*'
}));
app.listen(5000, () => console.log('El servidor esta escuchando en el puerto 5000'));

function query(sql) {
  return db.prepare(sql).all();
}

function run(sql) {
    return db.prepare(sql).run();
  }

app.get("/dates", (req, res) => {
    let data = query('SELECT DISTINCT Fecha FROM Log;');
    let casa = data.map((value) => value.Fecha)
    res.status(200).json(casa);
});

app.get("/dates/:dateInput", (req, res) => {
    let data = query(`SELECT * FROM Log WHERE Fecha = '${req.params.dateInput}';`);
    res.status(200).json(data);
});

app.get("/id/:id", (req, res) => {
    let data = query(`SELECT * FROM Log WHERE Id = '${req.params.id}';`);
    res.status(200).json(data);
});

app.post("/log", (req, res) => {
    let result = 0.0;
    if(req.body['metodo'] === 'Paralelo'){
        const resistencias = req.body['valores'].split(';');
        if(resistencias.length > 5){
            res.status(400).json({message: "No se pueden procesar mas de 5 resistencias"});
            return;
        }
        result = calcularParalelo(resistencias)
        guardarDatos(resistencias, result, 'Paralelo')
        res.status(200).json({resultado: result})
        return;
    }
    if(req.body['metodo'] === 'Serie'){
        const resistencias = req.body['valores'].split(';');
        if(resistencias.length > 5){
            res.status(400).json({message: "No se pueden procesar mas de 5 resistencias"});
            return;
        }
        result = calcularSerie(resistencias)
        guardarDatos(resistencias, result, 'Serie')
        res.status(200).json({resultado: result})
        return;
    }
    if(req.body['metodo'] === 'Triangulo'){
        const resistencias = req.body['valores'].split(';');
        if(resistencias.length != 3){
            res.status(400).json({message: "El metodo de Triangulo necesita exactamente 3 resistencias"});
            return;
        }
        result = calcularTriangulo(resistencias)
        guardarDatos(resistencias, result, 'Triangulo')
        res.status(200).json({resultado: result})
        return;
    }
    if(req.body['metodo'] === 'Estrella'){
        const resistencias = req.body['valores'].split(';');
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
        inversaResistencia = 1 / parseFloat(resistencias[index]);
        sumaInversas += inversaResistencia;
    }
    if (sumaInversas == 0) {
        return 0;
    }
    return 1 / sumaInversas;
}

function calcularSerie(resistencias){
    return resistencias.reduce(
        (previousValue, currentValue) => parseInt(previousValue) + parseInt(currentValue)
    );
}

function calcularTriangulo(resistencias){

    let r12 = parseFloat(resistencias[0]);
    let r23 = parseFloat(resistencias[1]);
    let r13 = parseFloat(resistencias[2]);

    let resultadoR1 = (r13 * r12) / (r12 + r23 + r13);
    let resultadoR2 = (r12 * r23) / (r12 + r23 + r13);
    let resultadoR3 = (r13 * r23) / (r12 + r23 + r13);

    return {
        R1: resultadoR1,
        R2: resultadoR2,
        R3: resultadoR3
    }
}

function calcularEstrella(resistencias){
    let r1 = parseFloat(resistencias[0]);
    let r2 = parseFloat(resistencias[1]);
    let r3 = parseFloat(resistencias[2]);
    
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
        let llaves = Object.keys(resultados).flat()
        let valores = Object.values(resultados).flat()
        for(let i = 0; i < llaves.length; i++){
            resultado += llaves[i] + ": " + valores[i] + ' '
        }
    } else {
        resultado = 'R: ' + resultados
    }
    run(`INSERT INTO Log(Datos, Resultados, Metodo, Fecha) VALUES('${resistencias}', '${resultado}', '${metodo}', date('now'));`);
}