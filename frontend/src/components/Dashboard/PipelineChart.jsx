import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";



export default function PipelineChart({

    dados = []

}) {


    return (


        <div className="dashboard-panel">


            <h2>

                📊 Pipeline Comercial

            </h2>




            <ResponsiveContainer

                width="100%"

                height={300}

            >


                <BarChart

                    data={dados}

                >



                    <CartesianGrid />


                    <XAxis

                        dataKey="status"

                    />


                    <YAxis />



                    <Tooltip />



                    <Bar

                        dataKey="quantidade"

                    />



                </BarChart>



            </ResponsiveContainer>




        </div>


    );

}