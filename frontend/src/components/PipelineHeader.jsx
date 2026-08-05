import React from "react";

import PipelineStats from "./PipelineStats";


export default function PipelineHeader({

    pipeline,

    onAtualizar

}) {


    return (

        <div className="pipeline-header">



            <div className="pipeline-title">


                <h1>

                    🚀 Pipeline Comercial

                </h1>


                <p>

                    Gestão visual das oportunidades comerciais

                </p>


            </div>





            <button

                className="refresh-button"

                onClick={onAtualizar}

            >

                🔄 Atualizar

            </button>






            <PipelineStats

                pipeline={pipeline}

            />




        </div>

    );

}