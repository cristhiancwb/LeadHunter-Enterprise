import PipelineCard from "./PipelineCard";


export default function PipelineColumn({

    titulo,

    status,

    leads = [],

    onLeadClick,

    onStatusChange

}) {


    return (

        <div className="pipeline-column">


            <div className="pipeline-column-header">


                <h3>

                    {titulo}

                </h3>


                <span>

                    {leads.length}

                </span>


            </div>



            <div className="pipeline-column-body">


                {

                    leads.length === 0 && (


                        <div className="empty-column">

                            Nenhum lead

                        </div>


                    )

                }



                {

                    leads.map(lead => (


                        <PipelineCard


                            key={lead.id}


                            lead={lead}


                            onClick={() =>

                                onLeadClick &&

                                onLeadClick(lead)

                            }


                            onStatusChange={onStatusChange}


                        />


                    ))

                }


            </div>


        </div>

    );

}