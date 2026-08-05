import {
    Draggable
} from "@hello-pangea/dnd";


import "./LeadCard.css";





export default function LeadCard({


    lead,

    index,

    abrirLead


}) {




    function handleClick(e){



        // evita abrir durante o drag

        if(e.defaultPrevented){

            return;

        }





        console.log(

            "Lead selecionado:",

            lead

        );





        if(abrirLead && lead){


            abrirLead(lead);


        }


    }








    if(!lead){


        return null;


    }









    return (



        <Draggable


            draggableId={String(lead.id)}


            index={index}


        >



            {


            (provided, snapshot)=>(



                <div



                    ref={provided.innerRef}



                    {...provided.draggableProps}



                    className={

                        `pipeline-lead-card ${
                            
                            snapshot.isDragging

                            ?

                            "dragging"

                            :

                            ""

                        }`

                    }





                    onClick={handleClick}



                >







                    <div


                        className="pipeline-lead-card__handle"


                        {...provided.dragHandleProps}


                    >


                        ☰


                    </div>








                    <div className="pipeline-lead-card__content">






                        <div className="pipeline-lead-card__header">


                            <h4>


                                {lead.empresa || "Sem empresa"}


                            </h4>



                        </div>









                        <div className="pipeline-lead-card__body">





                            <p>


                                📍 {lead.cidade || "-"}


                            </p>






                            <p>


                                ⭐ Score:

                                <strong>

                                    {" "}

                                    {lead.score ?? 0}

                                </strong>


                            </p>






                            <p>


                                🎯 Prioridade:

                                <strong>

                                    {" "}

                                    {lead.prioridade || "-"}

                                </strong>


                            </p>







                            <p>


                                Status:

                                <strong>

                                    {" "}

                                    {lead.status || "-"}

                                </strong>


                            </p>






                        </div>







                    </div>







                </div>



            )


            }



        </Draggable>



    );


}
