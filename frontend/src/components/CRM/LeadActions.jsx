import "./LeadActions.css";

import {
    Phone,
    MessageCircle,
    CalendarPlus,
    FileText
} from "lucide-react";





export default function LeadActions({


    lead,


    criarFollowup,


    adicionarObservacao


}) {





    function abrirWhatsApp(){

        if(!lead.telefone){

            return;

        }

        const numero = String(lead.telefone)
            .replace(/\D/g, "");

        const numeroWhatsApp = numero.startsWith("55")
            ? numero
            : `55${numero}`;

        window.open(
            `https://wa.me/${numeroWhatsApp}`,
            "_blank",
            "noopener,noreferrer"
        );

    }





        const numero = lead.telefone

            .replace(/\D/g,"");





        window.open(

            `https://wa.me/55${numero}`,

            "_blank"

        );


    }









    function ligar(){


        if(!lead.telefone){


            return;


        }



        window.open(

            `tel:${lead.telefone}`

        );


    }









    return (



        <div className="lead-actions">






            <button


                className="action-whatsapp"


                onClick={abrirWhatsApp}


            >


                <MessageCircle size={18}/>


                WhatsApp


            </button>








            <button


                className="action-phone"


                onClick={ligar}


            >


                <Phone size={18}/>


                Ligar


            </button>









            <button


                className="action-followup"


                onClick={() =>


                    criarFollowup &&

                    criarFollowup(lead)


                }


            >


                <CalendarPlus size={18}/>


                Follow-up


            </button>









            <button


                className="action-note"


                onClick={() =>


                    adicionarObservacao &&

                    adicionarObservacao(lead)


                }


            >


                <FileText size={18}/>


                ObservaÃ§Ã£o


            </button>







        </div>


    );


}

