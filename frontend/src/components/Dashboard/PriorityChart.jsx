import {

    PieChart,

    Pie,

    Cell,

    Tooltip,

    Legend,

    ResponsiveContainer

} from "recharts";





export default function PriorityChart({

    dados = {}

}) {



    const valores = Object.entries(

        dados || {}

    ).map(([nome, valor]) => ({


        nome,


        valor



    }));







    return (



        <div className="chart-card">





            <h3>

                Prioridade dos Leads

            </h3>







            <ResponsiveContainer

                width="100%"

                height={280}

            >



                <PieChart>





                    <Pie

                        data={valores}

                        dataKey="valor"

                        nameKey="nome"

                        cx="50%"

                        cy="50%"

                        outerRadius={90}

                        label

                    >



                        {

                            valores.map(

                                (item, index) => (



                                    <Cell

                                        key={index}

                                    />



                                )

                            )

                        }



                    </Pie>







                    <Tooltip />



                    <Legend />







                </PieChart>



            </ResponsiveContainer>







        </div>



    );


}