import {
    useEffect,
    useState
} from "react";

import {
    DragDropContext,
    Droppable,
    Draggable
} from "@hello-pangea/dnd";

import {
    MapPin,
    Target,
    Award,
    RefreshCw
} from "lucide-react";

import {
    buscarPipeline,
    atualizarStatusLead
} from "../services/api";

import "../styles/Pipeline.css";


const colunas = [
    "NOVO",
    "EM_CONTATO",
    "QUALIFICADO",
    "EM_NEGOCIACAO",
    "FECHADO",
    "PERDIDO"
];


const nomesColunas = {
    NOVO: "Novo",
    EM_CONTATO: "Em Contato",
    QUALIFICADO: "Qualificado",
    EM_NEGOCIACAO: "Em Negociação",
    FECHADO: "Fechado",
    PERDIDO: "Perdido"
};


function Pipeline() {

    const [leads, setLeads] = useState([]);

    const [carregando, setCarregando] = useState(true);


    useEffect(() => {

        carregarPipeline();

    }, []);


    async function carregarPipeline() {

        try {

            setCarregando(true);

            const dados =
                await buscarPipeline();

            console.log(
                "PIPELINE:",
                dados
            );

            const lista =
                Array.isArray(dados)
                    ? dados
                    : Array.isArray(dados?.leads)
                        ? dados.leads
                        : [];

            setLeads(lista);

        }
        catch (error) {

            console.error(
                "Erro carregar pipeline:",
                error
            );

            setLeads([]);

        }
        finally {

            setCarregando(false);

        }

    }


    async function moverLead(resultado) {

        const {
            destination,
            source,
            draggableId
        } = resultado;


        if (!destination) {
            return;
        }


        if (
            destination.droppableId ===
            source.droppableId
        ) {
            return;
        }


        try {

            await atualizarStatusLead(
                Number(draggableId),
                destination.droppableId
            );

            await carregarPipeline();

        }
        catch (error) {

            console.error(
                "Erro mover lead:",
                error
            );

        }

    }


    function leadsPorStatus(status) {

        return leads.filter(
            lead =>
                String(lead.status || "").toUpperCase() ===
                status
        );

    }


    function estatisticas(status) {

        const lista =
            leadsPorStatus(status);

        const total =
            lista.length;


        const score =
            total > 0
                ? Math.round(
                    lista.reduce(
                        (acc, lead) =>
                            acc + Number(lead.score || 0),
                        0
                    ) / total
                )
                : 0;


        const alta =
            lista.filter(
                lead =>
                    String(
                        lead.prioridade || ""
                    ).toUpperCase() === "ALTA"
            ).length;


        return {
            total,
            score,
            alta
        };

    }


    if (carregando) {

        return (

            <main className="pipeline">

                <div className="pipeline-loading">

                    <div className="pipeline-loading-spinner" />

                    <span>
                        Carregando Pipeline...
                    </span>

                </div>

            </main>

        );

    }


    return (

        <main className="pipeline">


            <header className="pipeline-header">

                <div className="pipeline-header-info">

                    <h2>
                        Pipeline Comercial
                    </h2>

                    <span>
                        Acompanhe seus leads por etapa do processo comercial.
                    </span>

                </div>


                <div className="pipeline-actions">

                    <button
                        type="button"
                        className="pipeline-refresh"
                        onClick={carregarPipeline}
                        disabled={carregando}
                    >

                        <RefreshCw size={16} />

                        Atualizar

                    </button>

                </div>

            </header>


            <DragDropContext
                onDragEnd={moverLead}
            >

                <div className="pipeline-board">


                    {colunas.map(coluna => {

                        const info =
                            estatisticas(coluna);

                        const lista =
                            leadsPorStatus(coluna);


                        return (

                            <Droppable
                                key={coluna}
                                droppableId={coluna}
                            >

                                {(provided, snapshot) => (

                                    <section
                                        className="pipeline-column"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >


                                        <div className="pipeline-column-header">

                                            <div className="pipeline-column-title">

                                                <span>
                                                    {nomesColunas[coluna]}
                                                </span>

                                                <span className="pipeline-column-count">
                                                    {info.total}
                                                </span>

                                            </div>

                                        </div>


                                        <div
                                            className={
                                                "pipeline-column-dropzone" +
                                                (
                                                    snapshot.isDraggingOver
                                                        ? " is-dragging-over"
                                                        : ""
                                                )
                                            }
                                        >


                                            {lista.length === 0 && (

                                                <div className="pipeline-empty">
                                                    Nenhum lead nesta etapa.
                                                </div>

                                            )}


                                            {lista.map(
                                                (lead, index) => (

                                                    <Draggable
                                                        key={lead.id}
                                                        draggableId={
                                                            String(lead.id)
                                                        }
                                                        index={index}
                                                    >

                                                        {(
                                                            provided,
                                                            snapshot
                                                        ) => (

                                                            <article
                                                                className={
                                                                    "lead-card" +
                                                                    (
                                                                        snapshot.isDragging
                                                                            ? " is-moving"
                                                                            : ""
                                                                    )
                                                                }
                                                                ref={
                                                                    provided.innerRef
                                                                }
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >


                                                                <div className="lead-card-name">

                                                                    {
                                                                        lead.empresa ||
                                                                        lead.nome ||
                                                                        "Sem nome"
                                                                    }

                                                                </div>


                                                                <div className="lead-card-info">


                                                                    <div className="lead-card-info-row">

                                                                        <MapPin size={13} />

                                                                        <span>
                                                                            {
                                                                                lead.cidade ||
                                                                                "-"
                                                                            }
                                                                        </span>

                                                                    </div>


                                                                    <div className="lead-card-info-row">

                                                                        <Target size={13} />

                                                                        <span>
                                                                            Score:{" "}
                                                                            {
                                                                                lead.score ??
                                                                                0
                                                                            }
                                                                        </span>

                                                                    </div>


                                                                </div>


                                                                <div className="lead-card-footer">


                                                                    <span
                                                                        className={
                                                                            "lead-card-priority " +
                                                                            (
                                                                                String(
                                                                                    lead.prioridade || ""
                                                                                ).toLowerCase() === "alta"
                                                                                    ? "priority-alta"
                                                                                    : String(
                                                                                        lead.prioridade || ""
                                                                                    ).toLowerCase() === "media"
                                                                                        ? "priority-media"
                                                                                        : "priority-baixa"
                                                                            )
                                                                        }
                                                                    >

                                                                        {
                                                                            lead.prioridade ||
                                                                            "BAIXA"
                                                                        }

                                                                    </span>


                                                                    <span className="lead-card-score">

                                                                        <Award size={13} />

                                                                        {
                                                                            lead.score ??
                                                                            0
                                                                        }

                                                                    </span>


                                                                </div>


                                                            </article>

                                                        )}

                                                    </Draggable>

                                                )
                                            )}


                                            {provided.placeholder}


                                        </div>


                                    </section>

                                )}

                            </Droppable>

                        );

                    })}


                </div>

            </DragDropContext>


        </main>

    );

}


export default Pipeline;
