import React from "react";

export default function DaysBadge({

    dias

}) {

    if (dias === 0)

        return <p>⏳ Hoje</p>;

    if (dias === 1)

        return <p>⏳ 1 dia</p>;

    return <p>⏳ {dias} dias</p>;

}