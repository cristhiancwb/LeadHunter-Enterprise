export default function PipelineMetrics({

    metricas = {},

    status

}) {



    const dados = metricas?.[status] || {

        quantidade: 0,

        score_medio: 0,

        alta_prioridade: 0

    };







    return (



        <div className="pipeline-metrics">





            <div className="metric-item">


                <span>

                    Leads

                </span>



                <strong>

                    {dados.quantidade ?? 0}

                </strong>



            </div>







            <div className="metric-item">


                <span>

                    Score médio

                </span>



                <strong>

                    {

                        Number(

                            dados.score_medio ?? 0

                        ).toFixed(0)

                    }

                </strong>



            </div>







            <div className="metric-item">


                <span>

                    Alta prioridade

                </span>



                <strong>

                    {dados.alta_prioridade ?? 0}

                </strong>



            </div>







        </div>



    );


}