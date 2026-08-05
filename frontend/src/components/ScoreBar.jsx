import React from "react";


export default function ScoreBar({

    score = 0

}) {


    const valor = Math.min(

        100,

        Math.max(

            0,

            Number(score)

        )

    );



    return (

        <div className="score-wrapper">


            <div className="score-header">

                <span>

                    ⭐ Score

                </span>


                <strong>

                    {valor}

                </strong>

            </div>





            <div className="score-background">


                <div

                    className="score-progress"

                    style={{

                        width: `${valor}%`

                    }}

                />



            </div>



        </div>

    );

}