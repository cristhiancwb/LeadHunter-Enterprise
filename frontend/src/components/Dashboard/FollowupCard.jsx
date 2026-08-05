import {
    CalendarClock,
    CheckCircle,
    Clock,
    UserRound
} from "lucide-react";





export default function FollowupCard({


    followups = [],


    total = 0,


    pendentes = 0,


    abrirLead


}) {



    return (



        <section className="followup-card-container">





            <div className="followup-header">



                <div>


                    <CalendarClock size={22}/>


                    <h2>

                        Próximos Follow-ups

                    </h2>


                </div>





                <div className="followup-counter">


                    <strong>

                        {pendentes}

                    </strong>


                    pendentes


                </div>



            </div>









            {

            followups.length === 0 && (



                <div className="empty-followup">


                    <CheckCircle size={20}/>


                    <p>

                        Nenhum follow-up pendente.

                    </p>


                </div>



            )

            }









            <div className="followup-list">





            {


            followups.map((item)=>(




                <div


                    key={item.id}


                    className="followup-item"


                    onClick={() =>

                        abrirLead &&

                        abrirLead({

                            id:item.lead_id

                        })

                    }


                >





                    <div className="followup-icon">


                        <Clock size={18}/>


                    </div>








                    <div className="followup-content">



                        <h3>


                            {item.titulo || "Contato comercial"}


                        </h3>






                        <p>


                            <UserRound size={14}/>


                            Lead #{item.lead_id}


                        </p>







                        <small>


                            {


                            item.data_agendada

                            ? new Date(

                                item.data_agendada

                            ).toLocaleString()

                            : "Sem data"

                            }


                        </small>





                    </div>






                </div>



            ))



            }





            </div>






        </section>


    );


}