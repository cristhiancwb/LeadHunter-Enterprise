function LeadTable({ leads }) {


    return (

        <div className="ranking-container">

            <h2>
                Gestão de Leads
            </h2>


            <table>

                <thead>

                    <tr>

                        <th>
                            Empresa
                        </th>

                        <th>
                            Cidade
                        </th>

                        <th>
                            Score
                        </th>

                        <th>
                            Prioridade
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Contato
                        </th>

                    </tr>

                </thead>


                <tbody>


                    {
                        leads.map(
                            (lead) => (

                                <tr key={lead.id}>


                                    <td>
                                        {lead.empresa || "-"}
                                    </td>


                                    <td>
                                        {lead.cidade || "-"}
                                    </td>


                                    <td>
                                        {lead.score}
                                    </td>


                                    <td>

                                        <span
                                            className={
                                                `badge ${
                                                    lead.prioridade?.toLowerCase()
                                                }`
                                            }
                                        >

                                            {lead.prioridade}

                                        </span>

                                    </td>


                                    <td>
                                        {lead.status}
                                    </td>


                                    <td>

                                        <a

                                            href={
                                                `https://wa.me/55${lead.telefone}`
                                            }

                                            target="_blank"

                                            rel="noreferrer"

                                        >

                                            📲 WhatsApp

                                        </a>


                                    </td>


                                </tr>

                            )

                        )
                    }


                </tbody>


            </table>


        </div>

    );

}


export default LeadTable;