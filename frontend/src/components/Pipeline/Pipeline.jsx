import './Pipeline.css';
import {
    useEffect,
    useState
} from "react";


import {
    DragDropContext
} from "@hello-pangea/dnd";


import PipelineColumn from "./PipelineColumn.jsx";


import {
    buscarPipeline,
    atualizarStatusLead
} from "../../services/api.js";


import LoadingSpinner from "../Common/LoadingSpinner.jsx";

import ErrorMessage from "../Common/ErrorMessage.jsx";





const STATUS = [

    "NOVO",

    "EM_CONTATO",

    "QUALIFICADO",

    "EM_NEGOCIACAO",

    "FECHADO",

    "PERDIDO",
    "CONVERTIDO"

];








export default function Pipeline({

    abrirLead,

    atualizar,

    refreshToken

}) {



    const [

        leads,

        setLeads

    ] = useState([]);





    const [

        loading,

        setLoading

    ] = useState(true);





    const [

        erro,

        setErro

    ] = useState("");









    async function carregarPipeline(){


        const dados = await buscarPipeline();



        console.log(

            "Pipeline recebido:",

            dados

        );





        let lista = [];





        if(Array.isArray(dados)){


            lista = dados;


        }



        else if(dados){



            const pipeline =

                dados.pipeline ||

                dados;



            lista = Object.values(

                pipeline

            )

            .flat();



        }






        setLeads(

            lista

        );



    }









    async function carregarDados(){


        try{


            setLoading(true);

            setErro("");



            await carregarPipeline();



        }

        catch(error){



            console.error(

                "Erro carregando Pipeline:",

                error

            );



            setErro(

                "NÃ£o foi possÃ­vel carregar o Pipeline."

            );



        }

        finally{


            setLoading(false);


        }



    }









    useEffect(()=>{


        carregarDados();



    },[refreshToken]);









    function organizarPorStatus(){



        const grupos = {};





        STATUS.forEach(status=>{


            grupos[status] = [];


        });







        leads.forEach(lead=>{



            const status =

                lead.status ||

                lead.stage ||

                lead.situacao ||

                "NOVO";







            if(

                grupos[status]

            ){


                grupos[status].push(

                    lead

                );


            }



            else{


                grupos.NOVO.push(

                    lead

                );


            }



        });







        return grupos;



    }









    async function moverLead(resultado){



        const {

            destination,

            draggableId

        } = resultado;







        if(!destination){


            return;


        }








        const novoStatus =

            destination.droppableId;






        const leadId =

            Number(draggableId);







        const leadAtual = leads.find(

            lead =>

                lead.id === leadId

        );







        if(

            !leadAtual ||

            leadAtual.status === novoStatus

        ){


            return;


        }









        try{



            setLoading(true);







            await atualizarStatusLead(

                leadId,

                novoStatus

            );







            await carregarPipeline();








            if(atualizar){


                atualizar();


            }





        }

        catch(error){



            console.error(

                "Erro movendo lead:",

                error

            );



            setErro(

                "Erro ao atualizar status do lead."

            );



        }

        finally{


            setLoading(false);


        }



    }









    const colunas =

        organizarPorStatus();











    if(loading){


        return (

            <LoadingSpinner

                message="Carregando Pipeline..."

            />

        );


    }











    if(erro){


        return (

            <ErrorMessage

                message={erro}

                onRetry={carregarDados}

            />

        );


    }











    return (


        <DragDropContext

            onDragEnd={moverLead}

        >



            <div className="pipeline-board">


                {

                    STATUS.map(status=>(


                        <PipelineColumn



                            key={status}



                            status={status}



                            leads={

                                colunas[status] || []

                            }



                            abrirLead={

                                abrirLead

                            }



                        />


                    ))


                }


            </div>



        </DragDropContext>


    );


}




