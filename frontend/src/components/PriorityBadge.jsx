import React from "react";


export default function PriorityBadge({

    prioridade = "BAIXA"

}) {


    return (

        <span

            className={`priority-badge ${

                prioridade.toLowerCase()

            }`}

        >

            🔥 {prioridade}

        </span>

    );

}