import { Draggable } from "@hello-pangea/dnd";

import {
    Building2,
    Mail,
    Phone,
    MapPin,
    Target,
    GripVertical,
    TrendingUp,
} from "lucide-react";

import "./LeadCard.css";

export default function LeadCard({
    lead,
    index,
    isMoving = false,
    onClick,
}) {
    if (!lead) {
        return null;
    }

    const leadId = Number(lead.id);

    if (!Number.isInteger(leadId)) {
        console.error(
            "LeadCard.jsx: Lead com ID inválido:",
            lead
        );

        return null;
    }

    const nome =
        lead.nome ||
        "Lead sem nome";

    const empresa =
        lead.empresa ||
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

    const scoreClass =
        score >= 80
            ? "high"
            : score >= 50
                ? "medium"
                : "low";

    function handleClick() {
        console.log(
            "LeadCard.jsx: Lead enviado para modal:",
            lead
        );

        if (typeof onClick === "function") {
            onClick(lead);
        }
    }

    return (
        <Draggable
            draggableId={String(leadId)}
            index={index}
        >
            {(provided, snapshot) => (
                <article
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={[
                        "lead-card",
                        snapshot.isDragging
                            ? "is-dragging"
                            : "",
                        isMoving
                            ? "is-moving"
                            : "",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    onClick={handleClick}
                    style={{
                        ...provided.draggableProps.style,
                    }}
                >
                    {/* =================================================
                        TOPO
                    ================================================= */}

                    <div className="lead-card-top">
                        <div
                            className="lead-card-drag"
                            {...provided.dragHandleProps}
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                            title="Arrastar lead"
                        >
                            <GripVertical size={17} />
                        </div>

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
                            className={`lead-card-score score-${scoreClass}`}
                            title={`Score: ${score}`}
                        >
                            <Target size={13} />

                            <strong>
                                {score}
                            </strong>
                        </div>
                    </div>

                    {/* =================================================
                        STATUS
                    ================================================= */}

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

                    {/* =================================================
                        INFORMAÇÕES
                    ================================================= */}

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
                    </div>

                    {/* =================================================
                        RODAPÉ
                    ================================================= */}

                    <div className="lead-card-footer">
                        <div
                            className={`lead-card-priority priority-${prioridadeClass}`}
                        >
                            <TrendingUp size={12} />

                            <span>
                                {prioridade}
                            </span>
                        </div>

                        <span className="lead-card-id">
                            #{leadId}
                        </span>
                    </div>
                </article>
            )}
        </Draggable>
    );
}

