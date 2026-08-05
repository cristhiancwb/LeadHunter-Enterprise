import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";


import {
    Users,
    Target,
    TrendingUp,
    Award,
    Trophy
} from "lucide-react";


import "./CommercialDashboard.css";





export default function CommercialDashboard({

    dados,

    ranking = []

}) {



    if (!dados) {

        return (

            <div className="dashboard-loading">

                Carregando indicadores...

            </div>

        );

    }





    const pipelineData = Object.entries(

        dados.pipeline || {}

    ).map(([nome, valor]) => ({

        nome,

        valor

    }));







    const prioridadeData = Object.entries(

        dados.prioridades || {}

    ).map(([nome, valor]) => ({

        nome,

        valor

    }));







    const cards = [


        {

            titulo: "Total de Leads",

            valor: dados.total_leads || 0,

            icon: <Users size={28}/>

        },


        {

            titulo: "Score Médio",

            valor: dados.media_score || 0,

            icon: <TrendingUp size={28}/>

        },


        {

            titulo: "Melhor Lead",

            valor:

                dados.melhor_lead?.empresa || "-",

            icon: <Award size={28}/>

        },


        {

            titulo: "Etapas Pipeline",

            valor:

                Object.keys(

                    dados.pipeline || {}

                ).length,

            icon: <Target size={28}/>

        }


    ];







    return (


        <div className="commercial-dashboard">







            <div className="dashboard-cards">


                {

                    cards.map(

                        (card,index)=>(


                            <div

                                className="dashboard-card"

                                key={index}

                            >


                                <div className="card-icon">

                                    {card.icon}

                                </div>



                                <div>


                                    <span>

                                        {card.titulo}

                                    </span>



                                    <strong>

                                        {card.valor}

                                    </strong>


                                </div>


                            </div>


                        )

                    )

                }


            </div>









            <div className="dashboard-charts">





                <div className="chart-box">


                    <h3>

                        Pipeline Comercial

                    </h3>



                    <ResponsiveContainer

                        width="100%"

                        height={280}

                    >


                        <BarChart

                            data={pipelineData}

                        >


                            <CartesianGrid

                                strokeDasharray="3 3"

                            />


                            <XAxis

                                dataKey="nome"

                            />


                            <YAxis />


                            <Tooltip />


                            <Bar

                                dataKey="valor"

                            />


                        </BarChart>


                    </ResponsiveContainer>


                </div>









                <div className="chart-box">


                    <h3>

                        Prioridades

                    </h3>



                    <ResponsiveContainer

                        width="100%"

                        height={280}

                    >


                        <PieChart>


                            <Pie

                                data={prioridadeData}

                                dataKey="valor"

                                nameKey="nome"

                                outerRadius={90}

                                label

                            >


                                {

                                    prioridadeData.map(

                                        (_,index)=>(


                                            <Cell

                                                key={index}

                                            />


                                        )

                                    )

                                }


                            </Pie>



                            <Tooltip />


                            <Legend />


                        </PieChart>


                    </ResponsiveContainer>


                </div>



            </div>









            <div className="ranking-box">


                <h3>


                    <Trophy size={22}/>

                    Ranking de Leads


                </h3>





                {


                    ranking.length === 0 ?


                    (

                        <p>

                            Nenhum lead no ranking

                        </p>

                    )


                    :


                    (

                        <table>


                            <thead>

                                <tr>

                                    <th>

                                        #

                                    </th>

                                    <th>

                                        Empresa

                                    </th>

                                    <th>

                                        Score

                                    </th>

                                    <th>

                                        Prioridade

                                    </th>

                                    <th>

                                        Status

                                    </th>


                                </tr>

                            </thead>



                            <tbody>


                                {


                                ranking.map(

                                    lead => (


                                        <tr

                                            key={
                                                lead.id
                                            }

                                        >


                                            <td>

                                                {
                                                    lead.posicao
                                                }

                                            </td>



                                            <td>

                                                {
                                                    lead.empresa
                                                }

                                            </td>



                                            <td>

                                                {
                                                    lead.score
                                                }

                                            </td>



                                            <td>

                                                {
                                                    lead.prioridade
                                                }

                                            </td>



                                            <td>

                                                {
                                                    lead.status
                                                }

                                            </td>


                                        </tr>


                                    )

                                )

                                }


                            </tbody>


                        </table>


                    )


                }


            </div>









            {

                dados.melhor_lead && (


                    <div className="best-lead">


                        <Award size={22}/>


                        <div>


                            <strong>

                                Melhor Lead:

                            </strong>


                            <span>

                                {
                                    dados.melhor_lead.empresa
                                }

                                {" | Score "}

                                {
                                    dados.melhor_lead.score
                                }


                            </span>


                        </div>


                    </div>


                )

            }





        </div>


    );


}