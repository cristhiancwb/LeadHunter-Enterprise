const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000");

// ============================================================
// HTTP HELPERS
// ============================================================

async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(localStorage.getItem("access_token")
                ? {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                }
                : {}),
            ...(options.headers || {}),
        },
    };

    const response = await fetch(url, config);

    let data = null;

    const contentType =
        response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    if (!response.ok) {
        const error = new Error(
            typeof data === "string"
                ? data
                : data?.detail ||
                  data?.message ||
                  `HTTP ${response.status}`
        );

        error.status = response.status;
        error.response = data;

        throw error;
    }

    return data;
}

async function apiGet(endpoint) {
    return apiRequest(endpoint, {
        method: "GET",
    });
}

async function apiPost(endpoint, dados = {}) {
    return apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(dados),
    });
}

async function apiPut(endpoint, dados = {}) {
    return apiRequest(endpoint, {
        method: "PUT",
        body: JSON.stringify(dados),
    });
}

async function apiPatch(endpoint, dados = {}) {
    return apiRequest(endpoint, {
        method: "PATCH",
        body: JSON.stringify(dados),
    });
}

async function apiDelete(endpoint) {
    return apiRequest(endpoint, {
        method: "DELETE",
    });
}

const API_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000");



// =====================================
// REQUEST BASE
// =====================================








// =====================================
// DASHBOARD
// =====================================


export async function buscarEstatisticas() {


    return apiRequest(

        "/dashboard/estatisticas"

    );

}



export async function buscarRanking() {


    return apiRequest(

        "/dashboard/ranking"

    );

}







// =====================================
// CRM LEADS
// =====================================


export async function buscarLeads() {

    const resposta = await apiRequest("/pipeline/leads");

    // O endpoint real do Pipeline retorna os leads agrupados
    // por status. O Follow-ups precisa de uma lista unica.
    if (Array.isArray(resposta)) {
        return resposta;
    }

    if (Array.isArray(resposta?.leads)) {
        return resposta.leads;
    }

    const grupos = [
        "NOVO",
        "CONTATO",
        "QUALIFICADO",
        "FECHADO",
        "PERDIDO",
        "EM_CONTATO",
        "EM_NEGOCIACAO"
    ];

    return grupos.flatMap((status) => {
        const lista = resposta?.[status];

        if (!Array.isArray(lista)) {
            return [];
        }

        return lista;
    });
}





// compatibilidade LeadModal

export async function buscarLead(

    id

) {


    return apiRequest(

        `/crm/leads/${id}`

    );

}





export async function buscarLeadPorId(

    id

) {


    return buscarLead(id);

}





export async function criarLead(

    dados

) {


    return apiRequest(

        "/crm/leads",

        {

            method: "POST",

            body: JSON.stringify(dados)

        }

    );

}





export async function salvarLead(

    dados

) {


    return criarLead(dados);

}





export async function atualizarLead(

    id,

    dados

) {


    return apiRequest(

        `/crm/leads/${id}`,

        {

            method: "PUT",

            body: JSON.stringify(dados)

        }

    );

}





export async function excluirLead(

    id

) {


    return apiRequest(

        `/crm/leads/${id}`,

        {

            method: "DELETE"

        }

    );

}







// =====================================
// PIPELINE
// =====================================


export async function buscarPipeline(segmento = "") {

    const parametro = segmento
        ? `?segmento=${encodeURIComponent(segmento)}`
        : "";

    return apiRequest(
        `/pipeline/leads${parametro}`
    );

}





export async function atualizarStatusLead(leadId, status) {
    return apiRequest(`/pipeline/leads/${leadId}/status`, {
        method: "PUT",
        body: JSON.stringify({
            status: status
        })
    });
}







// =====================================
// HISTÃ“RICO
// =====================================


export async function buscarHistorico(

    leadId

) {


    return apiRequest(

        `/historico/${leadId}`

    );

}





export async function criarHistorico(

    dados

) {


    return apiRequest(

        "/historico",

        {

            method: "POST",

            body: JSON.stringify(dados)

        }

    );

}











// =====================================
// CAMPANHAS
// =====================================


/* ============================================================
   FUNCOES DE COMPATIBILIDADE DO FRONTEND
   Recuperadas para manter App / Dashboard / LeadWorkspace
   funcionando sem remover as APIs de Campanhas.
   ============================================================ */

export async function logout() {
    try {
        const resultado = await apiPost(
            "/auth/logout",
            {}
        );

        return resultado;
    } catch (error) {
        console.warn(
            "API: logout remoto indisponível:",
            error
        );

        return {
            sucesso: true,
        };
    }
}

export async function buscarDashboard(params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(
        ([chave, valor]) => {
            if (
                valor !== undefined &&
                valor !== null &&
                valor !== ""
            ) {
                query.set(
                    chave,
                    String(valor)
                );
            }
        }
    );

    const suffix =
        query.toString()
            ? `?${query.toString()}`
            : "";

    return await apiGet(
        `/dashboard/estatisticas${suffix}`
    );
}

export async function buscarDashboardRanking() {
    try {
        return await apiGet("/dashboard/ranking");
    } catch (error) {
        if (error.status === 404) {
            return await apiGet("/dashboard/ranking");
        }

        throw error;
    }
}

export async function buscarLeadCRM(leadId) {
    if (
        leadId === undefined ||
        leadId === null ||
        leadId === ""
    ) {
        throw new Error(
            "leadId é obrigatório."
        );
    }

    return apiGet(
        `/crm/leads/${leadId}`
    );
}

export async function buscarTimelineLead(leadId) {
    if (
        leadId === undefined ||
        leadId === null ||
        leadId === ""
    ) {
        return [];
    }

    return apiGet(
        `/historico/${leadId}`
    );
}

export async function buscarResumoPipeline() {
    return apiGet(
        "/pipeline/resumo"
    );
}

export async function buscarCampanhas() {

    return apiRequest(
        "/campaigns"
    );

}


export async function criarCampanha(
    dados
) {

    return apiRequest(
        "/campaigns",
        {
            method: "POST",
            body: JSON.stringify(dados)
        }
    );

}


export async function atualizarCampanha(
    id,
    dados
) {

    return apiRequest(
        `/campaigns/${id}`,
        {
            method: "PUT",
            body: JSON.stringify(dados)
        }
    );

}


export async function excluirCampanha(
    id
) {

    return apiRequest(
        `/campaigns/${id}`,
        {
            method: "DELETE"
        }
    );

}


export async function atualizarStatusCampanha(
    id,
    status
) {

    return apiRequest(
        `/campaigns/${id}/status`,
        {
            method: "PATCH",
            body: JSON.stringify({
                status
            })
        }
    );

}


export async function buscarMensagensCampanha(
    id
) {

    return apiRequest(
        `/campaigns/${id}/messages`
    );

}


export async function gerarMensagensCampanha(
    id,
    dados
) {

    return apiRequest(
        `/campaigns/${id}/messages/generate`,
        {
            method: "POST",
            body: JSON.stringify(dados)
        }
    );

}


export async function atualizarStatusMensagemCampanha(
    id,
    status
) {

    return apiRequest(
        `/campaigns/messages/${id}/status`,
        {
            method: "PATCH",
            body: JSON.stringify({
                status
            })
        }
    );

}

// =====================================
// FOLLOWUPS
// =====================================


export async function buscarFollowups(leadId) {


    return apiRequest(

        `/followups/${leadId}`

    );

}





export async function buscarFollowupPorId(

    id

) {


    return apiRequest(

        `/followups/${id}`

    );

}





export async function criarFollowup(

    dados

) {


    return apiRequest(

        "/followups",

        {

            method: "POST",

            body: JSON.stringify(dados)

        }

    );

}





// compatibilidade FollowUpPanel

export async function salvarFollowup(

    dados

) {


    return criarFollowup(dados);

}





export async function atualizarFollowup(

    id,

    dados

) {


    return apiRequest(

        `/followups/${id}`,

        {

            method: "PUT",

            body: JSON.stringify(dados)

        }

    );

}





export async function concluirFollowup(

    id

) {


    return apiRequest(

        `/followups/${id}/concluir`,

        {

            method: "PUT"

        }

    );

}





export async function excluirFollowup(

    id

) {


    return apiRequest(

        `/followups/${id}`,

        {

            method: "DELETE"

        }

    );

}







// =====================================
// IMPORTAÃ‡ÃƒO / JOBS
// =====================================


export async function buscarJobs() {


    return apiRequest(

        "/jobs"

    );

}





export async function iniciarImportacao(

    dados

) {


    return apiRequest(

        "/importer",

        {

            method: "POST",

            body: JSON.stringify(dados)

        }

    );

}




export async function login(email, senha) {
    try {
        const resultado = await apiPost(
            "/auth/login",
            {
                email,
                senha,
            }
        );

        if (resultado?.access_token) {
            localStorage.setItem(
                "access_token",
                resultado.access_token
            );
        }

        return resultado;
    } catch (error) {
        throw error;
    }
}


export async function buscarProdutos(opcoes = {}) {
    const query = new URLSearchParams();

    if (
        opcoes &&
        opcoes.ativo !== undefined &&
        opcoes.ativo !== null
    ) {
        query.set("ativo", String(opcoes.ativo));
    }

    const sufixo = query.toString()
        ? `?${query.toString()}`
        : "";

    return apiGet(`/products/${sufixo}`);
}


export async function buscarProdutosCampanha(campanhaId) {
    if (
        campanhaId === undefined ||
        campanhaId === null ||
        campanhaId === ""
    ) {
        throw new Error("campanhaId é obrigatório.");
    }

    return apiGet(
        `/campaigns/${campanhaId}/products`
    );
}


export async function adicionarProdutoCampanha(
    campanhaId,
    dados = {}
) {
    if (
        campanhaId === undefined ||
        campanhaId === null ||
        campanhaId === ""
    ) {
        throw new Error("campanhaId é obrigatório.");
    }

    if (
        !dados ||
        dados.product_id === undefined ||
        dados.product_id === null ||
        dados.product_id === ""
    ) {
        throw new Error("product_id é obrigatório.");
    }

    return apiPost(
        `/campaigns/${campanhaId}/products`,
        dados
    );
}


export async function atualizarProdutoCampanha(
    campaignProductId,
    dados = {}
) {
    if (
        campaignProductId === undefined ||
        campaignProductId === null ||
        campaignProductId === ""
    ) {
        throw new Error(
            "campaignProductId é obrigatório."
        );
    }

    return apiPut(
        `/campaigns/products/${campaignProductId}`,
        dados
    );
}


export async function removerProdutoCampanha(
    campaignProductId
) {
    if (
        campaignProductId === undefined ||
        campaignProductId === null ||
        campaignProductId === ""
    ) {
        throw new Error(
            "campaignProductId é obrigatório."
        );
    }

    return apiDelete(
        `/campaigns/products/${campaignProductId}`
    );
}








