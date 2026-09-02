import {
    useEffect,
    useState
} from "react";


import {
    buscarFollowups
} from "../../services/api.js";


import "./FollowupPanel.css";





export default function FollowupPanel({

    abrirLead

}) {



    const [followups, setFollowups] = useState([]);



    const [loading, setLoading] = useState(true);






    async function carregarFollowups() {


        try {



            setFollowups([]);



        } catch(error) {



            console.error(

                "Erro carregando follow-ups:",

                error

            );



        } finally {



            setLoading(false);


        }


    }







    useEffect(() => {



        carregarFollowups();



    }, []);









    function classeDias(dias) {



        if (dias >= 7) {


            return "danger";


        }



        if (dias >= 3) {


            return "warning";


        }



        return "normal";


    }









    if (loading) {


        return (

            <div className="followup-panel">


                Carregando follow-ups...


            </div>

        );


    }









    return (



        <div className="followup-panel">



            <h2>

                Follow-ups Pendentes

            </h2>








            {

                followups.length === 0 && (


                    <p>

                        Nenhum follow-up pendente.

                    </p>


                )

            }









            {


                followups.map(

                    lead => (



                        <div



                            key={lead.id}



                            className={

                                `followup-card ${classeDias(

                                    lead.dias_parado

                                )}`

                            }



                            onClick={() =>

                                abrirLead(lead)

                            }



                        >





                            <h3>

                                {lead.empresa}

                            </h3>






                            <p>

                                Status:

                                <strong>

                                    {" "}

                                    {lead.status}

                                </strong>

                            </p>






                            <p>

                                Score:

                                {" "}

                                {lead.score}

                            </p>







                            <p>

                                Dias parado:

                                {" "}

                                {lead.dias_parado}

                            </p>






                            <p>

                                Prioridade:

                                {" "}

                                {lead.prioridade}

                            </p>





                        </div>



                    )

                )


            }







        </div>



    );


}
