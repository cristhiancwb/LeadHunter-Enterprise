import { useEffect, useState } from "react";
import {
    Clock,
    ArrowRight,
    MessageSquare,
    RefreshCcw
} from "lucide-react";

import {
    buscarHistorico
} from "../services/api";

import "./LeadTimeline.css";



export default function LeadTimeline({
    leadId
}) {


    const [historicos, setHistoricos] = useState([]);

    const [loading, setLoading] = useState(false);



    async function carregarHistorico(){


        if(!leadId){
            return;
        }


        try{

            setLoading(true);


            const dados = await buscarHistorico(
                leadId
            );


            setHistoricos(
                Array.isArray(dados)
                ? dados
                : []
            );


        }catch(error){

            console.error(
                "Erro carregando histórico:",
                error
            );


            setHistoricos([]);

        }
        finally{

            setLoading(false);

        }

    }




    useEffect(()=>{

        carregarHistorico();

    },[leadId]);






    if(loading){

        return (

            <div className="timeline-loading">

                <RefreshCcw size={18}/>

                Carregando histórico...

            </div>

        );

    }





    return (

        <div className="lead-timeline">


            <div className="timeline-header">

                <Clock size={20}/>

                Histórico Comercial


            </div>





            {
                historicos.length === 0 && (

                    <div className="timeline-empty">

                        Nenhuma movimentação registrada

                    </div>

                )
            }






            {
                historicos.map(
                    
                    item => (

                    <div

                        key={item.id}

                        className="timeline-item"

                    >


                        <div className="timeline-icon">

                            <ArrowRight size={16}/>

                        </div>



                        <div className="timeline-content">


                            <div className="timeline-status">


                                {item.status_anterior || "NOVO"}


                                <ArrowRight size={14}/>


                                {item.status_novo}


                            </div>




                            {
                                item.observacao && (

                                    <div className="timeline-note">

                                        <MessageSquare size={14}/>

                                        {item.observacao}

                                    </div>

                                )
                            }





                            <div className="timeline-date">


                                {
                                    item.data_alteracao
                                    ?
                                    new Date(
                                        item.data_alteracao
                                    )
                                    .toLocaleString(
                                        "pt-BR"
                                    )
                                    :
                                    "-"
                                }


                            </div>



                        </div>



                    </div>

                ))

            }



        </div>

    );


}