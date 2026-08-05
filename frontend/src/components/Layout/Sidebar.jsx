import "../../styles/sidebar.css";

export default function Sidebar() {

    const itens = [

        "🏠 Dashboard",

        "🔎 Coletas",

        "👥 Leads",

        "🏢 Empresas",

        "📈 Relatórios",

        "⚙ Configurações"

    ];

    return (

        <aside className="sidebar">

            <h2>LeadHunter</h2>

            <ul>

                {itens.map(item => (

                    <li key={item}>

                        {item}

                    </li>

                ))}

            </ul>

        </aside>

    );

}