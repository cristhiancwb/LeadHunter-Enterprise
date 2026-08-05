import React from "react";

export default function OpportunityValue({

    valor

}) {

    return (

        <p>

            💰 {

                new Intl.NumberFormat(

                    "pt-BR",

                    {

                        style: "currency",

                        currency: "BRL"

                    }

                ).format(valor || 0)

            }

        </p>

    );

}