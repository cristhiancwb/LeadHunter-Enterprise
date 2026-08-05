import {
    useEffect,
    useState
} from "react";


import {
    CalendarPlus,
    CheckCircle,
    Trash2,
    Clock
} from "lucide-react";


import {
    buscarFollowups,
    criarFollowup,
    concluirFollowup,
    excluirFollowup
} from "../services/api";


import "./FollowUpPanel.css";



export default function FollowUpPanel({

    leadId

}) {


    const [followups,setFollowups] = useState([]);

    const [observacao,setObservacao] = useState("");

    const [loading,setLoading] = useState(false);

    const [erro,setErro] = useState("");




    async function carregarFollowups(){


        if(!leadId)
            return;


        try{


            const dados = await buscarFollowups(
                leadId
            );


            setFollowups(

                Array.isArray(dados)
                ?
                dados
                :
                []

            );


        }
        catch(error){

            console.error(
                "Erro carregando followups:",
                error
            );

        }

    }






    useEffect(()=>{

        carregarFollowups();

    },[leadId]);






    async function salvarFollowup(){


        if(!observacao.trim())
            return;



        try{

            setLoading(true);
            setErro("");

            await criarFollowup({

                lead_id:leadId,

                titulo:"Retorno comercial",

                observacao:observacao.trim(),

                descricao:observacao.trim()

            });



            setObservacao("");

            await carregarFollowups();


        }
        catch(error){

            console.error(error);
            setErro("Não foi possível criar o retorno. Tente novamente.");

        }
        finally{

            setLoading(false);

        }


    }







    async function finalizar(id){


        await concluirFollowup(
            id
        );


        carregarFollowups();

    }







    async function remover(id){


        await excluirFollowup(
            id
        );


        carregarFollowups();

    }







    return (

        <div className="followup-panel">



            <div className="followup-title">


                <Clock size={20}/>

                Próximos Contatos


            </div>





            <div className="followup-create">


                <textarea

                    value={observacao}

                    onChange={
                        e =>
                        setObservacao(
                            e.target.value
                        )
                    }

                    placeholder="Registrar próximo contato..."

                />



                <button

                    onClick={salvarFollowup}

                    disabled={loading || !observacao.trim()}

                >

                    <CalendarPlus size={16}/>

                    {loading ? "Criando..." : "Criar retorno"}

                </button>


            </div>

            {erro && (
                <p className="followup-error" role="alert">
                    {erro}
                </p>
            )}







            <div className="followup-list">


            {
                followups.length === 0

                ?

                (

                    <div className="empty">

                        Nenhum follow-up cadastrado

                    </div>

                )


                :

                followups.map(item=>(


                    <div

                        className="followup-card"

                        key={item.id}

                    >



                        <div>


                            <strong>

                                {item.concluido ? "CONCLUÍDO" : "PENDENTE"}

                            </strong>


                            <p>

                                {item.observacao}

                            </p>



                        </div>





                        <div className="followup-actions">



                            {
                                !item.concluido

                                &&

                                <button

                                    onClick={
                                        ()=>finalizar(
                                            item.id
                                        )
                                    }

                                >

                                    <CheckCircle size={16}/>

                                </button>

                            }





                            <button

                                onClick={
                                    ()=>remover(
                                        item.id
                                    )
                                }

                            >

                                <Trash2 size={16}/>

                            </button>



                        </div>




                    </div>


                ))

            }


            </div>



        </div>

    );


}
