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

        followups_pendentes: 0,

        proximos_followups: []

    });


    const [ranking, setRanking] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);


    const carregarDashboard = useCallback(

        async () => {

            try {

                setLoading(true);

                setError(null);


                const estatisticas =
                    await dashboardService.buscarEstatisticas();


                const rankingDados =
                    await dashboardService.buscarRanking();


                const pipeline =
                    estatisticas?.pipeline || {};


                const prioridades =
                    estatisticas?.prioridades || {};


                const totalLeads =
                    Number(estatisticas?.total_leads || 0);


                const fechados =
                    Number(pipeline?.FECHADO || 0);


                const altaPrioridade =
                    Number(prioridades?.ALTA || 0);


                const taxaConversao =
                    totalLeads > 0
                        ? Number(
                            (
                                (fechados / totalLeads) * 100
                            ).toFixed(1)
                        )
                        : 0;


                setDados({

                    ...estatisticas,

                    total_leads:
                        totalLeads,

                    leads_quentes:
                        altaPrioridade,

                    alta_prioridade:
                        altaPrioridade,

                    fechados:
                        fechados,

                    taxa_conversao:
                        taxaConversao,

                    score_medio:
                        Number(
                            estatisticas?.media_score || 0
                        ),

                    melhor_lead:
                        estatisticas?.melhor_lead || null,

                    pipeline:
                        pipeline,

                    prioridades:
                        prioridades,

                    total_followups:
                        Number(
                            estatisticas?.total_followups || 0
                        ),

                    followups_pendentes:
                        Number(
                            estatisticas?.followups_pendentes || 0
                        ),

                    proximos_followups:
                        Array.isArray(
                            estatisticas?.proximos_followups
                        )
                            ? estatisticas.proximos_followups
                            : []

                });


                setRanking(

                    Array.isArray(rankingDados)
                        ? rankingDados
                        : []

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
