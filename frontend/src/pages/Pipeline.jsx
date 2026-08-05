import {
    useEffect,
    useState
} from "react";


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

    "CONTATO",

    "QUALIFICADO",

    "NEGOCIACAO",

    "FECHADO",

    "PERDIDO"

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



            console.log(
                "PIPELINE:",
                dados
            );



            setLeads(

                Array.isArray(dados)

                ? dados

                : dados.leads || []

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



        try{


            await atualizarStatusLead(

                Number(draggableId),

                destination.droppableId

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







    function estatisticas(status){


        const lista =
            leadsPorStatus(status);



        const total =
            lista.length;



        const score =

            total > 0

            ?

            Math.round(

                lista.reduce(

                    (acc,lead)=>

                    acc + Number(lead.score || 0),

                    0

                )

                /

                total

            )

            :

            0;



        const alta =

            lista.filter(

                lead =>

                lead.prioridade === "ALTA"

            ).length;



        return {

            total,

            score,

            alta

        };

    }







    return (

        <DragDropContext

            onDragEnd={moverLead}

        >


            <div className="pipeline">


                {
                    colunas.map(coluna=>{


                        const info =
                            estatisticas(coluna);



                        return (

                        <Droppable

                            key={coluna}

                            droppableId={coluna}

                        >

                        {
                            provided => (

                            <div

                                className="pipeline-coluna"

                                ref={
                                    provided.innerRef
                                }

                                {...provided.droppableProps}

                            >


                                <h3>
                                    {coluna}
                                </h3>


                                <div>

                                    {info.total} Leads
                                    <br/>

                                    Score médio:
                                    {" "}
                                    {info.score}

                                    <br/>

                                    Alta prioridade:
                                    {" "}
                                    {info.alta}

                                </div>



                                {


                                leadsPorStatus(coluna)

                                .map(

                                (lead,index)=>(


                                <Draggable

                                    key={lead.id}

                                    draggableId={
                                        String(lead.id)
                                    }

                                    index={index}

                                >

                                {
                                provided => (


                                <div

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
                                        ⭐ Score:
                                        {" "}
                                        {lead.score || 0}
                                    </span>


                                    <span>
                                        🎯
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


                        );


                    })

                }


            </div>


        </DragDropContext>


    );

}



export default Pipeline;