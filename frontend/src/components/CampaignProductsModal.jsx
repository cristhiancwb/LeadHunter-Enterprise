import { useEffect, useState } from "react";

import {
    Plus,
    Pencil,
    Trash2,
    X,
    Save,
    RefreshCw,
    Loader2
} from "lucide-react";

import {
    buscarProdutos,
    buscarProdutosCampanha,
    adicionarProdutoCampanha,
    atualizarProdutoCampanha,
    removerProdutoCampanha
} from "../services/api.js";


function normalizarLista(resposta) {

    if (Array.isArray(resposta)) {
        return resposta;
    }

    if (Array.isArray(resposta?.items)) {
        return resposta.items;
    }

    if (Array.isArray(resposta?.data)) {
        return resposta.data;
    }

    if (Array.isArray(resposta?.produtos)) {
        return resposta.produtos;
    }

    if (
        resposta &&
        typeof resposta === "object"
    ) {
        return [resposta];
    }

    return [];
}


function formatarPreco(valor) {

    if (
        valor === undefined ||
        valor === null ||
        valor === ""
    ) {
        return "—";
    }

    const numero = Number(valor);

    if (Number.isNaN(numero)) {
        return String(valor);
    }

    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


export default function CampaignProductsModal({
    campaign,
    aberto,
    onClose
}) {

    const [produtos, setProdutos] = useState([]);
    const [produtosCampanha, setProdutosCampanha] = useState([]);

    const [produtoId, setProdutoId] = useState("");
    const [precoOferta, setPrecoOferta] = useState("");
    const [quantidadeOferta, setQuantidadeOferta] = useState("");

    const [editandoId, setEditandoId] = useState(null);
    const [editPreco, setEditPreco] = useState("");
    const [editQuantidade, setEditQuantidade] = useState("");
    const [editAtivo, setEditAtivo] = useState(true);

    const [carregando, setCarregando] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    const campaignId =
        campaign?.id ??
        campaign?.campaign_id;

    const produtosDisponiveis = produtos.filter(produto => {
        const produtoIdAtual = Number(produto?.id);

        return !produtosCampanha.some(item =>
            Number(item?.product_id) === produtoIdAtual
        );
    });

    async function carregarDados() {

        if (!campaignId) {
            return;
        }

        try {

            setCarregando(true);
            setErro("");

            const [
                produtosResposta,
                campanhaResposta
            ] = await Promise.all([
                buscarProdutos({
                    ativo: true
                }),
                buscarProdutosCampanha(campaignId)
            ]);

            setProdutos(
                normalizarLista(produtosResposta)
            );

            setProdutosCampanha(
                normalizarLista(campanhaResposta)
            );

        } catch (error) {

            console.error(
                "[CampaignProductsModal] Erro carregando produtos:",
                error
            );

            setErro(
                error?.message ||
                "Não foi possível carregar os produtos."
            );

        } finally {

            setCarregando(false);
        }
    }


    useEffect(() => {

        if (aberto && campaignId) {
            carregarDados();
        }

    }, [aberto, campaignId]);


    async function adicionar() {

        if (!produtoId) {

            setErro(
                "Selecione um produto."
            );

            return;
        }

        try {

            setSalvando(true);
            setErro("");

            const payload = {
                product_id: Number(produtoId),

                preco_oferta:
                    precoOferta === ""
                        ? null
                        : Number(precoOferta),

                quantidade_oferta:
                    quantidadeOferta === ""
                        ? null
                        : Number(quantidadeOferta)
            };

            await adicionarProdutoCampanha(campaignId, payload);

            setProdutoId("");
            setPrecoOferta("");
            setQuantidadeOferta("");

            await carregarDados();

        } catch (error) {

            console.error(
                "[CampaignProductsModal] Erro adicionando:",
                error
            );

            const mensagemErro =
                error?.response?.data?.detail ||
                error?.message ||
                "";

            setErro(
                mensagemErro.includes("já está vinculado") ||
                mensagemErro.includes("já está vinculada")
                    ? "Este produto já está vinculado a esta campanha."
                    : mensagemErro ||
                      "Não foi possível adicionar o produto."
            );

        } finally {

            setSalvando(false);
        }
    }


    function iniciarEdicao(item) {

        setEditandoId(item.id);

        setEditPreco(
            item.preco_oferta ?? ""
        );

        setEditQuantidade(
            item.quantidade_oferta ?? ""
        );

        setEditAtivo(
            item.ativo !== false
        );

        setErro("");
    }


    function cancelarEdicao() {

        setEditandoId(null);
        setEditPreco("");
        setEditQuantidade("");
        setEditAtivo(true);
    }


    async function salvarEdicao(item) {

        try {

            setSalvando(true);
            setErro("");

            await atualizarProdutoCampanha(item.id, {
                    preco_oferta:
                        editPreco === ""
                            ? null
                            : Number(editPreco),

                    quantidade_oferta:
                        editQuantidade === ""
                            ? null
                            : Number(editQuantidade),

                    ativo: editAtivo
                }
            );

            cancelarEdicao();

            await carregarDados();

        } catch (error) {

            console.error(
                "[CampaignProductsModal] Erro atualizando:",
                error
            );

            setErro(
                error?.message ||
                "Não foi possível atualizar o produto."
            );

        } finally {

            setSalvando(false);
        }
    }


    async function remover(item) {

        const nome =
            item?.product?.nome ||
            item?.product?.name ||
            item?.produto?.nome ||
            item?.produto?.name ||
            `produto #${item?.product_id}`;

        const confirmou =
            window.confirm(
                `Remover "${nome}" desta campanha?`
            );

        if (!confirmou) {
            return;
        }

        try {

            setSalvando(true);
            setErro("");

            await removerProdutoCampanha(
                item.id
            );

            await carregarDados();

        } catch (error) {

            console.error(
                "[CampaignProductsModal] Erro removendo:",
                error
            );

            setErro(
                error?.message ||
                "Não foi possível remover o produto."
            );

        } finally {

            setSalvando(false);
        }
    }


    if (!aberto) {
        return null;
    }


    return (
        <div className="campanha-modal-overlay">

            <div className="campanha-modal campanha-produtos-modal">

                <div className="campanha-modal-header">

                    <div>

                        <h2>
                            Produtos da campanha
                        </h2>

                        <p>
                            {campaign?.nome ||
                             campaign?.name ||
                             "Campanha"}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="campanha-modal-close"
                    >
                        <X size={18} />
                    </button>

                </div>


                {erro && (
                    <div className="campanha-alert">
                        {erro}
                    </div>
                )}


                <div className="campanha-produtos-adicionar">

                    <div className="campanha-produtos-section-title">
                        Adicionar produto
                    </div>

                    <div className="campanha-produtos-add-grid">

                        <label>
                            Produto

                            <select
                                value={produtoId}
                                onChange={event =>
                                    setProdutoId(
                                        event.target.value
                                    )
                                }
                                disabled={produtosDisponiveis.length === 0}
                            >

                                <option value="">
                                    {produtosDisponiveis.length === 0
                                        ? "Todos os produtos já estão vinculados"
                                        : "Selecione um produto"}
                                </option>

                                {produtosDisponiveis.map(produto => (

                                    <option
                                        key={produto.id}
                                        value={produto.id}
                                    >
                                        {produto.nome ||
                                         produto.name ||
                                         `Produto #${produto.id}`}
                                    </option>

                                ))}

                            </select>

                        </label>


                        <label>
                            Preço da oferta

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={precoOferta}
                                onChange={event =>
                                    setPrecoOferta(
                                        event.target.value
                                    )
                                }
                                placeholder="Ex.: 79.90"
                            />

                        </label>


                        <label>
                            Quantidade

                            <input
                                type="number"
                                min="1"
                                step="1"
                                value={quantidadeOferta}
                                onChange={event =>
                                    setQuantidadeOferta(
                                        event.target.value
                                    )
                                }
                                placeholder="Ex.: 10"
                            />

                        </label>


                        <button
                            type="button"
                            className="campanha-btn primary"
                            onClick={adicionar}
                            disabled={salvando}
                        >

                            {salvando ? (
                                <Loader2
                                    size={16}
                                    className="campanha-spin"
                                />
                            ) : (
                                <Plus size={16} />
                            )}

                            Adicionar

                        </button>

                    </div>

                </div>


                <div className="campanha-produtos-lista">

                    <div className="campanha-produtos-lista-header">

                        <strong>
                            Produtos vinculados
                        </strong>

                        <button
                            type="button"
                            className="campanha-btn secondary"
                            onClick={carregarDados}
                            disabled={carregando}
                        >

                            {carregando ? (
                                <Loader2
                                    size={15}
                                    className="campanha-spin"
                                />
                            ) : (
                                <RefreshCw size={15} />
                            )}

                            Atualizar

                        </button>

                    </div>


                    {carregando ? (

                        <div className="campanhas-empty">

                            <Loader2
                                size={24}
                                className="campanha-spin"
                            />

                            <span>
                                Carregando produtos...
                            </span>

                        </div>

                    ) : produtosCampanha.length === 0 ? (

                        <div className="campanhas-empty">

                            <span>
                                Nenhum produto vinculado a esta campanha.
                            </span>

                        </div>

                    ) : (

                        <div className="campanhas-table-wrapper">

                            <table className="campanhas-table">

                                <thead>

                                    <tr>
                                        <th>Produto</th>
                                        <th>SKU</th>
                                        <th>Preço</th>
                                        <th>Oferta</th>
                                        <th>Quantidade</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {produtosCampanha.map(item => {

                                        const produto =
                                            item?.product ||
                                            item?.produto ||
                                            produtos.find(
                                                produtoAtual =>
                                                    Number(produtoAtual?.id) ===
                                                    Number(item?.product_id)
                                            ) ||
                                            {};

                                        const nome =
                                            produto?.nome ||
                                            produto?.name ||
                                            `Produto #${item.product_id}`;

                                        const sku =
                                            produto?.sku ||
                                            "—";

                                        const preco =
                                            produto?.preco ??
                                            produto?.price ??
                                            produto?.preco_venda ??
                                            produto?.precoVenda;

                                        if (editandoId === item.id) {

                                            return (
                                                <tr key={item.id}>

                                                    <td>
                                                        <strong>
                                                            {nome}
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {sku}
                                                    </td>

                                                    <td>
                                                        {formatarPreco(preco)}
                                                    </td>

                                                    <td>

                                                        <input
                                                            className="campanha-produto-inline-input"
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={editPreco}
                                                            onChange={event =>
                                                                setEditPreco(
                                                                    event.target.value
                                                                )
                                                            }
                                                        />

                                                    </td>

                                                    <td>

                                                        <input
                                                            className="campanha-produto-inline-input"
                                                            type="number"
                                                            min="1"
                                                            step="1"
                                                            value={editQuantidade}
                                                            onChange={event =>
                                                                setEditQuantidade(
                                                                    event.target.value
                                                                )
                                                            }
                                                        />

                                                    </td>

                                                    <td>

                                                        <label className="campanha-produto-checkbox">

                                                            <input
                                                                type="checkbox"
                                                                checked={editAtivo}
                                                                onChange={event =>
                                                                    setEditAtivo(
                                                                        event.target.checked
                                                                    )
                                                                }
                                                            />

                                                            Ativo

                                                        </label>

                                                    </td>

                                                    <td>

                                                        <div className="campanha-row-actions">

                                                            <button
                                                                type="button"
                                                                className="campanha-action-btn"
                                                                onClick={() =>
                                                                    salvarEdicao(item)
                                                                }
                                                                title="Salvar"
                                                                disabled={salvando}
                                                            >
                                                                <Save size={16} />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="campanha-action-btn"
                                                                onClick={cancelarEdicao}
                                                                title="Cancelar"
                                                            >
                                                                <X size={16} />
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>
                                            );
                                        }


                                        return (

                                            <tr key={item.id}>

                                                <td>
                                                    <strong>
                                                        {nome}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {sku}
                                                </td>

                                                <td>
                                                    {formatarPreco(preco)}
                                                </td>

                                                <td>
                                                    {formatarPreco(
                                                        item.preco_oferta
                                                    )}
                                                </td>

                                                <td>
                                                    {item.quantidade_oferta ??
                                                     "—"}
                                                </td>

                                                <td>
                                                    {item.ativo
                                                        ? "Ativo"
                                                        : "Inativo"}
                                                </td>

                                                <td>

                                                    <div className="campanha-row-actions">

                                                        <button
                                                            type="button"
                                                            className="campanha-action-btn"
                                                            onClick={() =>
                                                                iniciarEdicao(item)
                                                            }
                                                            title="Editar produto"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="campanha-action-btn danger"
                                                            onClick={() =>
                                                                remover(item)
                                                            }
                                                            title="Remover produto"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    })}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>


                <div className="campanha-form-actions">

                    <button
                        type="button"
                        className="campanha-btn secondary"
                        onClick={onClose}
                    >
                        Fechar
                    </button>

                </div>

            </div>

        </div>
    );
}




