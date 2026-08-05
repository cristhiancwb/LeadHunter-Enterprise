import {
    useState,
    useEffect,
    useCallback
} from "react";


import crmService from "../services/crmService";



export default function useCRM(leadId = null) {


    const [lead, setLead] = useState(null);

    const [historico, setHistorico] = useState([]);

    const [followups, setFollowups] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);



    // =====================================
    // CARREGAR DADOS DO CRM
    // =====================================


    const carregarCRM = useCallback(
        async () => {


            if (!leadId) {

                return;

            }


            try {


                setLoading(true);

                setError(null);



                const leads =
                    await crmService.buscarLeads();



                const leadAtual =
                    leads.find(

                        item =>
                            item.id === leadId

                    );



                setLead(

                    leadAtual || null

                );



                const historicoData =
                    await crmService.buscarHistorico(
                        leadId
                    );



                setHistorico(

                    historicoData || []

                );



                const followupsData =
                    await crmService.buscarFollowups(
                        leadId
                    );



                setFollowups(

                    followupsData || []

                );



            }

            catch (err) {


                console.error(

                    "Erro carregando CRM:",

                    err

                );


                setError(err);


            }

            finally {


                setLoading(false);


            }


        },

        [leadId]

    );





    useEffect(

        () => {

            carregarCRM();

        },

        [carregarCRM]

    );





    // =====================================
    // ATUALIZAR LEAD
    // =====================================


    async function salvarLead(dados) {


        const resposta =

            await crmService.atualizarLead(

                leadId,

                dados

            );



        await carregarCRM();



        return resposta;

    }





    // =====================================
    // STATUS PIPELINE
    // =====================================


    async function alterarStatus(status) {


        const resposta =

            await crmService.alterarStatus(

                leadId,

                status

            );



        await carregarCRM();



        return resposta;

    }





    // =====================================
    // HISTÓRICO
    // =====================================


    async function adicionarHistorico(dados) {


        const resposta =

            await crmService.criarHistorico(

                {

                    ...dados,

                    lead_id: leadId

                }

            );



        await carregarCRM();



        return resposta;

    }





    async function removerHistorico(id) {


        const resposta =

            await crmService.excluirHistorico(

                id

            );



        await carregarCRM();



        return resposta;

    }





    // =====================================
    // FOLLOWUPS
    // =====================================


    async function adicionarFollowup(dados) {


        const resposta =

            await crmService.criarFollowup(

                {

                    ...dados,

                    lead_id: leadId

                }

            );



        await carregarCRM();



        return resposta;

    }





    async function concluirFollowup(id) {


        const resposta =

            await crmService.concluirFollowup(

                id

            );



        await carregarCRM();



        return resposta;

    }





    async function removerFollowup(id) {


        const resposta =

            await crmService.excluirFollowup(

                id

            );



        await carregarCRM();



        return resposta;

    }





    return {


        lead,

        historico,

        followups,


        loading,

        error,


        carregarCRM,


        salvarLead,


        alterarStatus,


        adicionarHistorico,


        removerHistorico,


        adicionarFollowup,


        concluirFollowup,


        removerFollowup


    };


}