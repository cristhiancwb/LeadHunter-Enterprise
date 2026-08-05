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







    async function carregarPipeline(){



        try {



            setLoading(true);

            setError(null);




            const resposta = await pipelineService.buscarPipeline();





            /*
                Backend pode retornar:

                [
                    leads
                ]

                ou

                {
                    leads:[]
                }

            */


            if(Array.isArray(resposta)){


                setLeads(resposta);


            }

            else if(

                resposta &&

                Array.isArray(
                    resposta.leads
                )

            ){


                setLeads(

                    resposta.leads

                );


            }

            else{


                setLeads([]);


            }





        }

        catch(error){



            console.error(

                "Erro carregando pipeline:",

                error

            );



            setError(

                "Erro ao carregar pipeline"

            );



            setLeads([]);



        }

        finally{


            setLoading(false);


        }


    }









    async function alterarStatus(

        leadId,

        status

    ){



        try {



            const resposta = await pipelineService.atualizarStatus(

                leadId,

                status

            );





            setLeads(lista =>



                lista.map(lead =>



                    lead.id === leadId


                    ?


                    {

                        ...lead,

                        status:

                        resposta.status || status

                    }



                    :



                    lead



                )



            );





            return resposta;



        }

        catch(error){



            console.error(

                "Erro atualizando status:",

                error

            );



            throw error;



        }


    }









    function buscarPorStatus(

        status

    ){



        return leads.filter(


            lead =>

            lead.status === status


        );


    }









    useEffect(()=>{


        carregarPipeline();


    },[]);









    return {


        leads,


        loading,


        error,


        carregarPipeline,


        alterarStatus,


        buscarPorStatus


    };



}