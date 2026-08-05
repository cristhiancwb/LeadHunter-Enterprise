import { useEffect, useState } from "react";
import { buscarRanking } from "../services/api";


export default function RankingTable(){

    const [ranking,setRanking] = useState([]);


    useEffect(()=>{

        buscarRanking()
        .then(data=>{
            setRanking(data);
        })
        .catch(error=>{
            console.error(
                "Erro ao carregar ranking",
                error
            );
        });

    },[]);



    return (

        <div className="ranking-card">

            <h2>
                🏆 Ranking de Leads
            </h2>


            <table>

                <thead>

                    <tr>
                        <th>#</th>
                        <th>Empresa</th>
                        <th>Cidade</th>
                        <th>Score</th>
                        <th>Prioridade</th>
                        <th>Status</th>
                    </tr>

                </thead>


                <tbody>

                {
                    ranking.map((lead)=>(

                        <tr key={lead.id}>

                            <td>
                                {lead.posicao}
                            </td>

                            <td>
                                {lead.empresa}
                            </td>

                            <td>
                                {lead.cidade}
                            </td>

                            <td>
                                {lead.score}
                            </td>

                            <td>
                                {lead.prioridade}
                            </td>

                            <td>
                                {lead.status}
                            </td>

                        </tr>

                    ))
                }

                </tbody>

            </table>


        </div>

    );

}