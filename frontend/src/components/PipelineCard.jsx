import {
    Building2,
    Mail,
    Phone,
    MapPin,
    Target,
} from "lucide-react";

export default function PipelineCard({
    lead,
    onClick,
    atualizarStatus,
}) {
    if (!lead) {
        return null;
    }

    const nome =
        lead.nome ||
        "Lead sem nome";

    const empresa =
        lead.empresa ||
        lead.nome ||
        "Empresa não informada";

    const email =
        lead.email ||
        "";

    const telefone =
        lead.telefone ||
        "";

    const cidade =
        lead.cidade ||
        "";

    const segmento =
        lead.segmento ||
        "";

    const score =
        lead.score !== null &&
        lead.score !== undefined
            ? Number(lead.score)
            : 0;

    const prioridade =
        String(
            lead.prioridade ||
            "MEDIA"
        ).toUpperCase();

    const status =
        String(
            lead.status ||
            "NOVO"
        ).toUpperCase();

    const prioridadeClass =
        prioridade.toLowerCase();

    function mudarStatus(event) {
        event.stopPropagation();

        const novoStatus =
            event.target.value;

        if (
            typeof atualizarStatus === "function" &&
            novoStatus !== status
        ) {
            atualizarStatus(
                lead.id,
                novoStatus
            );
        }
    }

    function handleClick() {
        if (typeof onClick === "function") {
            onClick();
        }
    }

    return (
        <article
            className="lead-card"
            onClick={handleClick}
        >
            <div className="lead-card-top">
                <div className="lead-card-identity">
                    <strong className="lead-card-name">
                        {nome}
                    </strong>

                    <div className="lead-card-company">
                        <Building2 size={13} />

                        <span>
                            {empresa}
                        </span>
                    </div>
                </div>

                <div
                    className="lead-card-score"
                    title={`Score: ${score}`}
                >
                    <Target size={13} />

                    <strong>
                        {score}
                    </strong>
                </div>
            </div>

            <div className="lead-card-status">
                <span
                    className={`lead-status-dot status-${status.toLowerCase()}`}
                />

                <span>
                    {status.replace(
                        /_/g,
                        " "
                    )}
                </span>
            </div>

            <div className="lead-card-info">
                {email && (
                    <div className="lead-card-info-row">
                        <Mail size={13} />

                        <span title={email}>
                            {email}
                        </span>
                    </div>
                )}

                {telefone && (
                    <div className="lead-card-info-row">
                        <Phone size={13} />

                        <span>
                            {telefone}
                        </span>
                    </div>
                )}

                {cidade && (
                    <div className="lead-card-info-row">
                        <MapPin size={13} />

                        <span>
                            {cidade}
                        </span>
                    </div>
                )}

                {segmento && (
                    <div className="lead-card-info-row">
                        <Target size={13} />

                        <span>
                            {segmento}
                        </span>
                    </div>
                )}
            </div>

            <div className="lead-card-footer">
                <span
                    className={`lead-card-priority priority-${prioridadeClass}`}
                >
                    {prioridade}
                </span>

                <select
                    value={status}
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                    onChange={mudarStatus}
                >
                    <option value="NOVO">
                        NOVO
                    </option>

                    <option value="EM_CONTATO">
                        EM CONTATO
                    </option>

                    <option value="QUALIFICADO">
                        QUALIFICADO
                    </option>

                    <option value="EM_NEGOCIACAO">
                        EM NEGOCIAÇÃO
                    </option>

                    <option value="CONVERTIDO">
                        CONVERTIDO
                    </option>

                    <option value="PERDIDO">
                        PERDIDO
                    </option>
                </select>
            </div>
        </article>
    );
}

