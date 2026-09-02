import { useEffect, useState } from "react";

import {
    Megaphone,
    Plus,
    RefreshCw,
    Pencil,
    Trash2,
    Eye,
    X,
    Save,
    MessageSquare,
    Package,
    Loader2,
    Play,
    Pause,
    CheckCircle
} from "lucide-react";

import {
    buscarCampanhas,
    criarCampanha,
    atualizarCampanha,
    excluirCampanha,
    atualizarStatusCampanha,
    buscarMensagensCampanha,
    gerarMensagensCampanha,
    atualizarStatusMensagemCampanha
} from "../services/api.js";

import CampaignProductsModal from "../components/CampaignProductsModal.jsx";
import "./Campanhas.css";


function normalizarLista(resposta) {

    if (Array.isArray(resposta)) {
        return resposta;
    }

    if (Array.isArray(resposta?.campanhas)) {
        return resposta.campanhas;
    }

    if (Array.isArray(resposta?.items)) {
        return resposta.items;
    }

    if (Array.isArray(resposta?.data)) {
        return resposta.data;
    }

    return [];
}


function textoStatus(status) {

    const mapa = {
        ATIVA: "Ativa",
        ATIVO: "Ativa",

        RUNNING: "Ativa",

        PAUSADA: "Pausada",
        PAUSADO: "Pausada",

        PAUSED: "Pausada",

        FINALIZADA: "Finalizada",
        FINALIZADO: "Finalizada",

        FINISHED: "Finalizada",

        CONCLUIDA: "Concluída",
        CONCLUÍDA: "Concluída",

        RASCUNHO: "Rascunho",
        DRAFT: "Rascunho",

        CREATED: "Criada",
        PENDENTE: "Pendente",

        SENT: "Enviada",
        ENVIADA: "Enviada",

        CANCELLED: "Cancelada",
        CANCELADA: "Cancelada"
    };

    return mapa[String(status || "").toUpperCase()] || status || "—";
}


function classeStatus(status) {

    return `status-${String(status || "pendente")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")}`;
}


export default function Campanhas() {

    const [campanhas, setCampanhas] = useState([]);

    const [carregando, setCarregando] =
        useState(true);

    const [erro, setErro] =
        useState("");

    const [modalAberto, setModalAberto] =
        useState(false);

    const [modoEdicao, setModoEdicao] =
        useState(false);

    const [campanhaSelecionada, setCampanhaSelecionada] =
        useState(null);

    const [mensagens, setMensagens] =
        useState([]);

    const [carregandoMensagens, setCarregandoMensagens] =
        useState(false);

    const [modalMensagens, setModalMensagens] =
        useState(false);

    const [modalProdutosAberto, setModalProdutosAberto] =
        useState(false);

    const [campanhaProdutosSelecionada, setCampanhaProdutosSelecionada] =
        useState(null);

    const [salvando, setSalvando] =
        useState(false);

    const [formulario, setFormulario] =
        useState({
            nome: "",
            descricao: "",
            status: "RASCUNHO"
        });


    async function carregarCampanhas() {

        try {

            setCarregando(true);
            setErro("");

            const resposta =
                await buscarCampanhas();

            const lista =
                normalizarLista(resposta);

            console.log(
                "[Campanhas] Resposta:",
                resposta
            );

            console.log(
                "[Campanhas] Lista normalizada:",
                lista
            );

            setCampanhas(lista);

        } catch (error) {

            console.error(
                "[Campanhas] Erro:",
                error
            );

            setErro(
                error?.message ||
                "Não foi possível carregar as campanhas."
            );

            setCampanhas([]);

        } finally {

            setCarregando(false);
        }
    }


    useEffect(() => {

        carregarCampanhas();

    }, []);


    function abrirNovaCampanha() {

        setModoEdicao(false);
        setCampanhaSelecionada(null);

        setFormulario({
            nome: "",
            descricao: "",
            status: "RASCUNHO"
        });

        setModalAberto(true);
    }


    function abrirEdicao(campanha) {

        setModoEdicao(true);
        setCampanhaSelecionada(campanha);

        setFormulario({
            nome:
                campanha?.nome ||
                campanha?.name ||
                "",

            descricao:
                campanha?.descricao ||
                campanha?.description ||
                "",

            status:
                campanha?.status ||
                "RASCUNHO"
        });

        setModalAberto(true);
    }


    async function salvarCampanha(event) {

        event.preventDefault();

        if (!formulario.nome.trim()) {

            setErro(
                "Informe o nome da campanha."
            );

            return;
        }

        try {

            setSalvando(true);
            setErro("");

            const payload = {
                ...formulario,
                nome: formulario.nome.trim(),
                descricao: formulario.descricao.trim()
            };

            if (modoEdicao) {

                await atualizarCampanha(
                    campanhaSelecionada.id,
                    payload
                );

            } else {

                await criarCampanha(
                    payload
                );
            }

            setModalAberto(false);

            await carregarCampanhas();

        } catch (error) {

            console.error(
                "[Campanhas] Erro salvando:",
                error
            );

            setErro(
                error?.message ||
                "Não foi possível salvar a campanha."
            );

        } finally {

            setSalvando(false);
        }
    }


    async function removerCampanha(campanha) {

        const id =
            campanha?.id ??
            campanha?.campaign_id;

        if (!id) {
            return;
        }

        const confirmou =
            window.confirm(
                `Excluir a campanha "${campanha?.nome || campanha?.name || "sem nome"}"?`
            );

        if (!confirmou) {
            return;
        }

        try {

            setErro("");

            await excluirCampanha(id);

            await carregarCampanhas();

        } catch (error) {

            console.error(
                "[Campanhas] Erro excluindo:",
                error
            );

            setErro(
                error?.message ||
                "Não foi possível excluir a campanha."
            );
        }
    }


    async function alterarStatus(campanha, status) {

        const id =
            campanha?.id ??
            campanha?.campaign_id;

        if (!id) {
            return;
        }

        try {

            setErro("");

            await atualizarStatusCampanha(
                id,
                status
            );

            await carregarCampanhas();

        } catch (error) {

            console.error(
                "[Campanhas] Erro alterando status:",
                error
            );

            setErro(
                error?.message ||
                "Não foi possível alterar o status."
            );
        }
    }


    function abrirProdutos(campanha) {

        const id =
            campanha?.id ??
            campanha?.campaign_id;

        if (!id) {
            return;
        }

        setCampanhaProdutosSelecionada(campanha);
        setModalProdutosAberto(true);
    }


    async function abrirMensagens(campanha) {

        const id =
            campanha?.id ??
            campanha?.campaign_id;

        if (!id) {
            return;
        }

        setCampanhaSelecionada(campanha);
        setMensagens([]);
        setModalMensagens(true);
        setCarregandoMensagens(true);

        try {

            const resposta =
                await buscarMensagensCampanha(id);

            setMensagens(
                normalizarLista(resposta)
            );

        } catch (error) {

            console.error(
                "[Campanhas] Erro carregando mensagens:",
                error
            );

            setErro(
                error?.message ||
                "Não foi possível carregar as mensagens."
            );

        } finally {

            setCarregandoMensagens(false);
        }
    }


    async function alterarStatusMensagem(
        mensagem,
        status
    ) {

        const id =
            mensagem?.id ??
            mensagem?.message_id;

        if (!id) {
            return;
        }

        try {

            await atualizarStatusMensagemCampanha(
                id,
                status
            );

            await abrirMensagens(
                campanhaSelecionada
            );

        } catch (error) {

            console.error(
                "[Campanhas] Erro atualizando mensagem:",
                error
            );

            setErro(
                error?.message ||
                "Não foi possível atualizar a mensagem."
            );
        }
    }


    async function gerarMensagens() {

        const id =
            campanhaSelecionada?.id ??
            campanhaSelecionada?.campaign_id;

        if (!id) {
            return;
        }

        try {

            setCarregandoMensagens(true);
            setErro("");

            await gerarMensagensCampanha(
                id,
                {
                    lead_ids: []
                }
            );

            await abrirMensagens(
                campanhaSelecionada
            );

        } catch (error) {

            console.error(
                "[Campanhas] Erro gerando mensagens:",
                error
            );

            setErro(
                error?.message ||
                "Não foi possível gerar mensagens."
            );

        } finally {

            setCarregandoMensagens(false);
        }
    }



    const totalCampanhas =
        campanhas.length;

    const ativas =
        campanhas.filter(
            campanha =>
                ["ATIVA", "ATIVO"].includes(
                    String(campanha?.status || "").toUpperCase()
                )
        ).length;

    const finalizadas =
        campanhas.filter(
            campanha =>
                ["FINALIZADA", "FINALIZADO", "CONCLUIDA", "CONCLUÍDA"]
                    .includes(
                        String(campanha?.status || "").toUpperCase()
                    )
        ).length;


    return (
        <div className="campanhas-page">

            <div className="campanhas-header">

                <div className="campanhas-title">

                    <div className="campanhas-title-icon">
                        <Megaphone size={24} />
                    </div>

                    <div>
                        <h1>Campanhas</h1>

                        <p>
                            Gerencie campanhas comerciais e mensagens.
                        </p>
                    </div>

                </div>


                <div className="campanhas-actions">

                    <button
                        type="button"
                        className="campanha-btn secondary"
                        onClick={carregarCampanhas}
                        disabled={carregando}
                    >
                        <RefreshCw
                            size={16}
                            className={
                                carregando
                                    ? "campanha-spin"
                                    : ""
                            }
                        />

                        Atualizar
                    </button>


                    <button
                        type="button"
                        className="campanha-btn primary"
                        onClick={abrirNovaCampanha}
                    >
                        <Plus size={16} />

                        Nova campanha
                    </button>

                </div>

            </div>


            {erro && (

                <div className="campanha-alert">

                    <span>
                        {erro}
                    </span>

                    <button
                        type="button"
                        onClick={() => setErro("")}
                    >
                        <X size={16} />
                    </button>

                </div>

            )}


            <div className="campanhas-stats">

                <div className="campanha-stat">
                    <span>Total de campanhas</span>
                    <strong>{totalCampanhas}</strong>
                </div>

                <div className="campanha-stat">
                    <span>Campanhas ativas</span>
                    <strong>{ativas}</strong>
                </div>

                <div className="campanha-stat">
                    <span>Finalizadas</span>
                    <strong>{finalizadas}</strong>
                </div>

            </div>


            <div className="campanhas-card">

                <div className="campanhas-card-header">

                    <h2>
                        Campanhas cadastradas
                    </h2>

                    <span>
                        {totalCampanhas} registro(s)
                    </span>

                </div>


                {carregando ? (

                    <div className="campanhas-empty">

                        <Loader2
                            size={32}
                            className="campanha-spin"
                        />

                        <p>
                            Carregando campanhas...
                        </p>

                    </div>

                ) : campanhas.length === 0 ? (

                    <div className="campanhas-empty">

                        <Megaphone size={38} />

                        <h3>
                            Nenhuma campanha encontrada
                        </h3>

                        <p>
                            Crie sua primeira campanha para começar.
                        </p>

                        <button
                            type="button"
                            className="campanha-btn primary"
                            onClick={abrirNovaCampanha}
                        >
                            <Plus size={16} />
                            Criar campanha
                        </button>

                    </div>

                ) : (

                    <div className="campanhas-table-wrapper">

                        <table className="campanhas-table">

                            <thead>

                                <tr>
                                    <th>Campanha</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>

                            </thead>

                            <tbody>

                                {campanhas.map(
                                    (campanha, index) => {

                                        const id =
                                            campanha?.id ??
                                            campanha?.campaign_id ??
                                            index;

                                        const nome =
                                            campanha?.nome ??
                                            campanha?.name ??
                                            "Campanha sem nome";

                                        const descricao =
                                            campanha?.descricao ??
                                            campanha?.description ??
                                            "";

                                        const status =
                                            campanha?.status ??
                                            "RASCUNHO";

                                        return (

                                            <tr key={id}>

                                                <td>

                                                    <div className="campanha-name">

                                                        <strong>
                                                            {nome}
                                                        </strong>

                                                        <span>
                                                            {descricao || "Sem descrição"}
                                                        </span>

                                                    </div>

                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            `campanha-status ${classeStatus(status)}`
                                                        }
                                                    >
                                                        {textoStatus(status)}
                                                    </span>

                                                </td>


                                                <td>

                                                    <div className="campanha-row-actions">

                                                        <button
                                                            type="button"
                                                            className="icon-action"
                                                            title="Produtos"
                                                            onClick={() =>
                                                                abrirProdutos(
                                                                    campanha
                                                                )
                                                            }
                                                        >
                                                            <Package size={15} />
                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="icon-action"
                                                            title="Mensagens"
                                                            onClick={() =>
                                                                abrirMensagens(
                                                                    campanha
                                                                )
                                                            }
                                                        >
                                                            <MessageSquare size={15} />
                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="icon-action"
                                                            title="Editar"
                                                            onClick={() =>
                                                                abrirEdicao(
                                                                    campanha
                                                                )
                                                            }
                                                        >
                                                            <Pencil size={15} />
                                                        </button>


                                                        {["ATIVA", "ATIVO", "RUNNING"].includes(String(status).toUpperCase()) ? (

                                                            <button
                                                                type="button"
                                                                className="icon-action"
                                                                title="Pausar"
                                                                onClick={() =>
                                                                    alterarStatus(
                                                                        campanha,
                                                                        "PAUSADA"
                                                                    )
                                                                }
                                                            >
                                                                <Pause size={15} />
                                                            </button>

                                                        ) : (

                                                            <button
                                                                type="button"
                                                                className="icon-action"
                                                                title="Ativar"
                                                                onClick={() =>
                                                                    alterarStatus(
                                                                        campanha,
                                                                        "ATIVA"
                                                                    )
                                                                }
                                                            >
                                                                <Play size={15} />
                                                            </button>

                                                        )}


                                                        <button
                                                            type="button"
                                                            className="icon-action danger"
                                                            title="Excluir"
                                                            onClick={() =>
                                                                removerCampanha(
                                                                    campanha
                                                                )
                                                            }
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {modalAberto && (

                <div className="campanha-modal-overlay">

                    <div className="campanha-modal">

                        <div className="campanha-modal-header">

                            <div>

                                <h2>
                                    {modoEdicao
                                        ? "Editar campanha"
                                        : "Nova campanha"}
                                </h2>

                                <p>
                                    Configure os dados da campanha.
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setModalAberto(false)
                                }
                            >
                                <X size={18} />
                            </button>

                        </div>


                        <form
                            className="campanha-form"
                            onSubmit={salvarCampanha}
                        >

                            <label>

                                Nome

                                <input
                                    value={formulario.nome}
                                    onChange={event =>
                                        setFormulario(
                                            atual => ({
                                                ...atual,
                                                nome:
                                                    event.target.value
                                            })
                                        )
                                    }
                                    placeholder="Ex.: Campanha Pizzarias"
                                />

                            </label>


                            <label>

                                Descrição

                                <textarea
                                    rows={4}
                                    value={formulario.descricao}
                                    onChange={event =>
                                        setFormulario(
                                            atual => ({
                                                ...atual,
                                                descricao:
                                                    event.target.value
                                            })
                                        )
                                    }
                                    placeholder="Descreva o objetivo da campanha..."
                                />

                            </label>


                            <label>

                                Status

                                <select
                                    value={formulario.status}
                                    onChange={event =>
                                        setFormulario(
                                            atual => ({
                                                ...atual,
                                                status:
                                                    event.target.value
                                            })
                                        )
                                    }
                                >
                                    <option value="RASCUNHO">
                                        Rascunho
                                    </option>

                                    <option value="ATIVA">
                                        Ativa
                                    </option>

                                    <option value="PAUSADA">
                                        Pausada
                                    </option>
                                </select>

                            </label>


                            <div className="campanha-form-actions">

                                <button
                                    type="button"
                                    className="campanha-btn secondary"
                                    onClick={() =>
                                        setModalAberto(false)
                                    }
                                >
                                    Cancelar
                                </button>


                                <button
                                    type="submit"
                                    className="campanha-btn primary"
                                    disabled={salvando}
                                >

                                    {salvando ? (
                                        <Loader2
                                            size={16}
                                            className="campanha-spin"
                                        />
                                    ) : (
                                        <Save size={16} />
                                    )}

                                    {salvando
                                        ? "Salvando..."
                                        : "Salvar"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            <CampaignProductsModal
                campaign={campanhaProdutosSelecionada}
                aberto={modalProdutosAberto}
                onClose={() => {
                    setModalProdutosAberto(false);
                    setCampanhaProdutosSelecionada(null);
                }}
            />


            {modalMensagens && (

                <div className="campanha-modal-overlay">

                    <div className="campanha-modal campanha-modal-wide">

                        <div className="campanha-modal-header">

                            <div>

                                <h2>
                                    Mensagens da campanha
                                </h2>

                                <p>
                                    {campanhaSelecionada?.nome ||
                                     campanhaSelecionada?.name ||
                                     "Campanha"}
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setModalMensagens(false)
                                }
                            >
                                <X size={18} />
                            </button>

                        </div>


                        <div className="mensagens-toolbar">

                            <button
                                type="button"
                                className="campanha-btn primary"
                                onClick={gerarMensagens}
                                disabled={carregandoMensagens}
                            >
                                <MessageSquare size={15} />
                                Gerar mensagens
                            </button>

                        </div>


                        {carregandoMensagens ? (

                            <div className="mensagens-empty">

                                <Loader2
                                    size={28}
                                    className="campanha-spin"
                                />

                                <p>
                                    Carregando mensagens...
                                </p>

                            </div>

                        ) : mensagens.length === 0 ? (

                            <div className="mensagens-empty">

                                <MessageSquare size={36} />

                                <h3>
                                    Nenhuma mensagem encontrada
                                </h3>

                                <p>
                                    A campanha ainda não possui mensagens.
                                </p>

                            </div>

                        ) : (

                            <div className="mensagens-lista">

                                {mensagens.map(
                                    (mensagem, index) => {

                                        const messageId =
                                            mensagem?.id ??
                                            mensagem?.message_id ??
                                            index;

                                        const status =
                                            mensagem?.status ||
                                            "PENDENTE";

                                        return (

                                            <div
                                                className="mensagem-item"
                                                key={messageId}
                                            >

                                                <div className="mensagem-content">

                                                    <span>
                                                        {
                                                            mensagem?.texto ||
                                                            mensagem?.mensagem ||
                                                            mensagem?.content ||
                                                            mensagem?.message ||
                                                            "Mensagem sem conteúdo"
                                                        }
                                                    </span>

                                                </div>


                                                <div className="mensagem-actions">

                                                    <span className="mensagem-status">
                                                        {textoStatus(status)}
                                                    </span>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            alterarStatusMensagem(
                                                                mensagem,
                                                                "SENT"
                                                            )
                                                        }
                                                    >
                                                        Enviada
                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            alterarStatusMensagem(
                                                                mensagem,
                                                                "CANCELLED"
                                                            )
                                                        }
                                                    >
                                                        Cancelar
                                                    </button>

                                                </div>

                                            </div>

                                        );
                                    }
                                )}

                            </div>

                        )}

                    </div>

                </div>

            )}

        </div>
    );
}







