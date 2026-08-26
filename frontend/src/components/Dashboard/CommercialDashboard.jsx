import {
    Users,
    TrendingUp,
    Award,
    Trophy,
    CheckCircle,
    DollarSign,
    Target,
    MessageCircle
} from "lucide-react";

import "./CommercialDashboard.css";

export default function CommercialDashboard({
    estatisticas = {},
    ranking = [],
    carregando = false,
    onAtualizar
}) {
    function abrirWhatsApp(lead) {

        if (!lead?.telefone) {
            return;
        }

        const numero = String(lead.telefone)
            .replace(/\D/g, "");

        if (!numero) {
            return;
        }

        const numeroWhatsApp = numero.startsWith("55")
            ? numero
            : `55${numero}`;

        window.open(
            `https://wa.me/${numeroWhatsApp}`,
            "_blank",
            "noopener,noreferrer"
        );
    }

    if (carregando) {
        return (
            <div className="dashboard-loading">
                Carregando indicadores...
            </div>
        );
    }

    const dados =
        estatisticas &&
        typeof estatisticas === "object"
            ? estatisticas
            : {};

    const leads = Array.isArray(dados.leads)
        ? dados.leads
        : [];

    /*
     * ==========================================================
     * NORMALIZAÇÃO DO PIPELINE
     * ==========================================================
     */

    const status = obterPipeline(dados);

    const pipelineData = Object.entries(status)
        .map(([nome, valor]) => ({
            nome: formatarStatus(nome),
            valor: Number(valor) || 0,
            statusOriginal: String(nome).toUpperCase()
        }))
        .filter(item => item.valor > 0);

    const totalStatus = calcularTotalStatus(status);

    /*
     * ==========================================================
     * TOTAL DE LEADS
     * ==========================================================
     */

    const totalLeads =
        obterNumero(
            dados.total_leads,
            dados.totalLeads,
            dados.total,
            dados.total_leads_count
        ) ??
        (leads.length > 0
            ? leads.length
            : totalStatus);

    /*
     * ==========================================================
     * LEADS FECHADOS
     * ==========================================================
     */

    const leadsConvertidos = obterStatus(
        status,
        [
            "CONVERTIDO",
            "CONVERTIDOS",
            "FECHADO",
            "FECHADOS"
        ]
    );

    /*
     * ==========================================================
     * TAXA DE CONVERSÃO
     * ==========================================================
     */

    const taxaBackend = obterNumero(
        dados.taxa_conversao,
        dados.taxaConversao,
        dados.conversao
    );

    const taxaConversao =
        taxaBackend !== null && taxaBackend > 0
            ? taxaBackend.toFixed(1)
            : totalLeads > 0
                ? (
                    (leadsConvertidos / totalLeads) *
                    100
                ).toFixed(1)
                : "0.0";

    /*
     * ==========================================================
     * VALOR DO PIPELINE
     * ==========================================================
     */

    const valorPipeline =
        obterNumero(
            dados.valor_pipeline,
            dados.valorPipeline,
            dados.valor_negocio,
            dados.valorNegocio
        ) ??
        calcularValorPipeline(leads);

    /*
     * ==========================================================
     * MELHOR LEAD
     * ==========================================================
     */

    const melhorLead =
        Array.isArray(ranking) &&
        ranking.length > 0
            ? ranking[0]
            : null;

    /*
     * ==========================================================
     * GRÁFICO DE PIZZA
     * ==========================================================
     */

    const setoresPizza =
        pipelineData.length > 0
            ? criarSetoresPizza(pipelineData)
            : [];

    /*
     * ==========================================================
     * CARDS
     * ==========================================================
     */

    const cards = [
        {
            titulo: "Total de Leads",
            valor: totalLeads,
            icon: <Users size={28} />
        },
        {
            titulo: "Valor em Pipeline",
            valor: formatarMoeda(valorPipeline),
            icon: <DollarSign size={28} />
        },
        {
            titulo: "Taxa de Conversão",
            valor: `${taxaConversao}%`,
            icon: <TrendingUp size={28} />
        },
        {
            titulo: "Leads Fechados",
            valor: leadsConvertidos,
            icon: <CheckCircle size={28} />
        }
    ];

    return (
        <div className="commercial-dashboard">

            {/* ==================================================
               CABEÇALHO
               ================================================== */}

            <div className="dashboard-header">

                <div>
                    <h2>📊 Dashboard</h2>

                    <p>
                        Visão geral do seu pipeline de vendas
                    </p>
                </div>

                {onAtualizar && (
                    <button
                        type="button"
                        onClick={onAtualizar}
                        className="dashboard-refresh"
                    >
                        Atualizar
                    </button>
                )}

            </div>

            {/* ==================================================
               CARDS
               ================================================== */}

            <div className="dashboard-cards">

                {cards.map((card, index) => (
                    <div
                        className="dashboard-card"
                        key={index}
                    >
                        <div className="card-icon">
                            {card.icon}
                        </div>

                        <div>
                            <span>{card.titulo}</span>
                            <strong>{card.valor}</strong>
                        </div>
                    </div>
                ))}

            </div>

            {/* ==================================================
               GRÁFICOS
               ================================================== */}

            <div className="dashboard-charts">

                {/* ==================================================
                   BARRAS
                   ================================================== */}

                <div
                    className="chart-box"
                    style={{ minHeight: "340px" }}
                >

                    <h3>
                        <Target size={20} />
                        Distribuição por Status
                    </h3>

                    {pipelineData.length === 0 ? (
                        <div className="dashboard-empty">
                            Nenhum lead encontrado.
                        </div>
                    ) : (
                        <GraficoBarras
                            data={pipelineData}
                        />
                    )}

                </div>

                {/* ==================================================
                   PIZZA
                   ================================================== */}

                <div
                    className="chart-box"
                    style={{ minHeight: "340px" }}
                >

                    <h3>
                        Distribuição do Pipeline
                    </h3>

                    {pipelineData.length === 0 ? (
                        <div className="dashboard-empty">
                            Nenhum dado disponível.
                        </div>
                    ) : (
                        <div
                            style={{
                                width: "100%",
                                minHeight: "280px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "24px",
                                flexWrap: "wrap"
                            }}
                        >

                            <svg
                                width="240"
                                height="240"
                                viewBox="0 0 280 280"
                                role="img"
                                aria-label="Distribuição do pipeline"
                            >

                                {setoresPizza.map(
                                    (setor, index) => (
                                        <path
                                            key={index}
                                            d={setor.path}
                                            fill={setor.cor}
                                            stroke="#ffffff"
                                            strokeWidth="2"
                                        />
                                    )
                                )}

                                <circle
                                    cx="140"
                                    cy="140"
                                    r="45"
                                    fill="#ffffff"
                                />

                                <text
                                    x="140"
                                    y="136"
                                    textAnchor="middle"
                                    fill="#0f172a"
                                    fontSize="25"
                                    fontWeight="700"
                                >
                                    {totalLeads}
                                </text>

                                <text
                                    x="140"
                                    y="156"
                                    textAnchor="middle"
                                    fill="#64748b"
                                    fontSize="12"
                                >
                                    Leads
                                </text>

                            </svg>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "10px",
                                    minWidth: "160px",
                                    maxWidth: "230px"
                                }}
                            >

                                {pipelineData.map(
                                    (item, index) => {

                                        const setor =
                                            setoresPizza[index];

                                        const percentual =
                                            totalStatus > 0
                                                ? (
                                                    item.valor /
                                                    totalStatus *
                                                    100
                                                ).toFixed(1)
                                                : "0.0";

                                        return (
                                            <div
                                                key={item.statusOriginal}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "7px",
                                                    fontSize: "12px"
                                                }}
                                            >

                                                <span
                                                    style={{
                                                        width: "10px",
                                                        height: "10px",
                                                        minWidth: "10px",
                                                        borderRadius: "3px",
                                                        background:
                                                            setor.cor
                                                    }}
                                                />

                                                <span
                                                    style={{
                                                        color: "#475569",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap"
                                                    }}
                                                >
                                                    {item.nome}
                                                </span>

                                                <strong
                                                    style={{
                                                        color: "#0f172a",
                                                        marginLeft: "auto"
                                                    }}
                                                >
                                                    {item.valor}
                                                </strong>

                                                <small
                                                    style={{
                                                        color: "#94a3b8",
                                                        whiteSpace: "nowrap"
                                                    }}
                                                >
                                                    ({percentual}%)
                                                </small>

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        </div>
                    )}

                </div>

            </div>

            {/* ==================================================
               RESUMO DO PIPELINE
               ================================================== */}

            <div className="status-summary">

                <h3>
                    📈 Resumo do Pipeline
                </h3>

                <div className="status-summary-grid">

                    {pipelineData.length === 0 ? (
                        <div className="dashboard-empty">
                            Nenhum status disponível.
                        </div>
                    ) : (
                        pipelineData.map(item => (

                            <div
                                className="status-summary-card"
                                key={item.statusOriginal}
                            >

                                <span>
                                    {item.nome}
                                </span>

                                <strong>
                                    {item.valor}
                                </strong>

                                <small>
                                    {totalStatus > 0
                                        ? `${(
                                            item.valor /
                                            totalStatus *
                                            100
                                        ).toFixed(0)}%`
                                        : "0%"
                                    }
                                </small>

                            </div>

                        ))
                    )}

                </div>

            </div>

            {/* ==================================================
               RANKING
               ================================================== */}

            <div className="ranking-box">

                <h3>
                    <Trophy size={22} />
                    Ranking de Leads
                </h3>

                {!Array.isArray(ranking) ||
                ranking.length === 0 ? (

                    <p>
                        Nenhum lead no ranking.
                    </p>

                ) : (

                    <table>

                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Empresa</th>
                                <th>Cidade</th>
                                <th>Score</th>
                                <th>Prioridade</th>
                                <th>Status</th>
                                <th>WhatsApp</th>
                            </tr>
                        </thead>

                        <tbody>

                            {ranking.map(
                                (lead, index) => (

                                    <tr
                                        key={
                                            lead?.id ??
                                            `lead-${index}`
                                        }
                                    >

                                        <td>
                                            {
                                                lead?.posicao ??
                                                index + 1
                                            }
                                        </td>

                                        <td>
                                            {
                                                lead?.empresa ||
                                                lead?.nome ||
                                                "-"
                                            }
                                        </td>

                                        <td>
                                            {
                                                lead?.cidade ||
                                                "-"
                                            }
                                        </td>

                                        <td>
                                            {
                                                lead?.score ??
                                                0
                                            }
                                        </td>

                                        <td>
                                            {
                                                lead?.prioridade ||
                                                "-"
                                            }
                                        </td>

                                        <td>
                                            {formatarStatus(
                                                lead?.status
                                            )}
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className="ranking-whatsapp-button"
                                                onClick={() =>
                                                    abrirWhatsApp(lead)
                                                }
                                                disabled={!lead?.telefone}
                                                title={
                                                    lead?.telefone
                                                        ? "Contactar lead pelo WhatsApp"
                                                        : "Lead sem telefone"
                                                }
                                            >
                                                <MessageCircle size={17} />
                                                WhatsApp
                                            </button>
                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                )}

            </div>

            {/* ==================================================
               MELHOR LEAD
               ================================================== */}

            {melhorLead && (

                <div className="best-lead">

                    <Award size={22} />

                    <div>

                        <strong>
                            Melhor Lead:
                        </strong>

                        <span>

                            {
                                melhorLead.empresa ||
                                melhorLead.nome ||
                                "-"
                            }

                            {" | Score "}

                            {
                                melhorLead.score ??
                                0
                            }

                        </span>

                    </div>

                </div>

            )}

        </div>
    );
}


/* ============================================================
   PIPELINE
   ============================================================ */

function obterPipeline(dados) {

    const origem =
        dados?.pipeline &&
        typeof dados.pipeline === "object" &&
        !Array.isArray(dados.pipeline)
            ? dados.pipeline
            : dados?.status &&
              typeof dados.status === "object" &&
              !Array.isArray(dados.status)
                ? dados.status
                : {};

    const normalizado = {};

    Object.entries(origem).forEach(
        ([chave, valor]) => {

            const status =
                String(chave)
                    .trim()
                    .toUpperCase()
                    .replaceAll(" ", "_")
                    .replaceAll("-", "_");

            const numero = Number(valor);

            if (!Number.isFinite(numero)) {
                return;
            }

            normalizado[status] =
                (normalizado[status] || 0) +
                numero;
        }
    );

    return normalizado;
}


/* ============================================================
   NÚMERO
   ============================================================ */

function obterNumero(...valores) {

    for (const valor of valores) {

        if (
            valor !== undefined &&
            valor !== null &&
            valor !== ""
        ) {

            const numero = Number(valor);

            if (Number.isFinite(numero)) {
                return numero;
            }
        }
    }

    return null;
}


/* ============================================================
   TOTAL STATUS
   ============================================================ */

function calcularTotalStatus(status) {

    return Object.values(status || {}).reduce(
        (total, valor) => {

            const numero = Number(valor);

            return total +
                (
                    Number.isFinite(numero)
                        ? numero
                        : 0
                );

        },
        0
    );
}


/* ============================================================
   STATUS ESPECÍFICO
   ============================================================ */

function obterStatus(status, nomes) {

    const normalizado = {};

    Object.entries(status || {}).forEach(
        ([chave, valor]) => {

            normalizado[
                String(chave).toUpperCase()
            ] = Number(valor) || 0;

        }
    );

    return nomes.reduce(
        (total, nome) => {

            const chave =
                String(nome).toUpperCase();

            return total +
                (
                    Number.isFinite(
                        normalizado[chave]
                    )
                        ? normalizado[chave]
                        : 0
                );

        },
        0
    );
}


/* ============================================================
   VALOR PIPELINE
   ============================================================ */

function calcularValorPipeline(leads) {

    return leads.reduce(
        (total, lead) => {

            const valor = obterNumero(
                lead?.valor,
                lead?.valor_pipeline,
                lead?.valor_negocio
            );

            return total +
                (
                    valor !== null
                        ? valor
                        : 0
                );

        },
        0
    );
}


/* ============================================================
   STATUS
   ============================================================ */

function formatarStatus(status) {

    if (!status) {
        return "Novo";
    }

    const chave =
        String(status)
            .trim()
            .toUpperCase()
            .replaceAll(" ", "_")
            .replaceAll("-", "_");

    const mapa = {

        NOVO: "Novo",

        EM_CONTATO: "Em Contato",

        CONTATO: "Em Contato",

        QUALIFICADO: "Qualificado",

        EM_NEGOCIACAO: "Em Negociação",

        NEGOCIACAO: "Negociação",

        CONVERTIDO: "Convertido",

        CONVERTIDOS: "Convertidos",

        FECHADO: "Fechado",

        FECHADOS: "Fechados",

        PERDIDO: "Perdido",

        PERDIDOS: "Perdidos"

    };

    return (
        mapa[chave] ||
        String(status)
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(
                /\b\w/g,
                letra => letra.toUpperCase()
            )
    );
}


/* ============================================================
   MOEDA
   ============================================================ */

function formatarMoeda(valor) {

    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


/* ============================================================
   GRÁFICO DE BARRAS SVG
   ============================================================ */

function GraficoBarras({ data }) {

    const larguraSvg = 700;
    const alturaSvg = 280;

    const margemEsquerda = 60;
    const margemDireita = 20;
    const margemTopo = 20;
    const margemInferior = 50;

    const larguraUtil =
        larguraSvg -
        margemEsquerda -
        margemDireita;

    const alturaUtil =
        alturaSvg -
        margemTopo -
        margemInferior;

    const maior =
        Math.max(
            ...data.map(item => item.valor),
            1
        );

    const passo =
        Math.max(
            Math.ceil(maior / 4),
            1
        );

    const escalaMax =
        Math.max(
            passo * 4,
            4
        );

    const quantidade = data.length;

    const larguraBarra =
        quantidade === 1
            ? Math.min(
                100,
                larguraUtil * 0.35
            )
            : Math.min(
                100,
                larguraUtil /
                Math.max(
                    quantidade * 1.5,
                    1
                )
            );

    const espacamento =
        quantidade > 1
            ? (
                larguraUtil -
                larguraBarra
            ) /
            (quantidade - 1)
            : 0;

    return (
        <div
            style={{
                width: "100%",
                height: "280px",
                overflow: "hidden"
            }}
        >

            <svg
                width="100%"
                height="280"
                viewBox={`0 0 ${larguraSvg} ${alturaSvg}`}
                preserveAspectRatio="none"
                role="img"
                aria-label="Distribuição de leads por status"
            >

                {/* GRID */}

                {[0, 1, 2, 3, 4].map(
                    nivel => {

                        const valor =
                            escalaMax -
                            nivel * passo;

                        const y =
                            margemTopo +
                            (nivel / 4) *
                            alturaUtil;

                        return (
                            <g key={`grid-${nivel}`}>

                                <line
                                    x1={margemEsquerda}
                                    y1={y}
                                    x2={
                                        larguraSvg -
                                        margemDireita
                                    }
                                    y2={y}
                                    stroke="#e2e8f0"
                                    strokeWidth="1"
                                />

                                <text
                                    x="12"
                                    y={y + 4}
                                    fill="#64748b"
                                    fontSize="12"
                                >
                                    {Math.max(0, valor)}
                                </text>

                            </g>
                        );
                    }
                )}

                {/* BARRAS */}

                {data.map(
                    (item, index) => {

                        const x =
                            quantidade === 1
                                ? margemEsquerda +
                                  (
                                      larguraUtil -
                                      larguraBarra
                                  ) / 2
                                : margemEsquerda +
                                  index *
                                  espacamento;

                        const altura =
                            (
                                item.valor /
                                escalaMax
                            ) *
                            alturaUtil;

                        const alturaFinal =
                            Math.max(altura, 3);

                        const y =
                            margemTopo +
                            alturaUtil -
                            alturaFinal;

                        return (
                            <g
                                key={item.statusOriginal}
                            >

                                <rect
                                    x={x}
                                    y={y}
                                    width={larguraBarra}
                                    height={alturaFinal}
                                    rx="7"
                                    fill="#2563eb"
                                />

                                <text
                                    x={
                                        x +
                                        larguraBarra / 2
                                    }
                                    y={Math.max(
                                        15,
                                        y - 8
                                    )}
                                    textAnchor="middle"
                                    fill="#0f172a"
                                    fontSize="13"
                                    fontWeight="700"
                                >
                                    {item.valor}
                                </text>

                                <text
                                    x={
                                        x +
                                        larguraBarra / 2
                                    }
                                    y={
                                        alturaSvg -
                                        18
                                    }
                                    textAnchor="middle"
                                    fill="#64748b"
                                    fontSize="12"
                                >
                                    {item.nome}
                                </text>

                            </g>
                        );
                    }
                )}

            </svg>

        </div>
    );
}


/* ============================================================
   PIZZA SVG
   ============================================================ */

function criarSetoresPizza(data) {

    const cores = [
        "#2563eb",
        "#7c3aed",
        "#f59e0b",
        "#10b981",
        "#ef4444",
        "#64748b"
    ];

    const total = data.reduce(
        (sum, item) =>
            sum + Number(item.valor || 0),
        0
    );

    if (total <= 0) {
        return [];
    }

    let anguloAtual = -Math.PI / 2;

    return data.map(
        (item, index) => {

            const valor =
                Number(item.valor || 0);

            const angulo =
                (valor / total) *
                Math.PI *
                2;

            const anguloFinal =
                anguloAtual +
                angulo;

            const x1 =
                140 +
                100 *
                Math.cos(anguloAtual);

            const y1 =
                140 +
                100 *
                Math.sin(anguloAtual);

            const x2 =
                140 +
                100 *
                Math.cos(anguloFinal);

            const y2 =
                140 +
                100 *
                Math.sin(anguloFinal);

            const grandeArco =
                angulo > Math.PI
                    ? 1
                    : 0;

            const path = [
                "M",
                140,
                140,
                "L",
                x1,
                y1,
                "A",
                100,
                100,
                0,
                grandeArco,
                1,
                x2,
                y2,
                "Z"
            ].join(" ");

            anguloAtual = anguloFinal;

            return {
                path,
                cor:
                    cores[
                        index %
                        cores.length
                    ]
            };
        }
    );
}





