import { useEffect, useState } from "react";


import {
    DragDropContext,
    Droppable,
    Draggable
} from "@hello-pangea/dnd";


import {
    buscarPipeline,
    atualizarStatusLead
} from "../services/api";


import "../styles/Pipeline.css";



const colunas = [
    "NOVO",
    "CONTATO"
];



function Pipeline(){


    const [leads,setLeads] = useState([]);





    useEffect(()=>{

        carregarPipeline();

    },[]);





    async function carregarPipeline(){


        try{


            const dados =
                await buscarPipeline();



            setLeads(
                Array.isArray(dados)
                ? dados
                : []
            );


        }
        catch(error){

            console.error(
                "Erro carregar pipeline:",
                error
            );


            setLeads([]);

        }


    }





    async function moverLead(resultado){


        const {
            destination,
            source,
            draggableId
        } = resultado;



        if(!destination){

            return;

        }



        if(
            destination.droppableId ===
            source.droppableId
        ){

            return;

        }



        const leadId =
            Number(draggableId);



        const novoStatus =
            destination.droppableId;



        try{


            await atualizarStatusLead(
                leadId,
                novoStatus
            );



            await carregarPipeline();


        }
        catch(error){


            console.error(
                "Erro mover lead:",
                error
            );


        }


    }





    function leadsPorStatus(status){


        return leads.filter(
            lead =>
            lead.status === status
        );


    }





    return (

        <DragDropContext
            onDragEnd={moverLead}
        >


            <div className="pipeline">


                {
                    colunas.map((coluna)=>(


                        <Droppable

                            key={`droppable-${coluna}`}

                            droppableId={coluna}

                        >


                            {
                                (provided)=>(


                                    <div

                                        key={`column-${coluna}`}

                                        className="pipeline-coluna"

                                        ref={
                                            provided.innerRef
                                        }

                                        {...provided.droppableProps}

                                    >


                                        <h3>
                                            {coluna}
                                        </h3>




                                        {

                                            leadsPorStatus(coluna)
                                            
                                            .map(
                                                (lead,index)=>(


                                                    <Draggable

                                                        key={
                                                            `lead-${lead.id}`
                                                        }

                                                        draggableId={
                                                            String(lead.id)
                                                        }

                                                        index={index}

                                                    >


                                                        {
                                                            (provided)=>(


                                                                <div

                                                                    key={
                                                                        `card-${lead.id}`
                                                                    }

                                                                    className="lead-card"

                                                                    ref={
                                                                        provided.innerRef
                                                                    }

                                                                    {...provided.draggableProps}

                                                                    {...provided.dragHandleProps}

                                                                >



                                                                    <strong>
                                                                        {
                                                                            lead.empresa ||
                                                                            lead.nome ||
                                                                            "Sem nome"
                                                                        }
                                                                    </strong>



                                                                    <span>
                                                                        📍 {lead.cidade || "-"}
                                                                    </span>



                                                                    <span>
                                                                        Score:
                                                                        {" "}
                                                                        {lead.score || 0}
                                                                    </span>



                                                                    <span>
                                                                        Prioridade:
                                                                        {" "}
                                                                        {lead.prioridade || "-"}
                                                                    </span>



                                                                </div>


                                                            )
                                                        }



                                                    </Draggable>


                                                )

                                            )


                                        }




                                        {
                                            provided.placeholder
                                        }



                                    </div>


                                )
                            }



                        </Droppable>


                    ))
                }



            </div>


        </DragDropContext>


    );

}



export default Pipeline;