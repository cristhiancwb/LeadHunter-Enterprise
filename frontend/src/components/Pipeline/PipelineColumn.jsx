import React from "react";

import {
    Droppable
} from "@hello-pangea/dnd";


import LeadCard from "./LeadCard.jsx";

import "./PipelineColumn.css";




export default function PipelineColumn({

    status,

    leads = [],

    abrirLead,

    title,

    items,

    column


}) {


    const nomeStatus =

        status ||

        title ||

        column?.status ||

        "SEM STATUS";





    const listaLeads =

        leads.length > 0

            ? leads

            : items ||

              column?.leads ||

              [];






    const totalLeads =

        listaLeads.length;





    const scoreMedio =

        totalLeads > 0

            ? Math.round(

                listaLeads.reduce(

                    (total, lead) =>

                        total +

                        Number(

                            lead.score || 0

                        ),

                    0

                ) / totalLeads

            )

            : 0;






    const altaPrioridade =

        listaLeads.filter(

            lead =>

                lead.prioridade === "ALTA"

        ).length;







    return (


        <div className="pipeline-column">





            <div className="pipeline-header">



                <h3>

                    {nomeStatus}

                </h3>




                <div className="pipeline-stats">


                    <span>

                        {totalLeads} Leads

                    </span>



                    <span>

                        Score médio: {scoreMedio}

                    </span>




                    <span>

                        Alta prioridade: {altaPrioridade}

                    </span>



                </div>


            </div>







            <Droppable

                droppableId={nomeStatus}

            >


                {

                    provided => (


                        <div


                            className="pipeline-dropzone"


                            ref={

                                provided.innerRef

                            }


                            {...provided.droppableProps}


                        >





                            {


                                listaLeads.map(

                                    (

                                        lead,

                                        index

                                    ) => (


                                        <LeadCard



                                            key={

                                                lead.id

                                            }



                                            lead={

                                                lead

                                            }



                                            index={

                                                index

                                            }



                                            abrirLead={

                                                abrirLead

                                            }


                                        />


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





        </div>


    );


}