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

    const [segmentoSelecionado, setSegmentoSelecionado] = useState("");
    const [cidadeSelecionada, setCidadeSelecionada] = useState("");
    const [visaoSelecionada, setVisaoSelecionada] = useState("segmento");










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

                    ...(dados.EM_CONTATO || []),

                    ...(dados.EM_NEGOCIACAO || []),

                    ...(dados.CONVERTIDO || []),


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

                "Lead invÃ¡lido:",

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










    const segmentos = [...new Set(
        leads
            .map(lead => lead?.segmento)
            .filter(Boolean)
            .map(segmento => String(segmento).trim())
            .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b));

    const cidades = [...new Set(
        leads
            .map(lead => lead?.cidade)
            .filter(Boolean)
            .map(cidade => String(cidade).trim())
            .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b));

    const leadsFiltrados = leads.filter(lead => {

    const cidadeOk =
        !cidadeSelecionada ||
        String(lead?.cidade || "").trim() === cidadeSelecionada;

    const segmentoOk =
        !segmentoSelecionado ||
        String(lead?.segmento || "").trim() === segmentoSelecionado;

    return cidadeOk && segmentoOk;
});

    return (



        <div className="crm-page">






            <div className="crm-header">


                <h1>

                    CRM Comercial

                </h1>



                <p>

                    GestÃ£o dos leads capturados

                <div className="crm-segmento-filtro">
                    <label htmlFor="crm-visao">
                        Visualizar por
                    </label>

                    <select
                        id="crm-visao"
                        value={visaoSelecionada}
                        onChange={e => {
                            const valor = e.target.value;
                            setVisaoSelecionada(valor);
                        }}
                    >
                        <option value="segmento">Segmento</option>
                        <option value="cidade">Cidade</option>
                    </select>

                    <div className="crm-filtro-campo">

    <label htmlFor="crm-cidade">
        Cidade
    </label>

    <select
        id="crm-cidade"
        value={cidadeSelecionada}
        onChange={e => setCidadeSelecionada(e.target.value)}
    >
        <option value="">Todas as cidades</option>

        {cidades.map(cidade => (
            <option key={cidade} value={cidade}>
                {cidade}
            </option>
        ))}
    </select>

</div>

<div className="crm-filtro-campo">

    <label htmlFor="crm-segmento">
        Segmento
    </label>

    <select
        id="crm-segmento"
        value={segmentoSelecionado}
        onChange={e => setSegmentoSelecionado(e.target.value)}
    >
        <option value="">Todos os segmentos</option>

        {segmentos.map(segmento => (
            <option key={segmento} value={segmento}>
                {segmento}
            </option>
        ))}
    </select>

</div>
                        >
                            <option value="">Todos os segmentos</option>

                            {segmentos.map(segmento => (
                                <option key={segmento} value={segmento}>
                                    {segmento}
                                </option>
                            ))}
                        </select>
                    )}
                </div>


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


                            leadsFiltrados.length === 0 ?



                            (


                                <p>

                                    Nenhum lead encontrado.

                                </p>


                            )



                            :



                            leadsFiltrados.map(

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



