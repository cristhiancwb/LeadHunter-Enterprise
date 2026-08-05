import { useEffect, useState } from "react";

import {
    DragDropContext,
    Droppable,
    Draggable
} from "@hello-pangea/dnd";


import api from "../api/api";

import LeadDetails from "./LeadDetails";




function Pipeline() {


    const etapas = [

        "NOVO",

        "CONTATO",

        "QUALIFICADO",

        "NEGOCIACAO",

        "PROPOSTA",

        "FECHADO",

        "PERDIDO"

    ];



    const [pipeline, setPipeline] = useState({});


    const [leadSelecionado, setLeadSelecionado] = useState(null);


    const [loading, setLoading] = useState(true);






    useEffect(() => {

        carregarPipeline();

    }, []);







    async function carregarPipeline() {


        try {


            setLoading(true);


            const response = await api.get(

                "/pipeline"

            );


            setPipeline(

                response.data

            );



        } catch(error) {


            console.error(

                "Erro carregando pipeline",

                error

            );


        } finally {


            setLoading(false);


        }


    }







    async function atualizarStatus(

        leadId,

        novoStatus

    ) {


        try {



            await api.put(

                `/leads/${leadId}/status`,

                {

                    status: novoStatus

                }

            );



            await carregarPipeline();




        } catch(error) {


            console.error(

                "Erro atualizando status",

                error

            );


            alert(

                "Erro ao atualizar status"

            );


        }


    }









    async function onDragEnd(resultado) {


        const {

            destination,

            source,

            draggableId


        } = resultado;





        if(!destination) return;




        const statusAnterior =

            source.droppableId;



        const novoStatus =

            destination.droppableId;





        if(

            statusAnterior === novoStatus

        ){

            return;

        }






        await atualizarStatus(

            Number(draggableId),

            novoStatus

        );



    }









    if(loading){


        return (

            <div className="dashboard">

                Carregando Pipeline...

            </div>

        );


    }








    return (


        <div className="dashboard">



            <h1>

                🚀 Pipeline Comercial

            </h1>





            <DragDropContext

                onDragEnd={onDragEnd}

            >



                <div className="kanban">



                    {

                        etapas.map(

                            etapa => (


                                <Droppable

                                    droppableId={etapa}

                                    key={etapa}

                                >


                                {

                                    (provided) => (


                                    <div

                                        className="kanban-column"

                                        ref={

                                            provided.innerRef

                                        }

                                        {...provided.droppableProps}

                                    >



                                        <h3>

                                            {etapa}

                                        </h3>





                                        {

                                            pipeline[etapa]?.map(

                                                (lead,index)=>(


                                                <Draggable

                                                    draggableId={

                                                        String(

                                                            lead.id

                                                        )

                                                    }

                                                    index={index}

                                                    key={lead.id}

                                                >



                                                {

                                                    (provided)=>(


                                                    <div

                                                        className="kanban-card"


                                                        ref={

                                                            provided.innerRef

                                                        }


                                                        {...provided.draggableProps}


                                                        {...provided.dragHandleProps}


                                                        onClick={()=>


                                                            setLeadSelecionado(

                                                                lead

                                                            )


                                                        }

                                                    >


                                                        <h4>

                                                            🏢 {lead.empresa}

                                                        </h4>


                                                        <p>

                                                            📍 {lead.cidade}

                                                        </p>


                                                        <p>

                                                            ⭐ Score:

                                                            {" "}

                                                            {lead.score}

                                                        </p>


                                                        <p>

                                                            🔥 {lead.prioridade}

                                                        </p>



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


                            )

                        )

                    }




                </div>



            </DragDropContext>









            {

                leadSelecionado && (


                    <LeadDetails


                        lead={leadSelecionado}


                        fechar={() =>

                            setLeadSelecionado(null)

                        }


                        atualizar={() => {


                            carregarPipeline();


                            setLeadSelecionado(null);


                        }}


                    />


                )


            }





        </div>


    );

}



export default Pipeline;