import { useState } from "react";

import {
    Phone,
    Mail,
    MapPin,
    Building2,
    User,
    X,
    MessageCircle,
    Flame,
    Target
} from "lucide-react";


import FollowupForm from "../modules/crm/components/FollowupForm";

import FollowupList from "../modules/crm/components/FollowupList";


import "./LeadDetailsModal.css";



export default function LeadDetailsModal({

    lead,

    onClose

}) {


    const [aba,setAba] = useState("dados");


    const [reloadKey,setReloadKey] = useState(0);



    if(!lead) return null;




    function abrirWhatsApp(){


        if(!lead.telefone) return;


        const numero = lead.telefone.replace(
            /\D/g,
            ""
        );


        window.open(

            `https://wa.me/55${numero}`,

            "_blank"

        );


    }





    function atualizarFollowups(){


        setReloadKey(

            valor => valor + 1

        );


    }





    function nivelScore(){


        const score = Number(
            lead.score || 0
        );


        if(score >= 80)

            return {

                texto:"Lead Quente",

                classe:"quente"

            };


        if(score >=50)

            return {

                texto:"Lead Médio",

                classe:"medio"

            };


        return {

            texto:"Lead Frio",

            classe:"frio"

        };


    }





    const classificacao = nivelScore();





    return (

        <div className="modal-overlay">


            <div className="lead-modal enterprise">



                <header className="modal-header">


                    <div>


                        <h2>

                            {lead.empresa}

                        </h2>


                        <span>

                            ID #{lead.id}

                        </span>


                    </div>



                    <button

                        onClick={onClose}

                    >

                        <X size={22}/>

                    </button>



                </header>





                <div className="lead-tabs">


                    <button

                        className={

                            aba==="dados"

                            ?

                            "active"

                            :

                            ""

                        }

                        onClick={()=>setAba("dados")}

                    >

                        Dados

                    </button>




                    <button

                        className={

                            aba==="score"

                            ?

                            "active"

                            :

                            ""

                        }

                        onClick={()=>setAba("score")}

                    >

                        Score

                    </button>





                    <button

                        className={

                            aba==="followups"

                            ?

                            "active"

                            :

                            ""

                        }

                        onClick={()=>setAba("followups")}

                    >

                        Follow-ups

                    </button>



                </div>







                {

                    aba==="dados" && (



                        <div className="lead-grid">



                            <Info

                                icon={<Building2/>}

                                titulo="Empresa"

                                valor={lead.empresa}

                            />



                            <Info

                                icon={<MapPin/>}

                                titulo="Cidade"

                                valor={lead.cidade}

                            />



                            <Info

                                icon={<Target/>}

                                titulo="Segmento"

                                valor={lead.segmento}

                            />




                            <Info

                                icon={<Phone/>}

                                titulo="Telefone"

                                valor={lead.telefone}

                            />




                            <Info

                                icon={<Mail/>}

                                titulo="Email"

                                valor={lead.email}

                            />




                            <Info

                                icon={<User/>}

                                titulo="Responsável"

                                valor={lead.responsavel}

                            />



                        </div>


                    )


                }









                {

                    aba==="score" && (



                        <div className="score-area">



                            <div className="score-circle">


                                {lead.score || 0}



                            </div>





                            <div>


                                <h3>


                                    <Flame size={20}/>

                                    {classificacao.texto}


                                </h3>



                                <p>

                                    Prioridade:

                                    <strong>

                                        {" "}

                                        {lead.prioridade || "BAIXA"}

                                    </strong>

                                </p>



                            </div>



                        </div>


                    )

                }









                {

                    aba==="followups" && (



                        <div>


                            <FollowupList

                                leadId={lead.id}

                                reloadKey={reloadKey}

                            />



                            <FollowupForm

                                leadId={lead.id}

                                onCreated={atualizarFollowups}

                            />


                        </div>


                    )

                }








                <footer className="modal-actions">


                    <button

                        className="whatsapp-btn"

                        onClick={abrirWhatsApp}

                    >

                        <MessageCircle size={18}/>

                        WhatsApp

                    </button>





                    <button

                        className="close-btn"

                        onClick={onClose}

                    >

                        Fechar

                    </button>



                </footer>




            </div>


        </div>

    );

}







function Info({

    icon,

    titulo,

    valor

}){


    return (

        <div className="lead-info-box">


            <div>

                {icon}

            </div>


            <section>

                <small>

                    {titulo}

                </small>


                <strong>

                    {valor || "-"}

                </strong>


            </section>


        </div>

    );

}