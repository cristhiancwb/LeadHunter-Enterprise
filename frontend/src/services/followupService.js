import api from "../api/api";

const followupService = {

    // ==========================
    // LISTAR FOLLOWUPS
    // ==========================

    async buscarFollowups(
        leadId
    ) {

        return api.get(
            `/followups/${leadId}`
        );

    },


    // ==========================
    // CRIAR
    // ==========================

    async criarFollowup(
        dados
    ) {


        return api.post(
            "/followups",
            dados
        );

    },


    // ==========================
    // CONCLUIR
    // ==========================

    async concluirFollowup(
        id
    ) {

        return api.put(
            `/followups/${id}/concluir`,
            {}
        );

    },


    // ==========================
    // CANCELAR
    // ==========================

    async cancelarFollowup(
        id
    ) {

        return api.put(
            `/followups/${id}`,
            {
                status: "cancelado"
            }
        );

    },


    // ==========================
    // EXCLUIR
    // ==========================

    async excluirFollowup(
        id
    ) {

        return api.delete(
            `/followups/${id}`
        );

    }

};

export default followupService;


