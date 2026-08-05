import "../../styles/header.css";

export default function Header() {

    return (

        <header className="header">

            <h1>LeadHunter Enterprise</h1>

            <div className="header-right">

                <input
                    type="text"
                    placeholder="Pesquisar..."
                />

                <span>🔔</span>

                <span>👤 Admin</span>

            </div>

        </header>

    );

}