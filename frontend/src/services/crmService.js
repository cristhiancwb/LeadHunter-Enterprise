import {
    apiGet,
    apiPut,
    apiPost
} from "./api";



// ===============================
// BUSCAR LEAD
// ===============================

export async function buscarLead(id) {

    return await apiGet(
        `/crm/leads/${id}`
    );

}



// ===============================
// ATUALIZAR LEAD
// ===============================

export async function atualizarLead(id, dados) {

    return await apiPut(
        `/crm/leads/${id}`,
        dados
    );

}



// ===============================
// ALTERAR STATUS
// ===============================

export async function atualizarStatusLead(
    id,
    status
) {

    return await apiPut(
        `/pipeline/status/${id}`,
        {
            status
        }
    );

}



// ===============================
// CRIAR HISTÓRICO
// ===============================

export async function criarHistorico(
    id,
    texto
) {

    return await apiPost(
        `/crm/leads/${id}/historico`,
        {
            descricao: texto
        }
    );

}



// ===============================
// TIMELINE
// ===============================

export async function buscarHistorico(id) {

    return await apiGet(
        `/crm/leads/${id}/historico`
    );

}