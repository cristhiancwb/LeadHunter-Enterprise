import { AlertCircle, BarChart3, Building2, CheckCircle2, Copy, Database, LayoutDashboard, ListFilter, Loader2, MapPin, RefreshCw, Search, Tags, TrendingUp, Zap } from "lucide-react";

import { useEffect, useState } from "react";



import {
    criarJobGoogleMaps,
    buscarStatusJob,
} from "../services/jobService";

import CommercialDashboard from "../components/Dashboard/CommercialDashboard";



import "./Dashboard.css";


const API_URL = "http://127.0.0.1:8000";
function formatarErroApi(error) {

    if (!error) {
        return "Erro desconhecido.";
    }

    if (typeof error === "string") {
        return error;
    }

    if (error?.message && typeof error.message === "string") {

        if (error.message !== "[object Object]") {
            return error.message;
        }

    }

    const detalhe =
        error?.response?.data?.detail ??
        error?.data?.detail ??
        error?.detail;

    if (Array.isArray(detalhe)) {

        return detalhe
            .map(item => {

                if (typeof item === "string") {
                    return item;
                }

                return item?.msg || "Erro de validação.";
            })
            .join(" ");

    }

    if (typeof detalhe === "string") {
        return detalhe;
    }

    return "Não foi possível iniciar a coleta.";
}



const STATUS_SUCESSO = [
    "finished",
    "completed",
    "done",
];


const STATUS_ERRO = [
    "failed",
    "error",
];


function ehStatusFinal(status) {

    const valor =
        String(status || "").toLowerCase();

    return (
        STATUS_SUCESSO.includes(valor) ||
        STATUS_ERRO.includes(valor)
    );
}


function ehStatusSucesso(status) {

    return STATUS_SUCESSO.includes(
        String(status || "").toLowerCase()
    );
}


function ehStatusErro(status) {

    return STATUS_ERRO.includes(
        String(status || "").toLowerCase()
    );
}


function obterNumero(
    valor,
    fallback = 0
) {

    const numero = Number(valor);

    return Number.isFinite(numero)
        ? numero
        : fallback;
}


export default function Dashboard() {

    // ============================================================
    // BUSCA
    // ============================================================

    const [keyword, setKeyword] = useState("");

    const [cidade, setCidade] = useState("");

    const [limite, setLimite] = useState(25);


    // ============================================================
    // JOB
    // ============================================================

    const [job, setJob] = useState(null);

    const [loading, setLoading] = useState(false);

    const [erro, setErro] = useState("");


    // ============================================================
    // DASHBOARD COMERCIAL
    // ============================================================

    const [estatisticas, setEstatisticas] = useState({
        total_leads: 0,
        leads_ativos: 0,
        taxa_conversao: 0,
        score_medio: 0,
        pipeline: {},
        status: {},
        leads: []
    });


    const [ranking, setRanking] = useState([]);


    const [carregandoDashboard, setCarregandoDashboard] =
        useState(true);


    const [atualizando, setAtualizando] =
        useState(false);


    // ============================================================
    // CARREGAR ESTatéSTICAS
    // ============================================================

    async function carregarEstatisticas() {

        try {

            const resposta =
                await fetch(
                    `${API_URL}/dashboard/estatisticas`
                );


            if (!resposta.ok) {

                throw new Error(
                    `Erro HTTP ${resposta.status}`
                );

            }


            const dados =
                await resposta.json();


            console.log(
                "DASHBOARD API:",
                dados
            );


            /*
            ========================================================
            IMPORTANTÍSSIMO

            Mantemos a resposta COMPLETA da API.

            Antes o Dashboard pegava somente:

                total_leads
                leads_ativos
                conversao
                score_medio

            e descartava:

                pipeline
                status
                leads

            Agora tudo é preservado.
            ========================================================
            */

            setEstatisticas({

                ...dados,

                total_leads:
                    dados?.total_leads ??
                    dados?.totalLeads ??
                    dados?.total ??
                    0,

                leads_ativos:
                    dados?.leads_ativos ??
                    dados?.leadsAtivos ??
                    0,

                taxa_conversao:
                    dados?.taxa_conversao ??
                    dados?.taxaConversao ??
                    dados?.conversao ??
                    0,

                score_medio:
                    dados?.score_medio ??
                    dados?.scoreMedio ??
                    0,

                pipeline:
                    dados?.pipeline &&
                    typeof dados.pipeline === "object"
                        ? dados.pipeline
                        : {},

                status:
                    dados?.status &&
                    typeof dados.status === "object"
                        ? dados.status
                        : (
                            dados?.pipeline &&
                            typeof dados.pipeline === "object"
                                ? dados.pipeline
                                : {}
                        ),

                leads:
                    Array.isArray(dados?.leads)
                        ? dados.leads
                        : []

            });


        } catch (error) {

            console.error(
                "Erro carregando estatésticas do Dashboard:",
                error
            );

        }

    }


    // ============================================================
    // CARREGAR RANKING
    // ============================================================

    async function carregarRanking() {

        try {

            const resposta =
                await fetch(
                    `${API_URL}/dashboard/ranking`
                );


            if (!resposta.ok) {

                throw new Error(
                    `Erro HTTP ${resposta.status}`
                );

            }


            const dados =
                await resposta.json();


            console.log(
                "RANKING API:",
                dados
            );


            /*
            O backend pode retornar:

                [
                    ...
                ]

            ou:

                {
                    ranking: [...]
                }

            */

            const lista =
                Array.isArray(dados)
                    ? dados
                    : Array.isArray(dados?.ranking)
                        ? dados.ranking
                        : Array.isArray(dados?.leads)
                            ? dados.leads
                            : [];


            setRanking(lista);


        } catch (error) {

            console.warn(
                "Não foi possível carregar ranking:",
                error
            );

            setRanking([]);

        }

    }


    // ============================================================
    // ATUALIZAR DASHBOARD COMPLETO
    // ============================================================

    async function atualizarDashboard() {

        setAtualizando(true);

        try {

            await Promise.all([
                carregarEstatisticas(),
                carregarRanking()
            ]);

        } finally {

            setAtualizando(false);

            setCarregandoDashboard(false);

        }

    }


    // ============================================================
    // PRIMEIRO CARREGAMENTO
    // ============================================================

    useEffect(() => {

        atualizarDashboard();

    }, []);


    // ============================================================
    // ACOMPANHAR JOB
    // ============================================================

    useEffect(() => {

        if (!job?.id) {
            return;
        }


        const statusAtual =
            String(
                job.status || ""
            ).toLowerCase();


        if (ehStatusFinal(statusAtual)) {

            setLoading(false);


            if (
                ehStatusSucesso(statusAtual)
            ) {

                atualizarDashboard();

            }


            return;

        }


        const intervalo =
            setInterval(
                async () => {

                    try {

                        const atualizado =
                            await buscarStatusJob(
                                job.id
                            );


                        setJob(atualizado);


                        const status =
                            String(
                                atualizado?.status || ""
                            ).toLowerCase();


                        if (
                            ehStatusSucesso(status)
                        ) {

                            setLoading(false);


                            clearInterval(
                                intervalo
                            );


                            /*
                            =================================================
                            COLETA TERMINOU

                            Atualiza:

                            - total de leads
                            - pipeline
                            - status
                            - ranking
                            - score
                            =================================================
                            */

                            await atualizarDashboard();

                        }


                        if (
                            ehStatusErro(status)
                        ) {

                            setLoading(false);


                            setErro(
                                atualizado?.erro ||
                                atualizado?.error ||
                                "A coleta foi finalizada com erro."
                            );


                            clearInterval(
                                intervalo
                            );

                        }


                    } catch (error) {

                        console.error(
                            "Erro acompanhando Job:",
                            error
                        );

                    }

                },
                1500
            );


        return () =>
            clearInterval(intervalo);

    }, [
        job?.id,
        job?.status
    ]);


    // ============================================================
    // INICIAR BUSCA
    // ============================================================

    async function iniciarBusca(event) {

        event.preventDefault();


        setErro("");


        if (!keyword.trim()) {

            setErro(
                "Informe o segmento da busca."
            );

            return;

        }


        if (!cidade.trim()) {

            setErro(
                "Informe a cidade da busca."
            );

            return;

        }


        setLoading(true);

        setJob(null);

        // ====================================================
        // ETAPA 3 - SEGMENTO SELECIONADO
        // Mantém o segmento ativo para Pipeline/CRM
        // ====================================================

        localStorage.setItem(
            "leadhunter_segmento_selecionado",
            keyword.trim()
        );


        try {

            const resultado =
                await criarJobGoogleMaps({
                    keyword: keyword.trim(),
                    cidade: cidade.trim(),
                    quantidade: limite
                });


            console.log(
                "JOB GOOGLE MAPS CRIADO:",
                resultado
            );


            setJob(resultado);


        } catch (error) {

            console.error(
                "Erro ao criar Job:",
                error
            );


            setErro(
                formatarErroApi(error)
            );


            setLoading(false);

        }

    }


    // ============================================================
    // PROGRESSO
    // ============================================================

    const progresso =
        Math.max(
            0,
            Math.min(
                100,
                obterNumero(
                    job?.progresso ??
                    job?.progress,
                    0
                )
            )
        );


    // ============================================================
    // STATUS DO JOB
    // ============================================================

    const statusJob =
        String(
            job?.status || ""
        ).toLowerCase();


    const jobExecutando =
        loading &&
        !ehStatusFinal(statusJob);


    const jobConcluido =
        ehStatusSucesso(statusJob);


    const jobComErro =
        ehStatusErro(statusJob);


    // ============================================================
    // DADOS DO JOB
    // ============================================================

    const totalMeta =
        obterNumero(
            job?.limite ??
            job?.meta ??
            limite,
            limite
        );


    const totalColetado =
        obterNumero(
            job?.total_coletado ??
            job?.totalColetado ??
            job?.total,
            0
        );


    const totalSalvo =
        obterNumero(
            job?.total_salvo ??
            job?.totalSalvo,
            0
        );


    const totalDuplicados =
        obterNumero(
            job?.total_duplicados ??
            job?.totalDuplicados,
            0
        );


    const totalErros =
        obterNumero(
            job?.total_erros ??
            job?.totalErros,
            0
        );


    // ============================================================
    // MENSAGEM FINAL
    // ============================================================

    let mensagemResultado = "";


    if (jobConcluido) {

        if (totalSalvo > 0) {

            mensagemResultado =
                `${totalSalvo} novo${
                    totalSalvo === 1
                        ? ""
                        : "s"
                } lead${
                    totalSalvo === 1
                        ? ""
                        : "s"
                } enviado${
                    totalSalvo === 1
                        ? ""
                        : "s"
                } para o CRM.`;


            if (totalDuplicados > 0) {

                mensagemResultado +=
                    ` ${totalDuplicados} já existente${
                        totalDuplicados === 1
                            ? ""
                            : "s"
                    } foi${
                        totalDuplicados === 1
                            ? ""
                            : "ram"
                    } ignorado${
                        totalDuplicados === 1
                            ? ""
                            : "s"
                    }.`;

            }

        } else if (
            totalDuplicados > 0
        ) {

            mensagemResultado =
                `Nenhum lead novo foi encontrado. ` +
                `${totalDuplicados} lead${
                    totalDuplicados === 1
                        ? ""
                        : "s"
                } já estava${
                    totalDuplicados === 1
                        ? ""
                        : "m"
                } no CRM.`;

        } else if (
            totalColetado === 0
        ) {

            mensagemResultado =
                "Nenhum resultado foi encontrado para essa busca.";

        } else {

            mensagemResultado =
                "A coleta terminou sem novos leads.";

        }


        if (totalErros > 0) {

            mensagemResultado +=
                ` ${totalErros} erro${
                    totalErros === 1
                        ? ""
                        : "s"
                } ocorrido${
                    totalErros === 1
                        ? ""
                        : "s"
                }.`;

        }

    }


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <main className="dashboard-page">


            {/* ==================================================
                HEADER
            ================================================== */}

            <header className="dashboard-header">

                <div>

                    <span className="dashboard-eyebrow">
                        <LayoutDashboard size={14} />
                        CENTRAL COMERCIAL
                    </span>

                    <h1 className="dashboard-title">
                        <LayoutDashboard size={28} />
                        Dashboard
                    </h1>

                    <p>
                        Central comercial e geração de leads
                    </p>

                </div>


                <button
                    className="refresh-button"
                    onClick={
                        atualizarDashboard
                    }
                    disabled={
                        atualizando
                    }
                >

                    <RefreshCw
                        size={17}
                        className={
                            atualizando
                                ? "spin"
                                : ""
                        }
                    />

                    Atualizar

                </button>

            </header>


            {/* ==================================================
                BUSCA
            ================================================== */}

            <section className="search-card">


                <div className="search-card-header">

                    <div className="search-icon">

                        <Search size={21} />

                    </div>


                    <div>

                        <h2 className="collection-title">
                            <Search size={21} />
                            Buscar novos leads
                        </h2>

                        <p>
                            Encontre empresas no Google Maps
                            e envie automaticamente para o CRM.
                        </p>

                    </div>

                </div>


                <form
                    className="search-form"
                    onSubmit={
                        iniciarBusca
                    }
                >


                    {/* SEGMENTO */}

                    <div className="form-field">

                        <label className="field-label">
                            <Tags size={16} />
                            Segmento
                        </label>


                        <div className="input-wrapper">

                            <Building2
                                size={18}
                            />


                            <input
                                type="text"
                                placeholder="Ex.: pizzarias"
                                value={
                                    keyword
                                }
                                onChange={
                                    event =>
                                        setKeyword(
                                            event.target.value
                                        )
                                }
                                disabled={
                                    jobExecutando
                                }
                            />

                        </div>

                    </div>


                    {/* CIDADE */}

                    <div className="form-field">

                        <label className="field-label">
                            <MapPin size={16} />
                            Cidade
                        </label>


                        <div className="input-wrapper">

                            <MapPin
                                size={18}
                            />


                            <input
                                type="text"
                                placeholder="Ex.: Curitiba"
                                value={
                                    cidade
                                }
                                onChange={
                                    event =>
                                        setCidade(
                                            event.target.value
                                        )
                                }
                                disabled={
                                    jobExecutando
                                }
                            />

                        </div>

                    </div>


                    {/* LIMITE */}

                    <div className="form-field">

                        <label className="field-label">
                            <ListFilter size={16} />
                            Quantidade de Leads
                        </label>


                        <select
                            value={
                                limite
                            }
                            onChange={
                                event =>
                                    setLimite(
                                        Number(
                                            event.target.value
                                        )
                                    )
                            }
                            disabled={
                                jobExecutando
                            }
                        >

                            <option value={5}>
                                5 leads
                            </option>

                            <option value={10}>
                                10 leads
                            </option>

                            <option value={25}>
                                25 leads
                            </option>

                            <option value={50}>
                                50 leads
                            </option>

                            <option value={100}>
                                100 leads
                            </option>

                            <option value={250}>
                                250 leads
                            </option>

                            <option value={500}>
                                500 leads
                            </option>

                        </select>

                    </div>


                    {/* BOTÃO */}

                    <button
                        type="submit"
                        className="search-button"
                        disabled={
                            jobExecutando
                        }
                    >

                        {jobExecutando ? (

                            <>

                                <Loader2
                                    size={18}
                                    className="spin"
                                />

                                Coletando...

                            </>

                        ) : (

                            <>


                                <Search size={18} />
                                Buscar Leads

                            </>

                        )}

                    </button>

                </form>


                <div className="search-hint">

                    Busca configurada para até{" "}

                    <strong>
                        {limite} leads
                    </strong>

                    {" "}por segmento e cidade.

                </div>


                {/* ERRO */}

                {erro && (

                    <div className="error-message">

                        <AlertCircle
                            size={18}
                        />

                        <span>
                            {erro}
                        </span>

                    </div>

                )}


                {/* ==================================================
                    JOB
                ================================================== */}

                {job && (

                    <div className="job-status">


                        <div className="job-status-top">

                            <div>

                                <span className="job-label">
                                    Status da coleta
                                </span>


                                <strong>

                                    {jobConcluido
                                        ? "Coleta concluída"
                                        : jobComErro
                                            ? "Coleta com erro"
                                            : "Coleta em andamento"}

                                </strong>

                            </div>


                            <span className="job-percent">

                                {progresso}%

                            </span>

                        </div>


                        {/* PROGRESSO */}

                        <div className="progress-track">

                            <div
                                className="progress-value"
                                style={{
                                    width:
                                        `${progresso}%`
                                }}
                            />

                        </div>


                        {/* IDENTIFICAãO */}

                        <div className="job-description">

                            <strong>
                                Job #{job.id}
                            </strong>

                            <span className="job-separator">
                                •
                            </span>

                            <span>
                                {keyword || "Segmento"}
                            </span>

                            <span className="job-separator">
                                •
                            </span>

                            <span>
                                {cidade || "Cidade"}
                            </span>

                            <span className="job-separator">
                                •
                            </span>

                            <span>
                                {totalMeta} leads
                            </span>

                        </div>


                        {/* MÉTRICAS */}

                        <div className="job-metrics">


                            <div className="job-metric">

                                <span>
                                    Meta
                                </span>

                                <strong>
                                    {totalMeta}
                                </strong>

                            </div>


                            <div className="job-metric">

                                <span>
                                    Coletados
                                </span>

                                <strong>
                                    {totalColetado}
                                </strong>

                            </div>


                            <div className="job-metric">

                                <span>
                                    Novos leads
                                </span>

                                <strong>
                                    {totalSalvo}
                                </strong>

                            </div>


                            <div className="job-metric">

                                <span>
                                    Duplicados
                                </span>

                                <strong>
                                    {totalDuplicados}
                                </strong>

                            </div>


                            <div className="job-metric">

                                <span>
                                    Erros
                                </span>

                                <strong>
                                    {totalErros}
                                </strong>

                            </div>

                        </div>


                        {/* RESULTADO */}

                        {jobConcluido && (

                            <div className="job-result">

                                <CheckCircle2
                                    size={18}
                                />

                                <span>
                                    {mensagemResultado}
                                </span>

                            </div>

                        )}


                        {/* ERRO DO JOB */}

                        {jobComErro && (

                            <div className="job-result job-result-error">

                                <AlertCircle
                                    size={18}
                                />

                                <span>

                                    {
                                        job?.erro ||
                                        job?.error ||
                                        "A coleta foi finalizada com erro."
                                    }

                                </span>

                            </div>

                        )}

                    </div>

                )}

            </section>


            {/* ==================================================
                DASHBOARD COMERCIAL
            ================================================== */}

            <CommercialDashboard

                estatisticas={
                    estatisticas
                }

                ranking={
                    ranking
                }

                carregando={
                    carregandoDashboard
                }

                onAtualizar={
                    atualizarDashboard
                }

            />


            {/* ==================================================
                Informações
            ================================================== */}

            <section className="info-grid">


                <article className="info-card">

                    <div className="info-card-icon">

                        <Search size={20} />

                    </div>


                    <div>

                        <h3>
                            geração de Leads
                        </h3>

                        <p>
                            Google Maps
                            <span>?</span>
                            Deduplicaão
                            <span>?</span>
                            CRM
                        </p>

                    </div>

                </article>


                <article className="info-card">

                    <div className="info-card-icon">

                        <Copy size={20} />

                    </div>


                    <div>

                        <h3>
                            Deduplicação automática
                        </h3>

                        <p>
                            Telefone e empresa + cidade
                        </p>

                    </div>

                </article>


                <article className="info-card">

                    <div className="info-card-icon">

                        <TrendingUp size={20} />

                    </div>


                    <div>

                        <h3>
                            Lead Score
                        </h3>

                        <p>
                            Priorização automática dos leads
                        </p>

                    </div>

                </article>


                <article className="info-card">

                    <div className="info-card-icon">

                        <Database size={20} />

                    </div>


                    <div>

                        <h3>
                            CRM integrado
                        </h3>

                        <p>
                            Novos leads enviados automaticamente
                        </p>

                    </div>

                </article>


            </section>


        </main>

    );

}









