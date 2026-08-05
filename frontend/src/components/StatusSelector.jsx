import {
    useState,
    useEffect
} from "react";


import {
    atualizarStatusLead
} from "../services/crmService";


export default function StatusSelector({

    lead,

    atualizar,

    onStatusChange


}) {



    const [status,setStatus] = useState(

        lead?.status || ""

    );


    const [salvando,setSalvando] = useState(false);





    useEffect(()=>{


        if(lead){

            setStatus(

                lead.status

            );

        }


    },[lead]);







    const statusDisponiveis = [

        "NOVO",

        "CONTATO"

    ];







    async function alterarStatus(){



        if(!lead)

            return;





        if(status === lead.status){


            return;


        }






        try {



            setSalvando(true);





            await atualizarStatusLead(


                lead.id,


                status


            );







            if(onStatusChange){


                onStatusChange(

                    status

                );


            }






            if(atualizar){


                atualizar();


            }







        }


        catch(error){



            console.error(

                "Erro ao atualizar status:",

                error

            );



            alert(

                "Erro ao atualizar status."

            );



            setStatus(

                lead.status

            );



        }


        finally{



            setSalvando(false);



        }



    }








    return (




        <div className="status-selector">





            <h3>

                📌 Alterar Status

            </h3>







            <select



                value={status}



                onChange={

                    e =>

                    setStatus(

                        e.target.value

                    )

                }



            >




                {

                statusDisponiveis.map(

                    item => (


                        <option


                            key={item}


                            value={item}


                        >


                            {item}


                        </option>



                    )

                )

                }





            </select>








            <button



                onClick={alterarStatus}



                disabled={salvando}



            >





                {


                salvando

                ?

                "Salvando..."

                :

                "Salvar Status"



                }





            </button>







        </div>





    );



}