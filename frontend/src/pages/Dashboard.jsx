import {
    useState
} from "react";


import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";


import {
    RefreshCw,
    Users,
    Flame,
    Target,
    CalendarClock
} from "lucide-react";


import useDashboard from "../hooks/useDashboard";


import DashboardCard from "../components/Dashboard/DashboardCard.jsx";

import BestLeadCard from "../components/Dashboard/BestLeadCard.jsx";

import FollowupCard from "../components/Dashboard/FollowupCard.jsx";

import RankingCard from "../components/Dashboard/RankingCard.jsx";


import "./Dashboard.css";





export default function Dashboard() {



    const [periodo,setPeriodo] = useState("todos");



    const {

        dados,

        ranking,

        loading,

        atualizar

    } = useDashboard(periodo);







    const pipelineData = Object.entries(

        dados.pipeline || {}

    ).map(([nome,valor])=>({


        nome,

        valor


    }));







    const prioridadeData = Object.entries(

        dados.prioridades || {}

    ).map(([nome,valor])=>({


        nome,

        valor


    }));







    if(loading){


        return (

            <div className="dashboard-loading">

                Carregando Dashboard...

            </div>

        );

    }







    return (



        <div className="dashboard-container">





            <header className="dashboard-header">



                <div>


                    <h1>

                        Dashboard Enterprise

                    </h1>



                    <p>

                        Visão geral comercial dos leads

                    </p>


                </div>







                <div className="dashboard-actions">



                    <select


                        value={periodo}


                        onChange={(e)=>

                            setPeriodo(

                                e.target.value

                            )

                        }


                    >


                        <option value="todos">

                            Todos

                        </option>


                        <option value="hoje">

                            Hoje

                        </option>


                        <option value="7dias">

                            Últimos 7 dias

                        </option>


                        <option value="30dias">

                            Últimos 30 dias

                        </option>



                    </select>







                    <button

                        onClick={atualizar}

                    >


                        <RefreshCw size={18}/>


                        Atualizar


                    </button>



                </div>



            </header>









            <section className="dashboard-cards">



                <DashboardCard

                    titulo="Total Leads"

                    valor={dados.total_leads || 0}

                    descricao="Leads cadastrados"

                    icon={Users}

                />





                <DashboardCard

                    titulo="Leads Quentes"

                    valor={dados.leads_quentes || 0}

                    descricao="Alta oportunidade"

                    icon={Flame}

                />





                <DashboardCard

                    titulo="Conversão"

                    valor={`${dados.taxa_conversao || 0}%`}

                    descricao="Taxa comercial"

                    icon={Target}

                />





                <DashboardCard

                    titulo="Follow-ups Pendentes"

                    valor={dados.followups_pendentes || 0}

                    descricao="Aguardando ação"

                    icon={CalendarClock}

                />



            </section>









            <BestLeadCard

                lead={dados.melhor_lead}

            />









            <FollowupCard


                followups={

                    dados.proximos_followups || []

                }


                total={

                    dados.total_followups || 0

                }


                pendentes={

                    dados.followups_pendentes || 0

                }


            />









            <div className="charts-grid">





                <section className="dashboard-section">


                    <h2>

                        Pipeline Comercial

                    </h2>





                    <ResponsiveContainer

                        width="100%"

                        height={300}

                    >


                        <BarChart

                            data={pipelineData}

                        >


                            <XAxis

                                dataKey="nome"

                            />


                            <YAxis/>


                            <Tooltip/>


                            <Bar

                                dataKey="valor"

                            />


                        </BarChart>



                    </ResponsiveContainer>


                </section>









                <section className="dashboard-section">


                    <h2>

                        Prioridades

                    </h2>






                    <ResponsiveContainer

                        width="100%"

                        height={300}

                    >



                        <PieChart>


                            <Pie

                                data={prioridadeData}

                                dataKey="valor"

                                nameKey="nome"

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



                            <Tooltip/>


                            <Legend/>


                        </PieChart>



                    </ResponsiveContainer>


                </section>





            </div>









            <RankingCard

                ranking={ranking}

            />





        </div>


    );


}