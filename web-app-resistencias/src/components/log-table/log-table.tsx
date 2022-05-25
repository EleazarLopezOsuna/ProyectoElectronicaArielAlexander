import React from "react";
import {LogItem} from "../log-item/log-item";
import "./LogTable.scss"

// @ts-ignore
export const LogTable = ({logData}) => {

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