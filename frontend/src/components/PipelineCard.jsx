export default function PipelineCard({

    lead,

    onClick,

    atualizarStatus

}) {



    function mudarStatus(e) {


        e.stopPropagation();


        const novoStatus = e.target.value;



        if (

            atualizarStatus &&

            novoStatus !== lead.status

        ) {

            atualizarStatus(

                lead.id,

                novoStatus

            );

        }

    }






    function formatarTelefone(telefone) {


        if (!telefone) {

            return "-";

        }


        return telefone;


    }







    return (


        <div

            className="pipeline-card"

            onClick={onClick}

        >



            <div className="pipeline-card-header">


                <h4>

                    {lead.empresa || lead.nome}

                </h4>



                <span className="score">

                    {lead.score || 0}

                </span>


            </div>







            <div className="pipeline-card-info">


                <span>

                    📍 {lead.cidade || "-"}

                </span>



                <span>

                    📞 {formatarTelefone(lead.telefone)}

                </span>



                <span>

                    🏷️ {lead.segmento || "-"}

                </span>


            </div>







            <div className="pipeline-card-footer">



                <span

                    className={

                        `priority ${

                            lead.prioridade

                            ?.toLowerCase() || ""

                        }`

                    }

                >

                    {lead.prioridade || "BAIXA"}

                </span>






                <select

                    value={lead.status || "NOVO"}

                    onClick={(e) =>

                        e.stopPropagation()

                    }

                    onChange={mudarStatus}

                >


                    <option value="NOVO">

                        NOVO

                    </option>



                    <option value="CONTATO">

                        CONTATO

                    </option>



                    <option value="NEGOCIACAO">

                        NEGOCIAÇÃO

                    </option>



                    <option value="FECHADO">

                        FECHADO

                    </option>


                </select>



            </div>



        </div>


    );

}