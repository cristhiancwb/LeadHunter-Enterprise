import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";


function ScoreChart({ dados }) {


    return (

        <div className="chart-container">

            <h2>
                Ranking por Score
            </h2>


            <ResponsiveContainer
                width="100%"
                height={350}
            >

                <BarChart
                    data={dados}
                >

                    <CartesianGrid />

                    <XAxis
                        dataKey="empresa"
                        tick={{
                            fontSize: 12
                        }}
                    />


                    <YAxis />


                    <Tooltip />


                    <Bar
                        dataKey="score"
                    />


                </BarChart>

            </ResponsiveContainer>


        </div>

    );

}


export default ScoreChart;