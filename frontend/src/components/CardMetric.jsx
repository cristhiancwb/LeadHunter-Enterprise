export default function CardMetric({
    titulo,
    valor,
    icone
}) {

    return (

        <div className="
            bg-white
            rounded-xl
            shadow
            p-6
            flex
            items-center
            justify-between
        ">

            <div>

                <p className="
                    text-gray-500
                    text-sm
                ">
                    {titulo}
                </p>


                <h2 className="
                    text-3xl
                    font-bold
                    mt-2
                ">
                    {valor}
                </h2>


            </div>


            <div className="
                text-4xl
            ">
                {icone}
            </div>


        </div>

    )

}