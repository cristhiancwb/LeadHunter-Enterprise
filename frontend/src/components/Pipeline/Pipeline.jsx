import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    DragDropContext,
} from "@hello-pangea/dnd";

import {
    Search,
    X,
    RefreshCw,
} from "lucide-react";

import PipelineColumn from "./PipelineColumn.jsx";

import {
    buscarPipeline,
    atualizarStatusLead,
} from "../../services/api.js";

import "./Pipeline.css";

// ========================================================
// CONFIGURAÃƒâ€¡ÃƒÆ’O DO PIPELINE
// ========================================================

const PIPELINE_STATUSES = [
    {
        id: "NOVO",
        label: "Novo",
    },
    {
        id: "EM_CONTATO",
        label: "Em contato",
    },
    {
        id: "QUALIFICADO",
        label: "Qualificado",
    },
    {
        id: "EM_NEGOCIACAO",
        label: "Em negociaÃƒÂ§ÃƒÂ£o",
    },
    {
        id: "CONVERTIDO",
        label: "Convertido",
    },
    {
        id: "FECHADO",
        label: "Fechado",
    },
    {
        id: "PERDIDO",
        label: "Perdido",
    },
];

// ========================================================
// NORMALIZAÃƒâ€¡ÃƒÆ’O
// ========================================================

function normalizarStatus(status) {
    if (!status) {
        return "NOVO";
    }

    return String(status)
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "_");
}

function normalizarLead(lead) {
    return {
        ...lead,

        id: Number(lead.id),

        status: normalizarStatus(
            lead.status
        ),

        nome:
            lead.nome ||
            "Sem nome",

        empresa:
            lead.empresa ||
            lead.nome ||
            "Empresa nÃƒÂ£o informada",

        email:
            lead.email ||
            "",

        telefone:
            lead.telefone ||
            "",

        cidade:
            lead.cidade ||
            "",

        segmento:
            lead.segmento ||
            "",

        score:
            lead.score !== null &&
            lead.score !== undefined
                ? Number(lead.score)
                : 0,

        prioridade:
            lead.prioridade ||
            "MEDIA",
    };
}

// ========================================================
// ORGANIZAÃƒâ€¡ÃƒÆ’O DAS COLUNAS
// ========================================================

function organizarLeads(leads) {
    const resultado = {};

    PIPELINE_STATUSES.forEach(
        (status) => {
            resultado[status.id] = [];
        }
    );

    leads.forEach((lead) => {
        const status =
            normalizarStatus(
                lead.status
            );

        if (!resultado[status]) {
            resultado[status] = [];
        }

        resultado[status].push(lead);
    });

    return resultado;
}

// ========================================================
// TEXTO PARA PESQUISA
// ========================================================

function textoPesquisa(lead) {
    return [
        lead?.nome,
        lead?.empresa,
        lead?.email,
        lead?.telefone,
        lead?.cidade,
        lead?.segmento,
        lead?.status,
        lead?.prioridade,
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
}

// ========================================================
// COMPONENTE
// ========================================================

export default function Pipeline({
    abrirLead,
    onLeadClick,
    atualizar,
    refreshToken = 0,
}) {
    const [
        leads,
        setLeads,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState(null);

    const [
        movingLeadId,
        setMovingLeadId,
    ] = useState(null);

    const [
        busca,
        setBusca,
    ] = useState("");

    const carregandoRef =
        useRef(false);

    const ultimoRefreshRef =
        useRef(null);

    // ====================================================
    // CARREGAR PIPELINE
    // ====================================================

    const carregarPipeline =
        useCallback(
            async ({
                silencioso = false,
            } = {}) => {

                if (
                    carregandoRef.current
                ) {
                    console.log(
                        "Pipeline.jsx: Carregamento jÃƒÂ¡ em andamento."
                    );

                    return;
                }

                carregandoRef.current =
                    true;

                try {
                    if (!silencioso) {
                        setLoading(true);
                    }

                    setError(null);

                    console.log(
                        "Pipeline.jsx: Carregando Pipeline..."
                    );

                    const response =
                        await buscarPipeline();

                    console.log(
                        "Pipeline.jsx: Pipeline recebido:",
                        response
                    );

                    const items =
                        Array.isArray(response)
                            ? response
                            : Array.isArray(response?.items)
                                ? response.items
                                : response &&
                                  typeof response === "object"
                                    ? Object.entries(response).flatMap(
                                        ([status, lista]) =>
                                            Array.isArray(lista)
                                                ? lista.map((lead) => ({
                                                    ...lead,
                                                    status:
                                                        lead?.status ||
                                                        status,
                                                }))
                                                : []
                                    )
                                    : [];

                    const leadsNormalizados =
                        items
                            .filter(
                                (lead) =>
                                    lead &&
                                    lead.id !==
                                        undefined &&
                                    lead.id !==
                                        null
                            )
                            .map(
                                normalizarLead
                            );

                    setLeads(
                        leadsNormalizados
                    );

                } catch (err) {
                    console.error(
                        "Pipeline.jsx: Erro ao carregar Pipeline:",
                        err
                    );

                    setError(
                        err?.message ||
                        "NÃƒÂ£o foi possÃƒÂ­vel carregar o Pipeline."
                    );

                } finally {
                    carregandoRef.current =
                        false;

                    if (!silencioso) {
                        setLoading(false);
                    }
                }
            },
            []
        );

    // ====================================================
    // REFRESH
    // ====================================================

    useEffect(() => {
        if (
            ultimoRefreshRef.current ===
            refreshToken
        ) {
            return;
        }

        ultimoRefreshRef.current =
            refreshToken;

        carregarPipeline();

    }, [
        refreshToken,
        carregarPipeline,
    ]);

    // ====================================================
    // FILTRO DE PESQUISA
    // ====================================================

    const leadsFiltrados =
        useMemo(() => {

            const termo =
                busca
                    .trim()
                    .toLowerCase();

            if (!termo) {
                return leads;
            }

            return leads.filter(
                (lead) =>
                    textoPesquisa(
                        lead
                    ).includes(
                        termo
                    )
            );

        }, [
            leads,
            busca,
        ]);

    // ====================================================
    // ORGANIZAÃƒâ€¡ÃƒÆ’O DAS COLUNAS
    // ====================================================

    const columns =
        useMemo(
            () =>
                organizarLeads(
                    leadsFiltrados
                ),
            [leadsFiltrados]
        );

    // ====================================================
    // ABRIR LEAD
    // ====================================================

    const handleLeadClick =
        useCallback(
            (lead) => {

                if (!lead?.id) {
                    console.error(
                        "Pipeline.jsx: Lead invÃƒÂ¡lido:",
                        lead
                    );

                    return;
                }

                console.log(
                    "Pipeline.jsx: Lead selecionado:",
                    lead
                );

                /*
                 * Compatibilidade com as duas APIs:
                 *
                 * onLeadClick = usado pelo CrmDashboard atual
                 * abrirLead   = usado por versÃƒÂµes anteriores
                 */

                if (
                    typeof onLeadClick ===
                    "function"
                ) {
                    onLeadClick(lead);

                    return;
                }

                if (
                    typeof abrirLead ===
                    "function"
                ) {
                    abrirLead(lead);
                }
            },
            [
                abrirLead,
                onLeadClick,
            ]
        );

    // ====================================================
    // DRAG & DROP
    // ====================================================

    const handleDragEnd =
        useCallback(
            async (result) => {

                const {
                    destination,
                    source,
                    draggableId,
                } = result;

                if (!destination) {
                    return;
                }

                if (
                    destination.droppableId ===
                    source.droppableId
                ) {
                    return;
                }

                const leadId =
                    Number(
                        draggableId
                    );

                if (
                    !Number.isInteger(
                        leadId
                    )
                ) {
                    console.error(
                        "Pipeline.jsx: draggableId invÃƒÂ¡lido:",
                        draggableId
                    );

                    return;
                }

                const lead =
                    leads.find(
                        (item) =>
                            Number(
                                item.id
                            ) ===
                            leadId
                    );

                if (!lead) {
                    console.error(
                        "Pipeline.jsx: Lead nÃƒÂ£o encontrado:",
                        leadId
                    );

                    return;
                }

                const novoStatus =
                    normalizarStatus(
                        destination.droppableId
                    );

                const statusAnterior =
                    normalizarStatus(
                        lead.status
                    );

                if (
                    novoStatus ===
                    statusAnterior
                ) {
                    return;
                }

                console.log(
                    "Pipeline.jsx: Movendo lead:",
                    {
                        id: leadId,
                        de: statusAnterior,
                        para: novoStatus,
                    }
                );

                // ----------------------------------------
                // ATUALIZAÃƒâ€¡ÃƒÆ’O OTIMISTA
                // ----------------------------------------

                setLeads(
                    (currentLeads) =>
                        currentLeads.map(
                            (item) =>
                                Number(
                                    item.id
                                ) ===
                                leadId
                                    ? {
                                        ...item,
                                        status:
                                            novoStatus,
                                    }
                                    : item
                        )
                );

                setMovingLeadId(
                    leadId
                );

                // ----------------------------------------
                // PERSISTÃƒÅ NCIA
                // ----------------------------------------

                try {

                    await atualizarStatusLead(
                        leadId,
                        novoStatus
                    );

                    console.log(
                        "Pipeline.jsx: Status atualizado com sucesso:",
                        {
                            id: leadId,
                            status:
                                novoStatus,
                        }
                    );

                    if (
                        typeof atualizar ===
                        "function"
                    ) {
                        atualizar({
                            tipo:
                                "STATUS_ATUALIZADO",
                            leadId,
                            status:
                                novoStatus,
                        });
                    }

                } catch (err) {

                    console.error(
                        "Pipeline.jsx: Erro ao atualizar status:",
                        err
                    );

                    // ------------------------------------
                    // ROLLBACK
                    // ------------------------------------

                    setLeads(
                        (
                            currentLeads
                        ) =>
                            currentLeads.map(
                                (
                                    item
                                ) =>
                                    Number(
                                        item.id
                                    ) ===
                                    leadId
                                        ? {
                                            ...item,
                                            status:
                                                statusAnterior,
                                        }
                                        : item
                            )
                    );

                    setError(
                        err?.message ||
                        "NÃƒÂ£o foi possÃƒÂ­vel atualizar o status do lead."
                    );

                } finally {

                    setMovingLeadId(
                        null
                    );
                }
            },
            [
                leads,
                atualizar,
            ]
        );

    // ====================================================
    // LOADING
    // ====================================================

    if (loading) {
        return (
            <div className="pipeline">

                <div className="pipeline-loading">

                    <div className="pipeline-loading-spinner" />

                    <span>
                        Carregando Pipeline...
                    </span>

                </div>

            </div>
        );
    }

    // ====================================================
    // ERRO
    // ====================================================

    if (
        error &&
        leads.length === 0
    ) {
        return (
            <div className="pipeline">

                <div className="pipeline-error">

                    <strong>
                        Erro ao carregar Pipeline
                    </strong>

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            carregarPipeline()
                        }
                    >
                        Tentar novamente
                    </button>

                </div>

            </div>
        );
    }

    // ====================================================
    // RENDER
    // ====================================================

    return (
        <div className="pipeline">

            {/* ==========================================
                CABEÃƒâ€¡ALHO
            ========================================== */}

            <div className="pipeline-header">

                <div className="pipeline-header-info">

                    <h2>
                        Pipeline Comercial
                    </h2>

                    <span>
                        {leadsFiltrados.length}
                        {" "}
                        de
                        {" "}
                        {leads.length}
                        {" "}
                        leads
                    </span>

                </div>

                <div className="pipeline-actions">

                    {/* BUSCA */}

                    <div className="pipeline-search">

                        <Search
                            size={18}
                        />

                        <input
                            type="text"
                            value={busca}
                            onChange={(event) =>
                                setBusca(
                                    event.target.value
                                )
                            }
                            placeholder="Buscar leads..."
                            aria-label="Buscar leads"
                        />

                        {busca && (
                            <button
                                type="button"
                                onClick={() =>
                                    setBusca("")
                                }
                                aria-label="Limpar busca"
                            >
                                <X
                                    size={16}
                                />
                            </button>
                        )}

                    </div>

                    {/* ATUALIZAR */}

                    <button
                        type="button"
                        className="pipeline-refresh"
                        onClick={() =>
                            carregarPipeline()
                        }
                        title="Atualizar pipeline"
                    >
                        <RefreshCw
                            size={17}
                        />

                        <span>
                            Atualizar
                        </span>
                    </button>

                </div>

            </div>

            {/* ==========================================
                AVISO
            ========================================== */}

            {error &&
                leads.length > 0 && (
                    <div className="pipeline-warning">

                        <span>
                            {error}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setError(
                                    null
                                )
                            }
                        >
                            Ãƒâ€”
                        </button>

                    </div>
                )}

            {/* ==========================================
                RESULTADO DA BUSCA
            ========================================== */}

            {busca &&
                leadsFiltrados.length === 0 && (
                    <div className="pipeline-no-results">

                        <Search
                            size={28}
                        />

                        <strong>
                            Nenhum lead encontrado
                        </strong>

                        <span>
                            Tente buscar por empresa,
                            nome, telefone, e-mail,
                            cidade ou segmento.
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setBusca("")
                            }
                        >
                            Limpar busca
                        </button>

                    </div>
                )}

            {/* ==========================================
                BOARD
            ========================================== */}

            {(leadsFiltrados.length > 0 ||
                !busca) && (

                <DragDropContext
                    onDragEnd={
                        handleDragEnd
                    }
                >

                    <div className="pipeline-board">

                        {PIPELINE_STATUSES.map(
                            (status) => (
                                <PipelineColumn
                                    key={
                                        status.id
                                    }
                                    status={
                                        status.id
                                    }
                                    title={
                                        status.label
                                    }
                                    leads={
                                        columns[
                                            status.id
                                        ] ||
                                        []
                                    }
                                    movingLeadId={
                                        movingLeadId
                                    }
                                    onLeadClick={
                                        handleLeadClick
                                    }
                                />
                            )
                        )}

                    </div>

                </DragDropContext>
            )}

        </div>
    );
}




