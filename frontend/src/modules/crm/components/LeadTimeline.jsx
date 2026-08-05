import { useEffect, useState } from "react";

import {
    listarFollowupsLead
} from "../../../services/followupService";

import "./LeadTimeline.css";


export default function LeadTimeline({

    leadId

}) {


    const [eventos, setEventos] = useState([]);

    const [loading, setLoading] = useState(true);




    async function carregarTimeline() {


        try {


            setLoading(true);



            const followups =
                await listarFollowupsLead(
                    leadId
                );



            const timeline =
                (followups || [])
                .map(item => ({


                    id: item.id,


                    titulo: item.titulo,


                    descricao:
                        item.descricao,


                    tipo:
                        item.tipo,


                    data:
                        item.data_agendada
                        ||
                        item.criado_em,


                    concluido:
                        item.concluido


                }))
                .sort(

                    (a,b) =>

                        new Date(b.data)
                        -
                        new Date(a.data)

                );



            setEventos(timeline);



        } catch(error) {


            console.error(

                "Erro timeline:",

                error

            );


            setEventos([]);



        } finally {


            setLoading(false);


        }


    }






    useEffect(() => {


        if (leadId) {


            carregarTimeline();


        }


    }, [leadId]);









    function formatarData(data) {


        if (!data) return "-";



        return new Date(data)

            .toLocaleString(

                "pt-BR"

            );


    }







    function icone(tipo) {


        switch(tipo) {


            case "WhatsApp":

                return "💬";


            case "Ligação":

                return "📞";


            case "Email":

                return "✉️";


            case "Reunião":

                return "🤝";


            case "Proposta":

                return "📄";


            default:

                return "📌";


        }


    }








    if (loading) {


        return (

            <div className="timeline-loading">

                Carregando timeline...

            </div>

        );


    }









    return (


        <div className="lead-timeline">


            <h3>

                Timeline Comercial

            </h3>







            {

                eventos.length === 0 && (


                    <div className="timeline-empty">


                        Nenhum evento registrado.


                    </div>


                )

            }









            {

                eventos.map(evento => (



                    <div

                        key={evento.id}

                        className="timeline-item"

                    >



                        <div className="timeline-icon">


                            {

                                icone(

                                    evento.tipo

                                )

                            }


                        </div>







                        <div className="timeline-content">



                            <div className="timeline-header">


                                <strong>

                                    {evento.titulo}

                                </strong>



                                <span

                                    className={

                                        evento.concluido

                                        ?

                                        "timeline-status done"

                                        :

                                        "timeline-status"

                                    }

                                >

                                    {

                                        evento.concluido

                                        ?

                                        "Concluído"

                                        :

                                        "Pendente"

                                    }


                                </span>


                            </div>






                            <p>

                                {

                                    evento.descricao ||

                                    "Sem descrição"

                                }


                            </p>






                            <small>

                                {

                                    formatarData(

                                        evento.data

                                    )

                                }


                            </small>



                        </div>



                    </div>



                ))

            }





        </div>


    );

}