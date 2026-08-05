function MelhorLead({ lead }) {

    if (!lead) {

        return null;

    }


    return (

        <div className="melhor-lead">

            <h2>
                🏆 Melhor Lead
            </h2>


            <p>
                <strong>
                    Empresa:
                </strong>{" "}
                {lead.empresa}
            </p>


            <p>
                <strong>
                    Score:
                </strong>{" "}
                {lead.score}
            </p>


            <p>
                <strong>
                    Prioridade:
                </strong>{" "}
                {lead.prioridade}
            </p>


            <p>
                <strong>
                    Telefone:
                </strong>{" "}
                {lead.telefone}
            </p>


        </div>

    );

}


export default MelhorLead;