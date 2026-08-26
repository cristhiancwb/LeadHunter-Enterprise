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

        visaoSelecionada,

        setVisaoSelecionada

    ] = useState("segmento");


    const [

        segmentoSelecionado,

        setSegmentoSelecionado

    ] = useState("");


    const [

        cidadeSelecionada,

        setCidadeSelecionada

    ] = useState("");


    const segmentos = [...new Set(
        ranking
            .map(lead => lead?.segmento)
            .filter(Boolean)
            .map(segmento => String(segmento).trim())
            .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b));


    const cidades = [...new Set(
        ranking
            .map(lead => lead?.cidade)
            .filter(Boolean)
            .map(cidade => String(cidade).trim())
            .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b));


    const rankingFiltrado = ranking.filter(lead => {

    const cidadeOk =
        !cidadeSelecionada ||
        String(lead?.cidade || "").trim() === cidadeSelecionada;

    const segmentoOk =
        !segmentoSelecionado ||
        String(lead?.segmento || "").trim() === segmentoSelecionado;

    return cidadeOk && segmentoOk;
});







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

            </div>

            <section className="crm-dashboard-premium">



                <CommercialDashboard


                    estatisticas={estatisticas}


                    ranking={rankingFiltrado}


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


