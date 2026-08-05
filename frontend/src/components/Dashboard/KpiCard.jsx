import {

    BarChart,

    Bar,

    XAxis,

    YAxis,

    CartesianGrid,

    Tooltip,

    ResponsiveContainer

} from "recharts";





export default function PipelineChart({

    dados = {}

}) {



    const valores = Object.entries(

        dados || {}

    ).map(([status, total]) => ({


        status,


        total



    }));







    return (



        <div className="chart-card">





            <h3>

                Funil Comercial

            </h3>







            <ResponsiveContainer

                width="100%"

                height={280}

            >



                <BarChart

                    data={valores}

                >



                    <CartesianGrid />


                    <XAxis

                        dataKey="status"

                    />


                    <YAxis />


                    <Tooltip />





                    <Bar

                        dataKey="total"

                    />





                </BarChart>



            </ResponsiveContainer>





        </div>



    );


}