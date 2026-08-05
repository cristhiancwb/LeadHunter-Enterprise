export default function KanbanColumn({
    titulo,
    leads
}) {


    return (

        <div className="
            bg-slate-100
            rounded-xl
            p-4
            min-h-[400px]
            w-full
        ">


            <h2 className="
                font-bold
                text-lg
                mb-4
            ">

                {titulo}

            </h2>



            <div className="
                space-y-3
            ">


                {
                    leads.map((lead,index)=>(


                        <div

                        key={index}

                        className="
                            bg-white
                            rounded-lg
                            shadow
                            p-4
                            cursor-pointer
                            hover:shadow-md
                        "

                        >


                            <h3 className="
                                font-semibold
                            ">

                                {lead.empresa}

                            </h3>



                            <div className="
                                mt-2
                                text-sm
                                text-gray-600
                            ">

                                Score:
                                <strong>
                                    {" "}
                                    {lead.score}
                                </strong>


                            </div>



                            <div className="
                                mt-2
                            ">


                                <span className="
                                    text-xs
                                    bg-blue-100
                                    text-blue-700
                                    px-2
                                    py-1
                                    rounded
                                ">

                                    {lead.prioridade}

                                </span>


                            </div>



                        </div>


                    ))

                }


            </div>


        </div>

    )

}