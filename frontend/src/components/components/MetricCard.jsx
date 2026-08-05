import "./MetricCard.css";


export default function MetricCard({

    title,

    value,

    icon,

    highlight = false

}) {


    return (

        <div

            className={

                `metric-card ${highlight ? "highlight" : ""}`

            }

        >


            <div className="metric-icon">

                {icon}

            </div>



            <h3>

                {title}

            </h3>



            <div className="metric-value">

                {value}

            </div>



        </div>

    );

}