import {
    useEffect,
    useState
} from "react";


import {
    Clock,
    CheckCircle,
    ArrowRight,
    Circle
} from "lucide-react";


import {
    buscarHistoricoLead
} from "../../services/api.js";








export default function LeadTimeline({


    leadId


}) {



    const [historico,setHistorico] = useState([]);


    const [loading,setLoading] = useState(true);










    async function carregarHistorico(){



        try{


            setLoading(true);



            const dados = await buscarHistoricoLead(

                leadId

            );



            setHistorico(


                Array.isArray(dados)

                ? dados

                : []

            );



        }catch(error){



            console.error(

                "Erro carregando timeline:",

                error

            );



            setHistorico([]);



        }finally{


            setLoading(false);


        }


    }









    useEffect(()=>{


        if(leadId){


            carregarHistorico();


        }



    },[leadId]);









    function iconeStatus(status){



        switch(status){



            case "FECHADO":

                return <CheckCircle size={20}/>;


            case "NEGOCIACAO":

                return <ArrowRight size={20}/>;


            case "CONTATO":

                return <Clock size={20}/>;


            default:

                return <Circle size={18}/>;


        }


    }









    if(loading){


        return (

            <div className="timeline-loading">

                Carregando histórico...

            </div>

        );


    }









    if(historico.length === 0){


        return (

            <div className="timeline-empty">


                Nenhuma movimentação registrada.


            </div>

        );


    }









    return (



        <div className="lead-timeline">







            {


            historico.map((item)=>(




                <div


                    key={item.id}


                    className="timeline-event"

                >





                    <div className="timeline-icon">


                        {

                        iconeStatus(

                            item.status_novo

                        )

                        }


                    </div>








                    <div className="timeline-content">



                        <div className="timeline-status">


                            <strong>

                                {

                                item.status_anterior ||

                                "INICIO"

                                }


                            </strong>



                            <ArrowRight size={15}/>



                            <strong>

                                {

                                item.status_novo

                                }


                            </strong>



                        </div>








                        <small>


                            {


                            item.data

                            ? new Date(

                                item.data

                            ).toLocaleString()

                            : ""

                            }


                        </small>








                        {

                        item.observacao && (



                            <p>

                                {item.observacao}

                            </p>



                        )

                        }






                    </div>




                </div>




            ))



            }







        </div>



    );


}