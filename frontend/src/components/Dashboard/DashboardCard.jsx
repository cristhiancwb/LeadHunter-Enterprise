import {
    TrendingUp
} from "lucide-react";


export default function DashboardCard({

    titulo,

    valor,

    descricao,

    icon: Icon,

    tipo = "default"

}) {


    return (

        <div

            className={`dashboard-card dashboard-card-${tipo}`}

        >


            <div className="dashboard-card-header">


                <div className="dashboard-card-icon">


                    {

                    Icon ?

                    <Icon size={24}/>

                    :

                    <TrendingUp size={24}/>

                    }


                </div>


                <span>

                    {titulo}

                </span>


            </div>





            <div className="dashboard-card-value">


                {valor ?? 0}


            </div>





            {

            descricao && (


                <p>

                    {descricao}

                </p>


            )

            }



        </div>

    );

}