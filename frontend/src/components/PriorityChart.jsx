import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
} from "recharts";


function PriorityChart({ dados }) {


    const data = [

        {
            name: "Alta",
            value: dados?.alta || 0
        },

        {
            name: "Média",
            value: dados?.media || 0
        },

        {
            name: "Baixa",
            value: dados?.baixa || 0
        }

    ];



    return (

        <div className="chart-container">

            <h2>
                Distribuição de Prioridade
            </h2>


            <PieChart
                width={400}
                height={300}
            >

                <Pie

                    data={data}

                    dataKey="value"

                    nameKey="name"

                    cx="50%"

                    cy="50%"

                    outerRadius={100}

                    label

                >

                    {
                        data.map(
                            (entry, index) => (

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


        </div>

    );

}


export default PriorityChart;