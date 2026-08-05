import {
    useEffect,
    useState
} from "react";


import {
    buscarPipeline
} from "../services/api.js";


import LeadCard from "../components/LeadCard.jsx";


import LeadModal from "../components/LeadModal.jsx";


import Pipeline from "../components/Pipeline/Pipeline.jsx";


import "./CRM.css";







function CRM(){



    const [

        leads,

        setLeads

    ] = useState([]);




    const [

        leadSelecionado,

        setLeadSelecionado

    ] = useState(null);




    const [

        loading,

        setLoading

    ] = useState(true);

    const [pipelineRefresh, setPipelineRefresh] = useState(0);









    async function carregarLeads(){



        try {



            setLoading(true);





            const dados = await buscarPipeline();





            console.log(

                "Leads recebidos CRM:",

                dados

            );








            let lista = [];







            // Backend novo

            if (

                dados &&

                !Array.isArray(dados)

            ) {



                lista = [


                    ...(dados.NOVO || []),


                    ...(dados.CONTATO || []),


                    ...(dados.QUALIFICADO || []),


                    ...(dados.NEGOCIACAO || []),


                    ...(dados.FECHADO || []),


                    ...(dados.PERDIDO || [])



                ];



            }





            // Compatibilidade API antiga

            else if (

                Array.isArray(dados)

            ) {



                lista = dados;


            }








            setLeads(


                lista.filter(

                    lead =>

                    lead &&

                    lead.id

                )


            );







        }

        catch(error){



            console.error(

                "Erro carregando CRM:",

                error

            );



            setLeads([]);



        }

        finally{



            setLoading(false);



        }


    }









    useEffect(()=>{


        carregarLeads();



    },[]);









    function abrirLead(lead){



        console.log(

            "Abrindo modal lead:",

            lead

        );




        if(!lead?.id){



            console.error(

                "Lead inválido:",

                lead

            );



            return;


        }





        setLeadSelecionado(lead);



    }









    function fecharLead(){


        setLeadSelecionado(null);


    }

    async function atualizarCRM(){

        await carregarLeads();
        setPipelineRefresh(valor => valor + 1);

    }









    return (



        <div className="crm-page">






            <div className="crm-header">


                <h1>

                    CRM Comercial

                </h1>



                <p>

                    Gestão dos leads capturados

                </p>


            </div>









            {


                loading ?



                (

                    <p>

                        Carregando leads...

                    </p>

                )



                :



                (



                    <div className="crm-grid">





                        {


                            leads.length === 0 ?



                            (


                                <p>

                                    Nenhum lead encontrado.

                                </p>


                            )



                            :



                            leads.map(

                                lead => (



                                    <LeadCard



                                        key={

                                            `lead-${lead.id}`

                                        }



                                        lead={lead}



                                        onClick={

                                            abrirLead

                                        }



                                    />



                                )


                            )



                        }





                    </div>



                )



            }









            <Pipeline

                abrirLead={abrirLead}

                atualizar={atualizarCRM}

                refreshToken={pipelineRefresh}

            />









            {


                leadSelecionado && (



                    <LeadModal



                        key={

                            leadSelecionado.id

                        }



                        lead={

                            leadSelecionado

                        }



                        fechar={

                            fecharLead

                        }



                        onClose={

                            fecharLead

                        }



                        atualizar={

                            atualizarCRM

                        }



                    />



                )


            }






        </div>



    );

}



export default CRM;
