import {
    useEffect,
    useState
} from "react";


import api from "../services/api";

import LeadTable from "../components/LeadTable";

import LeadModal from "../components/LeadModal";



export default function Leads(){


    const [leads,setLeads]
    = useState([]);


    const [leadSelecionado,setLeadSelecionado]
    = useState(null);




    useEffect(()=>{


        async function carregar(){


            try{


                const response =
                await api.get(
                    "/api/dashboard/ranking"
                );


                setLeads(
                    response.data
                );


            }catch(error){

                console.error(error);

            }


        }


        carregar();


    },[]);




    return (

        <div className="p-6">


            <h1 className="
                text-3xl
                font-bold
                mb-6
            ">
                Ranking de Leads
            </h1>



            <LeadTable

                leads={leads}

                selecionarLead={
                    setLeadSelecionado
                }

            />



            <LeadModal

                lead={leadSelecionado}

                fechar={()=>
                    setLeadSelecionado(null)
                }

            />



        </div>

    )

}