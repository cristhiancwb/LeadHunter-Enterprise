import api from "./api";


const pipelineService = {


    listarPipeline: async () => {


        const response = await api.get(

            "/pipeline"

        );


        return response.data;

    },





    atualizarStatus: async (

        leadId,

        status

    ) => {


        const response = await api.put(

            `/pipeline/status/${leadId}`,

            {

                status

            }

        );


        return response.data;

    }


};


export default pipelineService;