export default function MetricCard({

    titulo,

    valor,

    icone,

    cor

}) {


    return (


        <div

            className="metric-card"

            style={{

                borderLeft:

                    `5px solid ${cor}`

            }}

        >


            <div className="metric-header">


                <span>

                    {icone}

                </span>


                <h3>

                    {titulo}

                </h3>


            </div>




            <strong>

                {valor}

            </strong>



        </div>


    );


}