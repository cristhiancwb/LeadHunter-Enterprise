const API_URL = "http://127.0.0.1:8000";



// =====================================
// REQUEST BASE
// =====================================

async function apiRequest(

    endpoint,

    options = {}

) {


    const response = await fetch(

        `${API_URL}${endpoint}`,

        {

            headers: {

                "Content-Type": "application/json"

            },

            ...options

        }

    );



    if (!response.ok) {


        const erro = await response.text();



        throw new Error(

            erro ||

            `Erro API ${response.status}`

        );


    }



    return response.json();

}







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


    const resposta = await apiRequest(

        "/crm/leads"

    );



    return (

        resposta.leads

        ||

        resposta

        ||

        []

    );


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


export async function buscarPipeline() {


    return apiRequest(

        "/pipeline/leads"

    );

}





export async function atualizarStatusLead(

    id,

    status

) {


    return apiRequest(

        `/pipeline/status/${id}`,

        {

            method: "PUT",

            body: JSON.stringify({

                status

            })

        }

    );

}







// =====================================
// HISTÓRICO
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
// IMPORTAÇÃO / JOBS
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
