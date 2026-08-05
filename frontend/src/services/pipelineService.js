import {
    apiGet,
    apiPut
} from "./api";



const pipelineService = {



    async buscarPipeline(){


        return apiGet(

            "/pipeline/leads"

        );


    },





    async atualizarStatus(

        leadId,

        status

    ){


        return apiPut(


            `/pipeline/status/${leadId}`,


            {

                status: status

            }


        );


    }



};



export default pipelineService;