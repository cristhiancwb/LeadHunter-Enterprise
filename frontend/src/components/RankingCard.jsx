import "./RankingCard.css";


export default function RankingCard({ lead }) {


    return (

        <div className="ranking-card">


            <div className="ranking-position">

                #{lead.posicao}

            </div>



            <div className="ranking-company">

                {lead.empresa}

            </div>



            <div className="ranking-info">


                <span>

                    Cidade: {lead.cidade || "-"}

                </span>



                <span>

                    Segmento: {lead.segmento || "-"}

                </span>



                <span>

                    Status: {lead.status}

                </span>



            </div>



            <div className="ranking-score">

                {lead.score}

            </div>



        </div>

    );

}