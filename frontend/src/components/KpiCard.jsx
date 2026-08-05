export default function KpiCard({
    titulo,
    valor,
    icone
}) {

    return (
        <div className="kpi-card">

            <div className="kpi-icon">
                {icone}
            </div>

            <div>
                <h4>{titulo}</h4>
                <h2>{valor}</h2>
            </div>

        </div>
    );

}