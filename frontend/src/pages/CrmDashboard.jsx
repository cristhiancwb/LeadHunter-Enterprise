import {
    useEffect,
    useState
} from "react";


import CommercialDashboard
    from "../components/Dashboard/CommercialDashboard.jsx";


import Pipeline
    from "../components/Pipeline/Pipeline.jsx";


import FollowupPanel
    from "../components/Followup/FollowupPanel.jsx";


import LeadModal
    from "../components/LeadModal.jsx";


import {
    buscarEstatisticas,
    buscarRanking
} from "../services/api";






export default function CrmDashboard() {



    const [

        leadSelecionado,

        setLeadSelecionado

    ] = useState(null);





    const [

        estatisticas,

        setEstatisticas

    ] = useState(null);





    const [

        ranking,

        setRanking

    ] = useState([]);





    const [

        carregando,

        setCarregando

    ] = useState(true);





    const [

        erro,

        setErro

    ] = useState(null);









    async function carregarDashboard() {


        try {


            setCarregando(true);

            setErro(null);




            const [

                dadosEstatisticas,

                dadosRanking

            ] = await Promise.all([


                buscarEstatisticas(),


                buscarRanking()


            ]);





            setEstatisticas(

                dadosEstatisticas

            );




            setRanking(

                dadosRanking || []

            );





        } catch (error) {


            console.error(

                "Erro ao carregar CRM:",

                error

            );



            setErro(

                "Erro ao carregar dados do CRM"

            );



        } finally {


            setCarregando(false);


        }


    }









    useEffect(() => {


        carregarDashboard();


    }, []);









    async function atualizarTela() {


        await carregarDashboard();


    }









    return (


        <div className="crm-container">







            <header className="crm-header">


                <h1>

                    Pipeline CRM

                </h1>



                <p>

                    GestÃ£o comercial de leads

                </p>


            </header>









            {


                carregando && (


                    <div className="dashboard-loading">


                        Carregando CRM...


                    </div>


                )


            }









            {


                erro && (


                    <div className="error-message">


                        {erro}


                    </div>


                )


            }









            <section className="crm-dashboard-premium">



                <CommercialDashboard


                    estatisticas={estatisticas}


                    ranking={ranking}


                />



            </section>









            <section className="crm-followups">



                <FollowupPanel


                    abrirLead={

                        setLeadSelecionado

                    }


                    atualizar={

                        atualizarTela

                    }


                />


            </section>









            <section className="crm-pipeline">



                <Pipeline


                    abrirLead={

                        setLeadSelecionado

                    }


                    atualizar={

                        atualizarTela

                    }


                />



            </section>









            {


                leadSelecionado && (



                    <LeadModal



                        lead={leadSelecionado}



                        fechar={() =>


                            setLeadSelecionado(null)


                        }



                        atualizar={

                            atualizarTela

                        }



                    />


                )


            }







        </div>


    );


}
