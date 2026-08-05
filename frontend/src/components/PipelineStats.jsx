import React from "react";


export default function PipelineStats({

    pipeline = {}

}) {


    const todasEtapas = Object.values(pipeline)
        .flat();



    const totalLeads = todasEtapas.length;



    const valorPipeline = todasEtapas.reduce(

        (total, lead) => {

            return total + Number(
                lead.valor_estimado || 0
            );

        },

        0

    );



    const altaPrioridade = todasEtapas.filter(

        lead => lead.prioridade === "ALTA"

    ).length;



    const fechados =

        pipeline.FECHADO?.length || 0;



    const conversao = totalLeads > 0

        ? ((fechados / totalLeads) * 100).toFixed(1)

        : 0;




    return (

        <div className="pipeline-stats">



            <div className="stat-card">

                <span>

                    📊 Total Leads

                </span>

                <strong>

                    {totalLeads}

                </strong>

            </div>





            <div className="stat-card">

                <span>

                    💰 Pipeline

                </span>

                <strong>

                    {new Intl.NumberFormat(

                        "pt-BR",

                        {

                            style: "currency",

                            currency: "BRL"

                        }

                    ).format(valorPipeline)}

                </strong>

            </div>





            <div className="stat-card">

                <span>

                    🔥 Alta Prioridade

                </span>

                <strong>

                    {altaPrioridade}

                </strong>

            </div>





            <div className="stat-card">

                <span>

                    ✅ Fechados

                </span>

                <strong>

                    {fechados}

                </strong>

            </div>





            <div className="stat-card">

                <span>

                    📈 Conversão

                </span>

                <strong>

                    {conversao}%

                </strong>

            </div>




        </div>

    );

}