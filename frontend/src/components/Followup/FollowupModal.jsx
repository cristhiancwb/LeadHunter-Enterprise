import { useState } from "react";

import followupService from "../../services/followupService";



export default function FollowupModal({

    lead,

    fechar,

    atualizado

}) {


    const [tipo, setTipo] = useState(

        "WHATSAPP"

    );


    const [dataAgendada, setDataAgendada] = useState(

        ""

    );


    const [observacao, setObservacao] = useState(

        ""

    );


    const [salvando, setSalvando] = useState(

        false

    );






    async function salvar() {


        try {


            setSalvando(true);



            await followupService.criar({

                lead_id: lead.id,

                tipo,

                data_agendada: dataAgendada,

                observacao,

                status: "PENDENTE"

            });





            atualizado();



            fechar();



        } catch(error) {



            console.error(

                "Erro ao criar follow-up:",

                error

            );



            alert(

                "Erro ao salvar follow-up"

            );



        } finally {



            setSalvando(false);



        }


    }







    return (

        <div className="modal-overlay">



            <div className="modal">



                <h2>

                    📅 Novo Follow-up

                </h2>



                <p>

                    Lead:

                    {" "}

                    <strong>

                        {lead.empresa}

                    </strong>

                </p>





                <label>

                    Tipo de contato

                </label>


                <select

                    value={tipo}

                    onChange={e =>

                        setTipo(e.target.value)

                    }

                >

                    <option value="WHATSAPP">

                        WhatsApp

                    </option>


                    <option value="LIGACAO">

                        Ligação

                    </option>


                    <option value="EMAIL">

                        Email

                    </option>


                    <option value="REUNIAO">

                        Reunião

                    </option>


                </select>







                <label>

                    Data do contato

                </label>


                <input

                    type="datetime-local"

                    value={dataAgendada}

                    onChange={e =>

                        setDataAgendada(

                            e.target.value

                        )

                    }

                />







                <label>

                    Observação

                </label>


                <textarea

                    value={observacao}

                    onChange={e =>

                        setObservacao(

                            e.target.value

                        )

                    }

                    placeholder="Ex: Enviar proposta comercial"

                />







                <div className="modal-actions">


                    <button

                        onClick={fechar}

                    >

                        Cancelar

                    </button>



                    <button

                        onClick={salvar}

                        disabled={salvando}

                    >

                        {

                            salvando

                            ?

                            "Salvando..."

                            :

                            "Salvar"

                        }

                    </button>


                </div>



            </div>


        </div>

    );

}