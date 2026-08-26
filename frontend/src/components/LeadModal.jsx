import {
    useEffect,
    useState
} from "react";


import {
    X,
    Save,
    Phone,
    Mail,
    MapPin,
    Building2,
    Target
} from "lucide-react";


import {
    atualizarLead,
    atualizarStatusLead,
    criarHistorico,
    buscarLead
} from "../services/api.js";


import LeadTimeline from "./LeadTimeline.jsx";

import FollowUpPanel from "./FollowUpPanel/FollowUpPanel.jsx";


import "./LeadModal.css";





function LeadModal({
    lead,
    onClose,
    atualizar
}) {



    const [dados,setDados] = useState(
        lead || {}
    );


    const [loading,setLoading] = useState(false);


    const [salvando,setSalvando] = useState(false);

    const [erro,setErro] = useState("");






    useEffect(()=>{


        if(!lead?.id){

            return;

        }


        carregarDetalhes();


    },[lead]);








    async function carregarDetalhes(){


        try{


            setLoading(true);



            const resultado =
                await buscarLead(
                    lead.id
                );



            setDados(
                resultado || lead
            );


        }
        catch(error){


            console.error(
                "Erro carregar lead:",
                error
            );


            setDados(lead);


        }
        finally{


            setLoading(false);


        }


    }









    function alterarCampo(
        campo,
        valor
    ){


        setDados({

            ...dados,

            [campo]:valor

        });


    }









    async function salvar(){



        if(!dados?.id){

            console.error(
                "Lead sem ID"
            );

            return;

        }



        try{


            setSalvando(true);
            setErro("");



            await atualizarLead(

                dados.id,

                {
                    observacao: dados.observacao || "",
                    status: dados.status || lead.status || "NOVO"
                }

            );



            await criarHistorico(

                {
                    lead_id: dados.id,
                    status_anterior: lead.status || null,
                    status_novo: dados.status || lead.status || null,
                    observacao: "Lead atualizado pelo CRM"
                }

            );



            if(atualizar){

                await atualizar();

            }



            onClose();



        }
        catch(error){


            console.error(
                "Erro salvar lead:",
                error
            );

            setErro("NÃ£o foi possÃ­vel salvar as alteraÃ§Ãµes. Tente novamente.");


        }
        finally{


            setSalvando(false);


        }


    }








    async function mudarStatus(
        novoStatus
    ){


        if(!dados?.id){

            return;

        }



        try{


            await atualizarStatusLead(

                dados.id,

                novoStatus

            );



            setDados({

                ...dados,

                status:
                novoStatus

            });



            if(atualizar){

                await atualizar();

            }


        }
        catch(error){


            console.error(
                "Erro alterar status:",
                error
            );


        }


    }









    if(!lead){

        return null;

    }








    return (



        <div className="lead-modal-overlay">



            <div className="lead-modal">

                {erro && (
                    <p className="lead-modal__error" role="alert">
                        {erro}
                    </p>
                )}





                <button

                    className="lead-modal__close"

                    onClick={onClose}

                >

                    <X size={22}/>

                </button>







                {

                    loading ?



                    (

                        <p>
                            Carregando dados...
                        </p>

                    )



                    :



                    (



                    <>






                    <header className="lead-modal__header">



                        <h2>

                            {dados.empresa || dados.nome}

                        </h2>



                        <span>

                            Score:
                            {" "}
                            {dados.score || 0}

                        </span>



                    </header>







                    <section className="lead-modal__info">





                        <p>

                            <Building2 size={16}/>

                            {dados.segmento || "-"}

                        </p>





                        <p>

                            <MapPin size={16}/>

                            {dados.cidade || "-"}

                        </p>





                        <p>

                            <Phone size={16}/>

                            {dados.telefone || "-"}

                        </p>





                        <p>

                            <Mail size={16}/>

                            {dados.email || "-"}

                        </p>





                    </section>









                    <section className="lead-modal__form">



                        <label>

                            Empresa

                            <input

                                value={
                                    dados.empresa || ""
                                }

                                onChange={
                                    e =>
                                    alterarCampo(
                                        "empresa",
                                        e.target.value
                                    )
                                }

                            />

                        </label>







                        <label>

                            ObservaÃ§Ã£o


                            <textarea

                                value={
                                    dados.observacao || ""
                                }


                                onChange={
                                    e =>
                                    alterarCampo(
                                        "observacao",
                                        e.target.value
                                    )
                                }


                            />


                        </label>




                    </section>









                    <section className="lead-modal__status">



                        <Target size={18}/>


                        <select

                            value={
                                dados.status || "NOVO"
                            }


                            onChange={
                                e =>
                                alterarCampo(
                                    "status",
                                    e.target.value
                                )
                            }

                        >


                            <option value="NOVO">
                                NOVO
                            </option>


                            <option value="CONTATO">
                                CONTATO
                            </option>


                            <option value="QUALIFICADO">
                                QUALIFICADO
                            </option>


                            <option value="PROPOSTA">
                                PROPOSTA
                            </option>


                            <option value="FECHADO">
                                FECHADO
                            </option>


                        </select>


                    </section>








                    <button

                        className="lead-modal__save"

                        onClick={salvar}

                        disabled={salvando}

                    >


                        <Save size={18}/>


                        {

                            salvando

                            ?

                            "Salvando..."

                            :

                            "Salvar"

                        }


                    </button>








                    <LeadTimeline

                        leadId={
                            dados.id
                        }

                    />







                    <FollowUpPanel

                        leadId={
                            dados.id
                        }

                    />







                    </>


                    )

                }




            </div>



        </div>


    );

}



export default LeadModal;

