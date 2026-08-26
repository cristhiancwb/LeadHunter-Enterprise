import "../../styles/header.css";

function obterUsuarioLogado() {

    try {

        const token =
            localStorage.getItem("access_token");

        if (!token) {
            return {
                email: "Usuário",
                role: ""
            };
        }

        const partes =
            token.split(".");

        if (partes.length !== 3) {
            return {
                email: "Usuário",
                role: ""
            };
        }

        const payload =
            JSON.parse(
                atob(
                    partes[1]
                        .replace(/-/g, "+")
                        .replace(/_/g, "/")
                )
            );

        return {
            email: payload.sub || "Usuário",
            role: payload.role || ""
        };

    } catch (error) {

        console.error(
            "Erro lendo usuário do token:",
            error
        );

        return {
            email: "Usuário",
            role: ""
        };
    }
}


export default function Header() {

    const usuario =
        obterUsuarioLogado();

    const nome =
        usuario.email?.split("@")[0] || "Usuário";

    const perfil =
        usuario.role === "admin"
            ? "Admin"
            : usuario.role === "cliente"
                ? "Cliente"
                : usuario.role;


    return (

        <header className="header">

            <h1>LeadHunter Enterprise</h1>

            <div className="header-right">

                <input
                    type="text"
                    placeholder="Pesquisar..."
                />

                <span>🔔</span>

                <span>
                    👤 {nome} {perfil ? `(${perfil})` : ""}
                </span>

            </div>

        </header>

    );

}
