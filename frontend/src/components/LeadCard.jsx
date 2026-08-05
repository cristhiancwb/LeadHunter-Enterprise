import {
    MapPin,
    Phone,
    Target,
    Building2
} from "lucide-react";


import "./LeadCard.css";





function LeadCard({
    lead,
    onClick
}) {



    if(!lead){

        return null;

    }






    function selecionarLead(){


        console.log(
            "Lead enviado para modal:",
            lead
        );


        if(onClick){

            onClick(lead);

        }


    }







    return (



        <div

            className="crm-lead-card"

            onClick={selecionarLead}

        >





            <div className="crm-lead-card__title">


                <Building2 size={16}/>


                <strong>

                    {
                        lead.empresa ||
                        lead.nome ||
                        "Sem empresa"
                    }

                </strong>


            </div>







            <div className="crm-lead-card__info">


                <span>

                    <MapPin size={14}/>

                    {
                        lead.cidade ||
                        "-"
                    }

                </span>





                <span>

                    <Phone size={14}/>

                    {
                        lead.telefone ||
                        "-"
                    }

                </span>



            </div>








            <div className="crm-lead-card__footer">



                <span>

                    Score:

                    {" "}

                    {
                        lead.score ?? 0
                    }

                </span>





                <span>

                    <Target size={14}/>

                    {
                        lead.prioridade ||
                        "SEM"
                    }

                </span>



            </div>





        </div>


    );

}




export default LeadCard;
