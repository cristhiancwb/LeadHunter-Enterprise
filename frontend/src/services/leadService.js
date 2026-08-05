import { buscarPipeline } from "./pipelineService";

export async function buscarLeads() {
    return await buscarPipeline();
}

export async function buscarLeadPorId(id) {
    const leads = await buscarPipeline();

    return leads.find(
        lead => lead.id === Number(id)
    );
}