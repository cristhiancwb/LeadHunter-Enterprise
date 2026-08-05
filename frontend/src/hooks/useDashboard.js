import {
    useState,
    useEffect,
    useCallback
} from "react";


import dashboardService from "../services/dashboardService";



export default function useDashboard(

    periodo = "todos"

) {


    const [dados, setDados] = useState({

        total_leads: 0,

        leads_quentes: 0,

        alta_prioridade: 0,

        fechados: 0,

        taxa_conversao: 0,

        score_medio: 0,

        melhor_lead: null,

        pipeline: {},

        prioridades: {},

        total_followups: 0,

        followups_pendentes: 0

    });



    const [ranking, setRanking] = useState([]);



    const [loading, setLoading] = useState(false);



    const [error, setError] = useState(null);





    // =====================================
    // CARREGAR DASHBOARD
    // =====================================


    const carregarDashboard = useCallback(

        async () => {


            try {


                setLoading(true);

                setError(null);



                const estatisticas =

                    await dashboardService.buscarEstatisticas();



                const rankingDados =

                    await dashboardService.buscarRanking();



                setDados(

                    estatisticas || {}

                );



                setRanking(

                    rankingDados || []

                );



            }

            catch (err) {


                console.error(

                    "Erro carregando dashboard:",

                    err

                );


                setError(err);


            }

            finally {


                setLoading(false);


            }


        },


        []

    );





    // =====================================
    // ATUALIZAÇÃO AUTOMÁTICA
    // =====================================


    useEffect(

        () => {


            carregarDashboard();


        },


        [

            carregarDashboard,

            periodo

        ]

    );





    return {


        dados,


        ranking,


        loading,


        error,


        atualizar:

            carregarDashboard


    };


}