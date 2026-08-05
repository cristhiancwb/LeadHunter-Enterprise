import React from "react";



export default function FollowupBadge({

    followup

}) {



    if (!followup) {


        return (

            <div className="followup-badge empty">

                📅 Sem próximo contato

            </div>

        );

    }





    const dataContato = new Date(

        followup.data_agendada

    );



    const agora = new Date();





    const inicioHoje = new Date(

        agora.getFullYear(),

        agora.getMonth(),

        agora.getDate()

    );





    const inicioContato = new Date(

        dataContato.getFullYear(),

        dataContato.getMonth(),

        dataContato.getDate()

    );





    const diferencaDias = Math.floor(

        (

            inicioHoje - inicioContato

        ) / 

        (

            1000 *

            60 *

            60 *

            24

        )

    );





    let statusVisual = "future";

    let titulo = "📅 Próximo contato";





    if (diferencaDias > 0) {


        statusVisual = "late";

        titulo = "🚨 Contato atrasado";


    } else if (diferencaDias === 0) {


        statusVisual = "today";

        titulo = "⚠️ Contato hoje";


    }





    function formatarData(data) {


        return data.toLocaleString(

            "pt-BR",

            {

                day: "2-digit",

                month: "2-digit",

                year: "numeric",

                hour: "2-digit",

                minute: "2-digit"

            }

        );

    }







    return (

        <div

            className={

                `followup-badge ${statusVisual}`

            }

        >



            <strong>

                {titulo}

            </strong>





            <div>

                📞 {followup.tipo}

            </div>





            <div>

                🕒 {formatarData(dataContato)}

            </div>






            {

                diferencaDias > 0 && (


                    <div>

                        Atrasado há {diferencaDias} dia(s)

                    </div>


                )

            }







            {

                followup.observacao && (


                    <small>

                        📝 {followup.observacao}

                    </small>


                )

            }



        </div>

    );

}