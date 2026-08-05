import {
    Trophy,
    MapPin,
    Star,
    Flame,
    CheckCircle
} from "lucide-react";





export default function BestLeadCard({

    lead,

    abrirLead

}) {


    if (!lead) {

        return null;

    }







    return (


        <section className="best-lead-card">



            <div className="best-lead-header">


                <div className="best-lead-title">


                    <Trophy size={22}/>


                    <h2>

                        Melhor Lead

                    </h2>


                </div>



            </div>







            <div className="best-lead-content">



                <h3>

                    {lead.empresa}

                </h3>





                <div className="best-lead-info">


                    <p>


                        <MapPin size={16}/>


                        {lead.cidade || "-"}


                    </p>





                    <p>


                        Segmento:

                        {" "}

                        <strong>

                            {lead.segmento || "-"}

                        </strong>


                    </p>



                </div>









                <div className="best-lead-score">


                    <Star size={20}/>


                    <span>

                        Score

                    </span>


                    <strong>

                        {lead.score ?? 0}

                    </strong>


                </div>









                <div className="best-lead-badges">



                    <span className="badge badge-priority">


                        <Flame size={15}/>


                        {lead.prioridade || "BAIXA"}


                    </span>







                    <span className="badge badge-status">


                        <CheckCircle size={15}/>


                        {lead.status || "NOVO"}


                    </span>



                </div>







                {

                abrirLead && (


                    <button


                        className="best-lead-button"


                        onClick={() =>

                            abrirLead(lead)

                        }


                    >


                        Abrir Lead


                    </button>


                )

                }



            </div>



        </section>


    );

}