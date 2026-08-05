import {
    Trophy,
    Star,
    Flame,
    CheckCircle,
    Phone
} from "lucide-react";





function medalha(posicao) {


    if (posicao === 1) {

        return "🥇";

    }


    if (posicao === 2) {

        return "🥈";

    }


    if (posicao === 3) {

        return "🥉";

    }


    return `#${posicao}`;

}









export default function RankingCard({


    ranking = [],


    abrirLead


}) {



    return (



        <section className="ranking-card-container">



            <div className="ranking-card-title">


                <Trophy size={22}/>


                <h2>

                    Ranking de Leads

                </h2>


            </div>







            <div className="ranking-list">



            {


            ranking.map((lead)=>(




                <div


                    key={lead.id}


                    className="ranking-card"



                    onClick={() =>

                        abrirLead &&

                        abrirLead(lead)

                    }


                >





                    <div className="ranking-position">


                        <span>


                            {medalha(

                                lead.posicao

                            )}


                        </span>


                    </div>








                    <div className="ranking-content">



                        <h3>


                            {lead.empresa}


                        </h3>





                        <p>


                            📍 {lead.cidade || "-"}


                        </p>






                        <div className="score-area">


                            <Star size={16}/>


                            <span>

                                Score

                            </span>



                            <strong>

                                {lead.score ?? 0}

                            </strong>


                        </div>







                        <div className="score-bar">


                            <div


                                className="score-progress"


                                style={{

                                    width:

                                    `${lead.score ?? 0}%`

                                }}


                            />



                        </div>









                        <div className="ranking-badges">





                            <span className="priority-badge">


                                <Flame size={14}/>


                                {lead.prioridade || "BAIXA"}



                            </span>








                            <span className="status-badge">


                                <CheckCircle size={14}/>


                                {lead.status || "NOVO"}



                            </span>





                        </div>







                        {

                        lead.telefone && (



                            <p className="lead-phone">


                                <Phone size={14}/>


                                {lead.telefone}



                            </p>



                        )

                        }





                    </div>




                </div>





            ))



            }





            {

            ranking.length === 0 && (



                <p className="empty-ranking">


                    Nenhum lead encontrado.


                </p>



            )

            }





            </div>




        </section>



    );


}