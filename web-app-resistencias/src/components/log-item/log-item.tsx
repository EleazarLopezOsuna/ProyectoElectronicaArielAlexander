import React from "react";
import {Log} from "../../entities/Log";
import "./LogItem.scss"

export const LogItem: React.FC<Log> = ({Id, Datos, Resultados, Metodo}) => {
    return (
        <tr className="log-table-row">
            <td className="log-table-cell">{Id}</td>
            <td className="log-table-cell">{Datos}</td>
            <td className="log-table-cell">{Resultados}</td>
            <td className="log-table-cell">{Metodo}</td>
        </tr>
    )
}