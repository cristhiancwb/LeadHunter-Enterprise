import {
    useState,
    useEffect,
    useCallback
} from "react";


import followupService from "../services/followupService";



export default function useFollowups(

    leadId = null

) {


    const [followups, setFollowups] = useState([]);


    const [loading, setLoading] = useState(false);


    const [error, setError] = useState(null);





    // =====================================
    // CARREGAR
    // =====================================


    const carregarFollowups = useCallback(

        async () => {


            if(!leadId){

                return;

            }


            try {


                setLoading(true);

                setError(null);



                const resposta =

                    await followupService.buscarFollowups(

                        leadId

                    );



                setFollowups(

                    resposta || []

                );


            }

            catch(err){


                console.error(

                    "Erro carregando followups:",

                    err

                );


                setError(err);


            }

            finally {


                setLoading(false);


            }


        },

        [

            leadId

        ]

    );





    useEffect(

        () => {


            carregarFollowups();


        },

        [

            carregarFollowups

        ]

    );





    // =====================================
    // AÇÕES
    // =====================================


    async function criar(dados){


        const resposta =

            await followupService.criarFollowup(

                {

                    lead_id: leadId,
                    tipo: dados.tipo || "nota",
                    titulo: dados.titulo || "Retorno comercial",
                    descricao: dados.descricao || dados.observacao || "",
                    observacao: dados.observacao || "",
                    data_agendada: dados.data_agendada || dados.proximo_contato || null

                }

            );



        await carregarFollowups();



        return resposta;


    }





    async function concluir(id){


        const resposta =

            await followupService.concluirFollowup(

                id

            );



        await carregarFollowups();



        return resposta;


    }






    async function cancelar(id){

        const resposta =
            await followupService.cancelarFollowup(
                id
            );

        await carregarFollowups();

        return resposta;

    }

    async function remover(id){


        const resposta =

            await followupService.excluirFollowup(

                id

            );



        await carregarFollowups();



        return resposta;


    }





    return {


        followups,


        loading,


        error,


        atualizar:

            carregarFollowups,


        criar,


        concluir,


        cancelar,


        remover


    };


}



