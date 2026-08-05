import { useEffect, useState } from "react";

import {
    listarFollowupsLead,
    concluirFollowup,
    excluirFollowup
} from "../../../services/followupService";

import "./FollowupList.css";


export default function FollowupList({

    leadId,

    reloadKey = 0

}) {


    const [followups, setFollowups] = useState([]);

    const [loading, setLoading] = useState(true);



    async function carregar() {

        try {

            setLoading(true);


            const dados = await listarFollowupsLead(leadId);



            const ordenados = [...(dados || [])].sort(

                (a, b) => {

                    const dataA =
                        new Date(
                            a.data_agendada || 0
                        );

                    const dataB =
                        new Date(
                            b.data_agendada || 0
                        );


                    return dataA - dataB;

                }

            );


            setFollowups(ordenados);


        } catch (err) {

            console.error(
                "Erro ao carregar follow-ups:",
                err
            );


            setFollowups([]);

        } finally {

            setLoading(false);

        }

    }




    useEffect(() => {


        if (leadId) {

            carregar();

        }


    }, [leadId, reloadKey]);






    async function concluir(id) {


        try {


            await concluirFollowup(id);


            await carregar();


        } catch (err) {


            console.error(err);


            alert(
                "Erro ao concluir follow-up."
            );


        }

    }






    async function remover(id) {


        const confirmar =
            window.confirm(
                "Deseja excluir este follow-up?"
            );


        if (!confirmar) return;




        try {


            await excluirFollowup(id);


            await carregar();



        } catch (err) {


            console.error(err);


            alert(
                "Erro ao excluir follow-up."
            );


        }

    }






    function formatarData(data) {


        if (!data) return "-";


        const valor =
            new Date(data);



        if (
            Number.isNaN(
                valor.getTime()
            )
        ) {

            return "-";

        }


        return valor.toLocaleString(
            "pt-BR"
        );

    }






    if (loading) {


        return (

            <div className="followup-loading">

                Carregando follow-ups...

            </div>

        );

    }







    return (


        <div className="followup-list">


            <h3>

                Histórico de Follow-ups

            </h3>





            {
                followups.length === 0 && (

                    <div className="followup-empty">

                        Nenhum follow-up cadastrado.

                    </div>

                )
            }







            {

                followups.map(item => (


                    <div

                        className="followup-card"

                        key={item.id}

                    >





                        <div className="followup-header">


                            <strong>

                                {item.tipo}

                            </strong>



                            <span

                                className={

                                    item.concluido

                                    ? "status ok"

                                    : "status pendente"

                                }

                            >

                                {

                                    item.concluido

                                    ? "CONCLUÍDO"

                                    : "PENDENTE"

                                }


                            </span>


                        </div>








                        <h4>

                            {item.titulo}

                        </h4>






                        {

                            item.descricao && (

                                <p>

                                    {item.descricao}

                                </p>

                            )

                        }








                        <div className="followup-info">


                            <div>

                                <strong>

                                    Responsável

                                </strong>

                                <br />

                                {

                                    item.responsavel ||

                                    "-"

                                }


                            </div>





                            <div>


                                <strong>

                                    Agendado

                                </strong>

                                <br />


                                {

                                    formatarData(

                                        item.data_agendada

                                    )

                                }


                            </div>


                        </div>









                        <div className="followup-actions">



                            {

                                !item.concluido && (


                                    <button

                                        className="btn-success"

                                        onClick={() =>
                                            concluir(item.id)
                                        }

                                    >

                                        Concluir

                                    </button>


                                )

                            }







                            <button

                                className="btn-danger"

                                onClick={() =>
                                    remover(item.id)
                                }

                            >

                                Excluir

                            </button>





                        </div>





                    </div>


                ))

            }





        </div>


    );

}