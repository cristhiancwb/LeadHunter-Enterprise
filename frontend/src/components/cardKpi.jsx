function CardKPI({ titulo, valor }) {

    return (

        <div className="card-kpi">

            <h3>
                {titulo}
            </h3>

            <strong>
                {valor}
            </strong>

        </div>

    );

}


export default CardKPI;