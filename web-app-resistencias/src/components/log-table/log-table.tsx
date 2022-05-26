import React from "react";
import {LogItem} from "../log-item/log-item";
import "./LogTable.scss"

// @ts-ignore
export const LogTable = ({logData}) => {

    // Creamos una tabla con los headers de entities.Log
    return (
        <div className="log-scrollable">
            <table className="log-table">
                <thead>
                <tr>
                    <th className="log-table-head">Id</th>
                    <th className="log-table-head">Datos</th>
                    <th className="log-table-head">Resultados</th>
                    <th className="log-table-head">Metodo</th>
                </tr>
                </thead>
                <tbody>
                {
                    // Por cada registro que tengamos en logData, se generara una nueva fila dentro de la tabla
                    logData.map((log: {
                        Id: string;
                        Datos: string;
                        Resultados: string;
                        Metodo: string}) => (
                        <LogItem key={log.Id}
                                 Id={log.Id}
                                 Datos={log.Datos}
                                 Resultados={log.Resultados}
                                 Metodo={log.Metodo}
                        />
                    ))
                }
                </tbody>
            </table>
        </div>
    )
}