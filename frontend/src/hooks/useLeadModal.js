import {
    useEffect,
    useState
} from "react";


import {
    buscarLead,
    atualizarLead,
    atualizarStatusLead,
    criarHistorico,
    buscarHistorico
} from "../services/crmService";



export default function useLeadModal(
    lead,
    fechar
) {


    const [dados,setDados] = useState(null);

    const [historico,setHistorico] = useState([]);

    const [loading,setLoading] = useState(true);



    useEffect(()=>{

        async function carregar(){

            if(!lead)
                return;


            setLoading(true);


            const detalhes =
                await buscarLead(lead.id);


            const timeline =
                await buscarHistorico(
                    lead.id
                );


            setDados(detalhes);

            setHistorico(
                timeline || []
            );


            setLoading(false);

        }


        carregar();


    },[lead]);




    async function salvar(){

        await atualizarLead(
            lead.id,
            dados
        );


        fechar();

    }





    async function alterarStatus(status){

        await atualizarStatusLead(
            lead.id,
            status
        );


        setDados({

            ...dados,

            status

        });

    }





    async function adicionarHistorico(texto){

        const novo =
            await criarHistorico(
                lead.id,
                texto
            );


        setHistorico([
            ...historico,
            novo
        ]);

    }




    return {

        dados,

        setDados,

        historico,

        loading,

        salvar,

        alterarStatus,

        adicionarHistorico

    };


}