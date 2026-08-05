function KanbanBoard({ leads, onStatusChange }) {


    const colunas = [

        {
            nome: "NOVO",
            titulo: "🆕 Novo"
        },

        {
            nome: "CONTATO",
            titulo: "📞 Contato"
        },

        {
            nome: "NEGOCIACAO",
            titulo: "🤝 Negociação"
        },

        {
            nome: "FECHADO",
            titulo: "✅ Fechado"
        }

    ];



    return (

        <div className="kanban">


            {
                colunas.map(
                    (coluna) => (

                        <div
                            className="kanban-column"
                            key={coluna.nome}
                        >

                            <h3>
                                {coluna.titulo}
                            </h3>



                            {
                                leads
                                .filter(
                                    lead =>
                                    lead.status === coluna.nome
                                )
                                .map(
                                    lead => (

                                        <div
                                            className="kanban-card"
                                            key={lead.id}
                                        >

                                            <strong>
                                                {
                                                    lead.empresa || 
                                                    "Sem empresa"
                                                }
                                            </strong>


                                            <p>
                                                Score: {lead.score}
                                            </p>


                                            <span
                                                className={
                                                    `badge ${
                                                        lead.prioridade?.toLowerCase()
                                                    }`
                                                }
                                            >

                                                {
                                                    lead.prioridade
                                                }

                                            </span>



                                            <select

                                                value={
                                                    lead.status
                                                }

                                                onChange={
                                                    (e) =>
                                                        onStatusChange(
                                                            lead.id,
                                                            e.target.value
                                                        )
                                                }

                                            >

                                                <option value="NOVO">
                                                    Novo
                                                </option>


                                                <option value="CONTATO">
                                                    Contato
                                                </option>


                                                <option value="NEGOCIACAO">
                                                    Negociação
                                                </option>


                                                <option value="FECHADO">
                                                    Fechado
                                                </option>


                                            </select>


                                        </div>

                                    )
                                )
                            }


                        </div>

                    )
                )
            }


        </div>

    );

}


export default KanbanBoard;