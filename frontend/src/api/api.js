// ======================================================
// LeadHunter Enterprise 6.0
// Core HTTP Client
// ======================================================

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000";


// ======================================================
// CLASSE DA API
// ======================================================

class ApiClient {

    constructor(baseURL) {

        this.baseURL = baseURL;

    }


    async request(

        endpoint,

        {

            method = "GET",

            body = null,

            headers = {}

        } = {}

    ) {

        const config = {

            method,

            headers: {

                "Content-Type": "application/json",

                ...headers

            }

        };


        if (body !== null) {

            config.body = JSON.stringify(body);

        }


        let response;

        try {

            response = await fetch(

                `${this.baseURL}${endpoint}`,

                config

            );

        }

        catch (error) {

            throw new Error(

                "Não foi possível conectar ao servidor."

            );

        }


        let data = null;

        const contentType = response.headers.get("content-type");

        if (

            contentType &&

            contentType.includes("application/json")

        ) {

            data = await response.json();

        }


        if (!response.ok) {

            throw {

                status: response.status,

                message:

                    data?.detail ||

                    data?.message ||

                    "Erro interno.",

                data

            };

        }


        return data;

    }


    get(endpoint) {

        return this.request(endpoint);

    }


    post(endpoint, body) {

        return this.request(

            endpoint,

            {

                method: "POST",

                body

            }

        );

    }


    put(endpoint, body) {

        return this.request(

            endpoint,

            {

                method: "PUT",

                body

            }

        );

    }


    delete(endpoint) {

        return this.request(

            endpoint,

            {

                method: "DELETE"

            }

        );

    }

}


// ======================================================
// INSTÂNCIA GLOBAL
// ======================================================

const api = new ApiClient(API_URL);

export default api;