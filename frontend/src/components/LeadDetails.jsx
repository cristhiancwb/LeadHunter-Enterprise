import LeadTimeline from "./LeadTimeline";

import StatusSelector from "./StatusSelector";



function LeadDetails({ lead, fechar, atualizar }) {


    if (!lead) {

        return null;

    }





    function abrirWhatsApp() {


        if (!lead.telefone) {

            return;

        }


        const numero = lead.telefone.replace(

            /\D/g,

            ""

        );


        window.open(

            `https://wa.me/55${numero}`,

            "_blank"

        );

    }






    return (

        <div className="lead-panel">


            <div className="lead-panel-header">


                <h2>

                    🏢 Detalhes do Lead

                </h2>



                <button

                    onClick={fechar}

                >

                    ✖

                </button>


            </div>





            <div className="lead-info">


                <h3>

                    {lead.empresa}

                </h3>



                <p>

                    📍 Cidade:

                    {" "}

                    {lead.cidade || "Não informado"}

                </p>



                <p>

                    📞 Telefone:

                    {" "}

                    {lead.telefone || "Não informado"}

                </p>




                <button

                    className="whatsapp-button"

                    onClick={abrirWhatsApp}

                >

                    💬 Abrir WhatsApp

                </button>


            </div>







            <div className="lead-metrics">


                <div>

                    ⭐ Score

                    <strong>

                        {lead.score}

                    </strong>

                </div>




                <div>

                    🔥 Prioridade

                    <strong>

                        {lead.prioridade}

                    </strong>

                </div>





                <div>

                    📌 Status

                    <strong>

                        {lead.status}

                    </strong>

                </div>


            </div>








            <StatusSelector


                lead={lead}


                atualizar={atualizar}


            />







            <LeadTimeline

                leadId={lead.id}

            />




        </div>

    );

}



export default LeadDetails;