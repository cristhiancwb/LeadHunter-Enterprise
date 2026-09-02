/* ============================================================
   LeadHunter Enterprise
   API SERVICE
   Versão consolidada e compatível
   ============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const API_URL = API_BASE_URL.replace(/\/+$/, "");


/* ============================================================
   ERRO PADRÃO DA API
============================================================ */

export function criarErroAPI(response, data = null) {
  let mensagem = `Erro HTTP ${response.status}`;

  if (data) {
    if (typeof data === "string") {
      mensagem = data;
    } else if (data.detail) {
      if (Array.isArray(data.detail)) {
        mensagem = data.detail
          .map((item) => {
            if (typeof item === "string") return item;

            const loc = Array.isArray(item.loc)
              ? item.loc.join(" -> ")
              : "";

            const msg = item.msg || "Erro de validação";

            return loc ? `${loc}: ${msg}` : msg;
          })
          .join("; ");
      } else {
        mensagem = String(data.detail);
      }
    } else if (data.message) {
      mensagem = String(data.message);
    } else if (data.mensagem) {
      mensagem = String(data.mensagem);
    } else if (data.error) {
      mensagem = String(data.error);
    }
  }

  const error = new Error(mensagem);

  error.status = response.status;
  error.response = response;
  error.data = data;

  return error;
}


/* ============================================================
   REQUEST PRINCIPAL
============================================================ */

export async function request(endpoint, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    ...rest
  } = options;

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  let requestBody = body;

  if (
    body !== undefined &&
    body !== null &&
    typeof body === "object" &&
    !(body instanceof FormData)
  ) {
    requestHeaders["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  let response;

  try {
    response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: requestBody,
      ...rest,
    });
  } catch (error) {
    const networkError = new Error(
      "Não foi possível conectar com a API."
    );

    networkError.originalError = error;
    networkError.url = url;

    throw networkError;
  }

  const contentType =
    response.headers.get("content-type") || "";

  let data = null;

  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await response.text();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    throw criarErroAPI(response, data);
  }

  return data;
}


/* ============================================================
   MÉTODOS HTTP
============================================================ */

export async function apiGet(endpoint, options = {}) {
  return request(endpoint, {
    ...options,
    method: "GET",
  });
}


export async function apiPost(endpoint, body = null, options = {}) {
  return request(endpoint, {
    ...options,
    method: "POST",
    body,
  });
}


export async function apiPut(endpoint, body = null, options = {}) {
  return request(endpoint, {
    ...options,
    method: "PUT",
    body,
  });
}


export async function apiPatch(endpoint, body = null, options = {}) {
  return request(endpoint, {
    ...options,
    method: "PATCH",
    body,
  });
}


export async function apiDelete(endpoint, options = {}) {
  return request(endpoint, {
    ...options,
    method: "DELETE",
  });
}


/* ============================================================
   HEALTH / API
============================================================ */

export async function verificarAPI() {
  return apiGet("/");
}


export async function buscarInfoAPI() {
  return apiGet("/api");
}


export async function buscarHealth() {
  return apiGet("/health");
}


/* ============================================================
   AUTENTICAÇÃO
============================================================ */

/*
   CONTRATO REAL DO BACKEND:

   POST /auth/auth/login

   Parâmetros obrigatórios na QUERY:

      email
      senha

   Exemplo:

      POST /auth/auth/login?email=usuario%40email.com&senha=123

   IMPORTANTE:
   Não enviar email/senha no JSON body.
*/

export async function login(credentials = {}) {
  const params = new URLSearchParams();

  params.append(
    "email",
    credentials?.email || ""
  );

  params.append(
    "senha",
    credentials?.senha || ""
  );

  const resposta = await apiPost(
    `/auth/auth/login?${params.toString()}`
  );

  if (resposta?.token) {
    localStorage.setItem(
      "leadhunter_token",
      resposta.token
    );
  }

  if (resposta?.access_token) {
    localStorage.setItem(
      "leadhunter_token",
      resposta.access_token
    );
  }

  if (resposta?.user) {
    localStorage.setItem(
      "leadhunter_user",
      JSON.stringify(resposta.user)
    );
  }

  return resposta;
}


export function logout() {
  localStorage.removeItem("leadhunter_token");
  localStorage.removeItem("leadhunter_user");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}


export function obterToken() {
  return (
    localStorage.getItem("leadhunter_token") ||
    localStorage.getItem("token")
  );
}


/* ============================================================
   LEADS
============================================================ */

export async function buscarLeads(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();

  return apiGet(
    `/leads${query ? `?${query}` : ""}`
  );
}


export async function buscarLead(leadId) {
  return apiGet(`/leads/${leadId}`);
}


export async function criarLead(dados) {
  return apiPost("/leads", dados);
}


export async function atualizarLead(leadId, dados) {
  return apiPut(`/leads/${leadId}`, dados);
}


export async function atualizarLeadPatch(leadId, dados) {
  return apiPatch(`/leads/${leadId}`, dados);
}


export async function excluirLead(leadId) {
  return apiDelete(`/leads/${leadId}`);
}


/* ============================================================
   CRM
============================================================ */

export async function buscarCRMLeads(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();

  return apiGet(
    `/crm/leads${query ? `?${query}` : ""}`
  );
}


export async function buscarLeadCRM(leadId) {
  if (
    leadId === undefined ||
    leadId === null ||
    leadId === ""
  ) {
    throw new Error("leadId é obrigatório");
  }

  return apiGet(`/leads/${leadId}`);
}


/* ============================================================
   PIPELINE
============================================================ */

export async function buscarPipeline(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();

  return apiGet(
    `/pipeline/leads${query ? `?${query}` : ""}`
  );
}


export async function buscarResumoPipeline() {
  return apiGet("/pipeline/resumo");
}


export async function buscarPipelineLead(leadId) {
  return apiGet(`/pipeline/leads/${leadId}`);
}


/* ============================================================
   ESTATÍSTICAS DO PIPELINE
============================================================ */

export async function buscarEstatisticasPipeline() {
  try {
    return await apiGet("/pipeline/estatisticas");
  } catch (error) {
    try {
      return await apiGet("/pipeline/resumo");
    } catch {
      return {
        total: 0,
        novo: 0,
        em_contato: 0,
        qualificado: 0,
        proposta: 0,
        negociacao: 0,
        ganho: 0,
        perdido: 0,
      };
    }
  }
}


/* ============================================================
   ATUALIZAÇÃO DE STATUS DO PIPELINE
============================================================ */

export async function atualizarStatusLead(
  leadId,
  novoStatus
) {
  if (
    leadId === undefined ||
    leadId === null ||
    leadId === ""
  ) {
    throw new Error("leadId é obrigatório");
  }

  if (
    novoStatus === undefined ||
    novoStatus === null ||
    novoStatus === ""
  ) {
    throw new Error("novoStatus é obrigatório");
  }

  const status = String(novoStatus).trim();

  return apiPut(
    `/pipeline/status/${leadId}`,
    {
      status,
    }
  );
}


export async function atualizarStatusPipeline(
  leadId,
  novoStatus
) {
  return atualizarStatusLead(
    leadId,
    novoStatus
  );
}


export async function atualizarStatusLeadQuery(
  leadId,
  novoStatus
) {
  if (
    leadId === undefined ||
    leadId === null ||
    leadId === ""
  ) {
    throw new Error("leadId é obrigatório");
  }

  if (
    novoStatus === undefined ||
    novoStatus === null ||
    novoStatus === ""
  ) {
    throw new Error("novoStatus é obrigatório");
  }

  const query = new URLSearchParams({
    status: String(novoStatus).trim(),
  });

  return apiPut(
    `/pipeline/status/${leadId}?${query.toString()}`
  );
}


export async function atualizarStatusLeadLegacy(
  leadId,
  novoStatus
) {
  if (
    leadId === undefined ||
    leadId === null ||
    leadId === ""
  ) {
    throw new Error("leadId é obrigatório");
  }

  if (
    novoStatus === undefined ||
    novoStatus === null ||
    novoStatus === ""
  ) {
    throw new Error("novoStatus é obrigatório");
  }

  return apiPut(
    `/leads/${leadId}/status`,
    {
      status: String(novoStatus).trim(),
    }
  );
}


/* ============================================================
   DASHBOARD
============================================================ */

export async function buscarDashboard(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();

  return apiGet(
    `/dashboard${query ? `?${query}` : ""}`
  );
}


/* ============================================================
   MÉTRICAS
============================================================ */

export async function buscarMetricas(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();

  try {
    return await apiGet(
      `/dashboard/metricas${query ? `?${query}` : ""}`
    );
  } catch (error) {
    try {
      return await apiGet(
        `/dashboard${query ? `?${query}` : ""}`
      );
    } catch {
      return {};
    }
  }
}


/* ============================================================
   ESTATÍSTICAS - COMPATIBILIDADE COM CrmDashboard
============================================================ */

export async function buscarEstatisticas() {
  return apiGet("/dashboard/estatisticas");
}


/* ============================================================
   RANKING
============================================================ */

export async function buscarRanking(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();

  return apiGet(
    `/dashboard/ranking${query ? `?${query}` : ""}`
  );
}


export async function buscarDashboardRanking() {
  return apiGet("/dashboard/ranking");
}


/* ============================================================
   HISTÓRICO / TIMELINE
============================================================ */

export async function criarHistorico(dados) {
  return apiPost(
    "/historico",
    dados
  );
}


export async function buscarHistorico(leadId) {
  return apiGet(`/historico/${leadId}`);
}


export async function buscarHistoricoLead(leadId) {
  return apiGet(`/historico/${leadId}`);
}


export async function buscarTimelineLead(leadId) {
  if (
    leadId === undefined ||
    leadId === null ||
    leadId === ""
  ) {
    throw new Error("leadId é obrigatório");
  }

  try {
    return await apiGet(`/historico/${leadId}`);
  } catch (error) {
    try {
      return await apiGet(`/leads/${leadId}/timeline`);
    } catch {
      return [];
    }
  }
}


/* ============================================================
   FOLLOW-UPS
============================================================ */

export async function buscarFollowups(leadId) {
  return apiGet(
    `/followups/${leadId}`
  );
}


export async function buscarFollowUpsLead(leadId) {
  return buscarFollowups(leadId);
}


export async function criarFollowup(dados) {
  const params = new URLSearchParams();

  params.append(
    "lead_id",
    String(dados.lead_id)
  );

  params.append(
    "tipo",
    dados.tipo || "nota"
  );

  if (
    dados.observacao !== undefined &&
    dados.observacao !== null
  ) {
    params.append(
      "observacao",
      dados.observacao
    );
  }

  if (
    dados.proximo_contato !== undefined &&
    dados.proximo_contato !== null &&
    dados.proximo_contato !== ""
  ) {
    params.append(
      "proximo_contato",
      dados.proximo_contato
    );
  }

  return apiPost(
    `/followups/?${params.toString()}`
  );
}


export async function criarFollowUp(dados) {
  return criarFollowup(dados);
}


export async function atualizarFollowup(
  followupId,
  dados
) {
  const status =
    typeof dados === "string"
      ? dados
      : dados?.status;

  if (!status) {
    throw new Error(
      "Status do follow-up não informado."
    );
  }

  const params = new URLSearchParams();

  params.append(
    "status",
    status
  );

  return apiPatch(
    `/followups/${followupId}/status?${params.toString()}`
  );
}


export async function atualizarFollowUp(
  followupId,
  dados
) {
  return atualizarFollowup(
    followupId,
    dados
  );
}


export async function concluirFollowup(
  followupId
) {
  return atualizarFollowup(
    followupId,
    {
      status: "realizado"
    }
  );
}


export async function cancelarFollowup(
  followupId
) {
  return atualizarFollowup(
    followupId,
    {
      status: "cancelado"
    }
  );
}


export async function excluirFollowup(
  followupId
) {
  return apiDelete(
    `/followups/${followupId}`
  );
}


export async function excluirFollowUp(
  followupId
) {
  return excluirFollowup(
    followupId
  );
}


/* ============================================================
   JOBS
============================================================ */

export async function criarJobGoogleMaps(dados) {
  return apiPost(
    "/jobs/google-maps",
    dados
  );
}


export async function buscarStatusJob(jobId) {
  return apiGet(`/jobs/${jobId}`);
}


export async function buscarJobs(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();

  return apiGet(
    `/jobs${query ? `?${query}` : ""}`
  );
}


/* ============================================================
   CAMPANHAS
============================================================ */

export async function buscarCampanhas() {
  return apiGet("/campaigns");
}


export async function criarCampanha(dados) {
  const statusOriginal =
    String(dados?.status || "RASCUNHO")
      .trim()
      .toUpperCase();

  const statusMap = {
    RASCUNHO: "DRAFT",
    ATIVA: "RUNNING",
    PAUSADA: "PAUSED",
    FINALIZADA: "FINISHED",
    CONCLUIDA: "FINISHED",
    "CONCLUÍDA": "FINISHED",
    CANCELADA: "CANCELLED"
  };

  const payload = {
    ...dados,
    status:
      statusMap[statusOriginal] ||
      statusOriginal
  };

  if (statusOriginal === "ATIVA") {
    payload.ativa = true;
  }

  if (statusOriginal === "PAUSADA") {
    payload.ativa = false;
  }

  return apiPost(
    "/campaigns",
    payload
  );
}


export async function buscarCampanha(campaignId) {
  if (
    campaignId === undefined ||
    campaignId === null ||
    campaignId === ""
  ) {
    throw new Error("campaignId é obrigatório");
  }

  return apiGet(
    `/campaigns/${campaignId}`
  );
}


export async function atualizarCampanha(
  campaignId,
  dados
) {
  if (
    campaignId === undefined ||
    campaignId === null ||
    campaignId === ""
  ) {
    throw new Error("campaignId é obrigatório");
  }

  const statusOriginal =
    String(dados?.status || "")
      .trim()
      .toUpperCase();

  const statusMap = {
    RASCUNHO: "DRAFT",
    ATIVA: "RUNNING",
    PAUSADA: "PAUSED",
    FINALIZADA: "FINISHED",
    CONCLUIDA: "FINISHED",
    "CONCLUÍDA": "FINISHED",
    CANCELADA: "CANCELLED"
  };

  const payload = {
    ...dados
  };

  if (statusOriginal) {
    payload.status =
      statusMap[statusOriginal] ||
      statusOriginal;

    if (statusOriginal === "ATIVA") {
      payload.ativa = true;
    }

    if (statusOriginal === "PAUSADA") {
      payload.ativa = false;
    }
  }

  return apiPut(
    `/campaigns/${campaignId}`,
    payload
  );
}


export async function excluirCampanha(
  campaignId
) {
  if (
    campaignId === undefined ||
    campaignId === null ||
    campaignId === ""
  ) {
    throw new Error("campaignId é obrigatório");
  }

  return apiDelete(
    `/campaigns/${campaignId}`
  );
}


export async function atualizarStatusCampanha(
  campaignId,
  dados
) {
  if (
    campaignId === undefined ||
    campaignId === null ||
    campaignId === ""
  ) {
    throw new Error("campaignId é obrigatório");
  }

  const statusOriginal =
    typeof dados === "string"
      ? dados
      : dados?.status;

  if (!statusOriginal) {
    throw new Error(
      "Status da campanha é obrigatório"
    );
  }

  const statusNormalizado =
    String(statusOriginal)
      .trim()
      .toUpperCase();

  const statusMap = {
    RASCUNHO: "DRAFT",
    ATIVA: "RUNNING",
    PAUSADA: "PAUSED",
    FINALIZADA: "FINISHED",
    CONCLUIDA: "FINISHED",
    "CONCLUÍDA": "FINISHED",
    CANCELADA: "CANCELLED"
  };

  const payload = {
    ...(typeof dados === "string" ? {} : dados),
    status:
      statusMap[statusNormalizado] ||
      statusNormalizado
  };

  if (statusNormalizado === "ATIVA") {
    payload.ativa = true;
  }

  if (statusNormalizado === "PAUSADA") {
    payload.ativa = false;
  }

  return apiPatch(
    `/campaigns/${campaignId}/status`,
    payload
  );
}


/* ============================================================
   MENSAGENS DE CAMPANHA
============================================================ */

export async function gerarMensagensCampanha(
  campaignId,
  dados
) {
  if (
    campaignId === undefined ||
    campaignId === null ||
    campaignId === ""
  ) {
    throw new Error("campaignId é obrigatório");
  }

  if (
    !dados ||
    !Array.isArray(dados.lead_ids)
  ) {
    throw new Error(
      "lead_ids deve ser um array"
    );
  }

  return apiPost(
    `/campaigns/${campaignId}/messages/generate`,
    dados
  );
}


export async function buscarMensagensCampanha(
  campaignId
) {
  if (
    campaignId === undefined ||
    campaignId === null ||
    campaignId === ""
  ) {
    throw new Error("campaignId é obrigatório");
  }

  return apiGet(
    `/campaigns/${campaignId}/messages`
  );
}


export async function atualizarStatusMensagemCampanha(
  messageId,
  dados
) {
  if (
    messageId === undefined ||
    messageId === null ||
    messageId === ""
  ) {
    throw new Error("messageId é obrigatório");
  }

  const payload =
    typeof dados === "string"
      ? { status: dados }
      : dados;

  if (
    !payload ||
    !payload.status
  ) {
    throw new Error(
      "Status da mensagem é obrigatório"
    );
  }

  return apiPatch(
    `/campaigns/messages/${messageId}/status`,
    payload
  );
}


/* ============================================================
   PRODUTOS DE CAMPANHA
============================================================ */

export async function buscarProdutosCampanha(
  campaignId
) {
  if (
    campaignId === undefined ||
    campaignId === null ||
    campaignId === ""
  ) {
    throw new Error("campaignId é obrigatório");
  }

  return apiGet(
    `/campaigns/${campaignId}/products`
  );
}


export async function adicionarProdutoCampanha(
  campaignId,
  dados
) {
  if (
    campaignId === undefined ||
    campaignId === null ||
    campaignId === ""
  ) {
    throw new Error("campaignId é obrigatório");
  }

  if (!dados?.product_id) {
    throw new Error("product_id é obrigatório");
  }

  return apiPost(
    `/campaigns/${campaignId}/products`,
    dados
  );
}


export async function atualizarProdutoCampanha(
  campaignProductId,
  dados
) {
  if (
    campaignProductId === undefined ||
    campaignProductId === null ||
    campaignProductId === ""
  ) {
    throw new Error("campaignProductId é obrigatório");
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
    throw new Error("campaignProductId é obrigatório");
  }

  return apiDelete(
    `/campaigns/products/${campaignProductId}`
  );
}


export async function buscarProdutos(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();

  return apiGet(
    `/products${query ? `?${query}` : ""}`
  );
}


/* ============================================================
   COMUNICAÇÃO
============================================================ */

/*
   MENSAGENS
*/

export async function buscarMensagensLead(leadId) {
  if (
    leadId === undefined ||
    leadId === null ||
    leadId === ""
  ) {
    throw new Error("leadId é obrigatório");
  }

  return apiGet(
    `/communication/messages/${leadId}`
  );
}


export async function criarMensagem(dados) {
  return apiPost(
    "/communication/messages",
    dados
  );
}


export async function atualizarStatusMensagem(
  messageId,
  status
) {
  if (
    messageId === undefined ||
    messageId === null ||
    messageId === ""
  ) {
    throw new Error("messageId é obrigatório");
  }

  if (
    status === undefined ||
    status === null ||
    status === ""
  ) {
    throw new Error("status é obrigatório");
  }

  return apiPut(
    `/communication/messages/${messageId}/status`,
    {
      status: String(status).trim(),
    }
  );
}


/*
   ATIVIDADES
*/

export async function buscarAtividadesLead(leadId) {
  if (
    leadId === undefined ||
    leadId === null ||
    leadId === ""
  ) {
    throw new Error("leadId é obrigatório");
  }

  return apiGet(
    `/communication/activity/${leadId}`
  );
}


export async function criarAtividade(dados) {
  return apiPost(
    "/communication/activity",
    dados
  );
}


/*
   TEMPLATES
*/

export async function buscarTemplates() {
  return apiGet(
    "/communication/templates"
  );
}


export async function criarTemplate(dados) {
  return apiPost(
    "/communication/templates",
    dados
  );
}


export async function atualizarTemplate(
  templateId,
  dados
) {
  if (
    templateId === undefined ||
    templateId === null ||
    templateId === ""
  ) {
    throw new Error("templateId é obrigatório");
  }

  return apiPut(
    `/communication/templates/${templateId}`,
    dados
  );
}


/*
   COMPATIBILIDADE
*/

export async function buscarComunicacoes(params = {}) {
  if (
    params.lead_id !== undefined &&
    params.lead_id !== null
  ) {
    return buscarMensagensLead(
      params.lead_id
    );
  }

  return [];
}


/* ============================================================
   NORMALIZAÇÃO DE LISTAS
============================================================ */

export function normalizarLista(resposta) {
  if (Array.isArray(resposta)) {
    return resposta;
  }

  if (!resposta || typeof resposta !== "object") {
    return [];
  }

  if (Array.isArray(resposta.items)) {
    return resposta.items;
  }

  if (Array.isArray(resposta.leads)) {
    return resposta.leads;
  }

  if (Array.isArray(resposta.data)) {
    return resposta.data;
  }

  if (Array.isArray(resposta.results)) {
    return resposta.results;
  }

  if (Array.isArray(resposta.rows)) {
    return resposta.rows;
  }

  return [];
}


/* ============================================================
   EXPORT DEFAULT
============================================================ */

const api = {
  request,

  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,

  criarErroAPI,

  verificarAPI,
  buscarInfoAPI,
  buscarHealth,

  login,
  logout,
  obterToken,

  buscarLeads,
  buscarLead,
  criarLead,
  atualizarLead,
  atualizarLeadPatch,
  excluirLead,

  buscarCRMLeads,
  buscarLeadCRM,

  buscarPipeline,
  buscarResumoPipeline,
  buscarPipelineLead,
  buscarEstatisticasPipeline,

  atualizarStatusLead,
  atualizarStatusPipeline,
  atualizarStatusLeadQuery,
  atualizarStatusLeadLegacy,

  buscarDashboard,
  buscarMetricas,
  buscarEstatisticas,
  buscarRanking,
  buscarDashboardRanking,

  criarHistorico,
  buscarHistorico,
  buscarHistoricoLead,
  buscarTimelineLead,

  buscarFollowups,
  buscarFollowUpsLead,
  criarFollowup,
  criarFollowUp,
  atualizarFollowup,
  atualizarFollowUp,
  concluirFollowup,
  cancelarFollowup,
  excluirFollowup,
  excluirFollowUp,

  criarJobGoogleMaps,
  buscarStatusJob,
  buscarJobs,

  buscarProdutos,

  buscarCampanhas,
  criarCampanha,
  buscarCampanha,
  atualizarCampanha,
  excluirCampanha,
  atualizarStatusCampanha,

  gerarMensagensCampanha,
  buscarMensagensCampanha,
  atualizarStatusMensagemCampanha,

  buscarProdutosCampanha,
  adicionarProdutoCampanha,
  atualizarProdutoCampanha,
  removerProdutoCampanha,

  buscarMensagensLead,
  criarMensagem,
  atualizarStatusMensagem,

  buscarAtividadesLead,
  criarAtividade,

  buscarTemplates,
  criarTemplate,
  atualizarTemplate,

  buscarComunicacoes,

  normalizarLista,
};

export default api;




