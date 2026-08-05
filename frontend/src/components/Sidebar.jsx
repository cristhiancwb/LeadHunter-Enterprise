import { NavLink } from "react-router-dom";

import {
    LayoutDashboard,
    UsersRound,
    KanbanSquare
} from "lucide-react";


import "./Sidebar.css";



export default function Sidebar(){


    const menus = [

        {
            nome: "Dashboard",
            rota: "/",
            icone: <LayoutDashboard size={20}/>
        },


        {
            nome: "CRM Leads",
            rota: "/crm",
            icone: <UsersRound size={20}/>
        },


        {
            nome: "Pipeline Comercial",
            rota: "/pipeline",
            icone: <KanbanSquare size={20}/>
        }

    ];



    return (


        <aside className="sidebar">


            <div className="logo">


                🚀 LeadHunter


                <span>

                    Enterprise

                </span>


            </div>




            <nav>


                {

                    menus.map((item)=>(


                        <NavLink

                            key={item.rota}

                            to={item.rota}

                            className={

                                ({isActive}) =>

                                isActive

                                ?

                                "menu-item active"

                                :

                                "menu-item"

                            }

                        >


                            {item.icone}


                            <span>

                                {item.nome}

                            </span>


                        </NavLink>


                    ))

                }


            </nav>



        </aside>


    );

}