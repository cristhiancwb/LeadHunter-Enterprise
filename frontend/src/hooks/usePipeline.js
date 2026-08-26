import {
    useEffect,
    useState
} from "react";

import pipelineService from "../services/pipelineService";

export default function usePipeline() {

    const [
        leads,
        setLeads
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState(null);


    function normalizarPipeline(resposta) {

        if (Array.isArray(resposta)) {

            return resposta;

        }


        if (
            resposta &&
            Array.isArray(resposta.leads)
        ) {

            return resposta.leads;

        }


        /*
            Backend atual retorna:

            {
                NOVO: [],
                CONTATO: [],
                QUALIFICADO: [],
                FECHADO: [],
                PERDIDO: []
            }

            Transformamos os grupos em uma lista única,
            preservando o status de cada lead.
        */

        if (
            resposta &&
            typeof resposta === "object"
        ) {

            const resultado = [];

            Object.entries(resposta).forEach(
                ([status, lista]) => {

                    if (!Array.isArray(lista)) {
                        return;
                    }

                    lista.forEach(lead => {

                        resultado.push({
                            ...lead,
                            status:
                                lead.status ||
                                status
                        });

                    });

                }
            );

            return resultado;

        }


        return [];

    }


    async function carregarPipeline() {

        try {

            setLoading(true);
            setError(null);

            const resposta =
                await pipelineService.buscarPipeline();

            const pipeline =
                normalizarPipeline(resposta);

            setLeads(pipeline);

        }

        catch (error) {

            console.error(
                "Erro carregando pipeline:",
                error
            );

            setError(
                "Erro ao carregar pipeline"
            );

            setLeads([]);

        }

        finally {

            setLoading(false);

        }

    }


    async function alterarStatus(
        leadId,
        status
    ) {

        try {

            const resposta =
                await pipelineService.atualizarStatus(
                    leadId,
                    status
                );


            const statusAtualizado =
                resposta?.lead?.status_novo ||
                resposta?.status ||
                status;


            setLeads(lista =>

                lista.map(lead =>

                    lead.id === leadId

                    ?

                    {
                        ...lead,
                        status: statusAtualizado
                    }

                    :

                    lead

                )

            );


            return resposta;

        }

        catch (error) {

            console.error(
                "Erro atualizando status:",
                error
            );

            throw error;

        }

    }


    function buscarPorStatus(status) {

        return leads.filter(
            lead =>
                lead.status === status
        );

    }


    useEffect(() => {

        carregarPipeline();

    }, []);


    return {

        leads,
        loading,
        error,
        carregarPipeline,
        alterarStatus,
        buscarPorStatus

    };

}
