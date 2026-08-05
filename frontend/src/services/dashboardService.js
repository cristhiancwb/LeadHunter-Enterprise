import api from "../api/api";

const dashboardService = {

    // ==========================
    // DASHBOARD
    // ==========================

    async buscarEstatisticas() {

        return api.get(

            "/dashboard/estatisticas"

        );

    },



    async buscarDashboardComercial() {

        return api.get(

            "/dashboard/comercial"

        );

    },



    async buscarRanking() {

        return api.get(

            "/dashboard/ranking"

        );

    }

};

export default dashboardService;