import { useState, useEffect } from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    NavLink,
    Navigate,
    useNavigate
} from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    GitBranch,
    Bell,
    Settings,
    FileText,
    Menu,
    X,
    LogOut,
    Zap
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import Pipeline from "./components/Pipeline/Pipeline";
import LeadWorkspace from "./components/LeadWorkspace/LeadWorkspace";
import Relatorio from "./components/Relatorio";
import CrmDashboard from "./pages/CrmDashboard";
import Followups from "./pages/Followups";
import Campanhas from "./pages/Campanhas";

import Login from "./components/Login/Login";

import {
    logout,
    buscarDashboard,
    buscarDashboardRanking
} from "./services/api.js";

import "./App.css";


/* ============================================================
   CONFIGURAÇÕES
   ============================================================ */

function Configuracoes() {
    return (
        <div
            style={{
                padding: 40,
                textAlign: "center"
            }}
        >
            <h2
                style={{
                    color: "#f1f5f9",
                    marginBottom: 12
                }}
            >
                Configurações
            </h2>

            <p
                style={{
                    color: "#94a3b8"
                }}
            >
                Módulo em desenvolvimento
            </p>
        </div>
    );
}


/* ============================================================
   MENU
   ============================================================ */

const menuItems = [
    {
        icon: LayoutDashboard,
        label: "Dashboard",
        path: "/dashboard"
    },
    {
        icon: Users,
        label: "CRM",
        path: "/crm"
    },
    {
        icon: GitBranch,
        label: "Pipeline",
        path: "/pipeline"
    },
    {
        icon: Zap,
        label: "Campanhas",
        path: "/campanhas"
    },
    {
        icon: Bell,
        label: "Follow-ups",
        path: "/followups"
    },
    {
        icon: FileText,
        label: "Relatório",
        path: "/relatorio"
    },
    {
        icon: Settings,
        label: "Config",
        path: "/config"
    }
];


/* ============================================================
   PROTECTED ROUTE
   ============================================================ */

function ProtectedRoute({ children }) {

    const token =
        localStorage.getItem("access_token");

    if (!token || token.trim() === "") {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return children;
}


/* ============================================================
   PUBLIC ROUTE
   ============================================================ */

function PublicRoute({ children }) {

    const token =
        localStorage.getItem("access_token");

    if (token && token.trim() !== "") {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return children;
}


/* ============================================================
   NORMALIZA DASHBOARD
   ============================================================ */

function normalizarDashboard(dados) {

    if (
        !dados ||
        typeof dados !== "object" ||
        Array.isArray(dados)
    ) {
        return {
            total_leads: 0,
            pipeline: {},
            status: {},
            leads: []
        };
    }

    const pipeline =
        dados.pipeline &&
        typeof dados.pipeline === "object" &&
        !Array.isArray(dados.pipeline)
            ? dados.pipeline
            : {};

    const status =
        dados.status &&
        typeof dados.status === "object" &&
        !Array.isArray(dados.status)
            ? dados.status
            : pipeline;

    const totalLeads =
        Number(
            dados.total_leads ??
            dados.totalLeads ??
            dados.total ??
            0
        );

    return {
        ...dados,

        total_leads:
            Number.isFinite(totalLeads)
                ? totalLeads
                : 0,

        pipeline,

        status,

        leads:
            Array.isArray(dados.leads)
                ? dados.leads
                : []
    };
}


/* ============================================================
   NORMALIZA RANKING
   ============================================================ */

function normalizarRanking(dados) {

    if (Array.isArray(dados)) {
        return dados;
    }

    if (
        dados &&
        Array.isArray(dados.ranking)
    ) {
        return dados.ranking;
    }

    if (
        dados &&
        Array.isArray(dados.items)
    ) {
        return dados.items;
    }

    return [];
}


/* ============================================================
   APP LAYOUT
   ============================================================ */

function AppLayout() {

    const [collapsed, setCollapsed] =
        useState(false);

    const [dashboardDados, setDashboardDados] =
        useState({
            total_leads: 0,
            leads_quentes: 0,
            alta_prioridade: 0,
            fechados: 0,
            taxa_conversao: 0,
            score_medio: 0,
            melhor_lead: null,
            pipeline: {},
            status: {},
            prioridades: {},
            leads: []
        });

    const [ranking, setRanking] =
        useState([]);

    const [dashboardLoading, setDashboardLoading] =
        useState(true);

    const navigate =
        useNavigate();


    /* ========================================================
       LEAD WORKSPACE
       ======================================================== */

    const [leadSelecionado, setLeadSelecionado] =
        useState(null);

        const [
        pipelineRefreshToken,
        setPipelineRefreshToken
    ] = useState(0);

    

    function abrirLead(lead) {

        if (!lead?.id) {

            console.warn(
                "App.jsx: Lead sem ID:",
                lead
            );

            return;
        }

        console.log(
            "App.jsx: Abrindo LeadWorkspace:",
            lead
        );

        setLeadSelecionado(lead);
    }


    function fecharLead() {

        console.log(
            "App.jsx: Fechando LeadWorkspace"
        );

        setLeadSelecionado(null);
    }


    /* ========================================================
       CARREGAR DASHBOARD
       ======================================================== */

    async function carregarDashboard() {

        try {

            setDashboardLoading(true);

            const [
                estatisticasResposta,
                rankingResposta
            ] = await Promise.all([
                buscarDashboard(),
                buscarDashboardRanking()
            ]);


            console.log(
                "================================================"
            );

            console.log(
                "[App] DASHBOARD - RESPOSTA ORIGINAL:"
            );

            console.log(
                estatisticasResposta
            );

            console.log(
                "[App] DASHBOARD - JSON:"
            );

            console.log(
                JSON.stringify(
                    estatisticasResposta,
                    null,
                    2
                )
            );


            console.log(
                "[App] RANKING - RESPOSTA ORIGINAL:"
            );

            console.log(
                rankingResposta
            );

            console.log(
                "[App] RANKING - JSON:"
            );

            console.log(
                JSON.stringify(
                    rankingResposta,
                    null,
                    2
                )
            );


            const dashboardNormalizado =
                normalizarDashboard(
                    estatisticasResposta
                );

            const rankingNormalizado =
                normalizarRanking(
                    rankingResposta
                );


            console.log(
                "[App] DASHBOARD NORMALIZADO:"
            );

            console.log(
                dashboardNormalizado
            );
            console.log(
                "[App] CAMPOS DASHBOARD:",
                Object.keys(dashboardNormalizado || {})
            );

            console.log(
                "[App] STATUS DASHBOARD:",
                dashboardNormalizado?.status
            );

            console.log(
                "[App] PIPELINE DASHBOARD:",
                dashboardNormalizado?.pipeline
            );

            console.log(
                "[App] PRIORIDADES DASHBOARD:",
                dashboardNormalizado?.prioridades
            );


            console.log(
                "[App] PIPELINE:"
            );

            console.log(
                dashboardNormalizado.pipeline
            );


            console.log(
                "[App] TOTAL LEADS:"
            );

            console.log(
                dashboardNormalizado.total_leads
            );


            console.log(
                "[App] RANKING NORMALIZADO:"
            );

            console.log(
                rankingNormalizado
            );

            console.log(
                "[App] PRIMEIRO LEAD RANKING:",
                rankingNormalizado?.[0]
            );

            console.log(
                "[App] CAMPOS PRIMEIRO LEAD:",
                Object.keys(rankingNormalizado?.[0] || {})
            );

            console.log(
                "================================================"
            );


            setDashboardDados(
                dashboardNormalizado
            );

            setRanking(
                rankingNormalizado
            );

        } catch (error) {

            console.error(
                "[App] Erro carregando Dashboard:",
                error
            );

        } finally {

            setDashboardLoading(false);
        }
    }


    /* ========================================================
       INICIALIZAÇÃO
       ======================================================== */

    useEffect(() => {

        carregarDashboard();

    }, []);


    /* ========================================================
       LOGOUT
       ======================================================== */

    const handleLogout = () => {

        try {

            logout();

        } catch (error) {

            console.error(
                "Erro ao executar logout:",
                error
            );
        }

        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        navigate(
            "/login",
            {
                replace: true
            }
        );
    };


    return (

        <div className="app-layout">

            {/* ==================================================
                SIDEBAR
                ================================================== */}

            <aside
                className={
                    `sidebar ${
                        collapsed
                            ? "collapsed"
                            : ""
                    }`
                }
            >

                <div className="sidebar-header">

                    <div className="logo">

                        <div className="logo-icon">
                            <Zap size={20} />
                        </div>

                        {!collapsed && (

                            <div className="logo-text">

                                <span className="logo-title">
                                    LeadHunter
                                </span>

                                <span className="logo-subtitle">
                                    Enterprise
                                </span>

                            </div>

                        )}

                    </div>


                    <button
                        type="button"
                        className="sidebar-toggle"
                        onClick={() =>
                            setCollapsed(
                                value => !value
                            )
                        }
                        aria-label={
                            collapsed
                                ? "Expandir menu"
                                : "Recolher menu"
                        }
                    >

                        {collapsed ? (
                            <Menu size={16} />
                        ) : (
                            <X size={16} />
                        )}

                    </button>

                </div>


                {/* ==================================================
                    NAVEGAÇÃO
                    ================================================== */}

                <nav className="sidebar-nav">

                    {menuItems.map(item => {

                        const Icon =
                            item.icon;

                        return (

                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={
                                    ({ isActive }) =>
                                        `nav-item ${
                                            isActive
                                                ? "active"
                                                : ""
                                        }`
                                }
                            >

                                <Icon size={20} />

                                {!collapsed && (

                                    <span className="nav-label">
                                        {item.label}
                                    </span>

                                )}

                            </NavLink>
                        );
                    })}

                </nav>


                {/* ==================================================
                    RODAPÉ
                    ================================================== */}

                <div className="sidebar-footer">

                    <div className="user-info">

                        <div className="user-avatar">
                            A
                        </div>

                        {!collapsed && (

                            <div className="user-details">

                                <span className="user-name">
                                    Administrador
                                </span>

                                <span className="user-role">
                                    Gerente
                                </span>

                            </div>

                        )}

                    </div>


                    <button
                        type="button"
                        className="logout-btn"
                        onClick={handleLogout}
                        title="Sair"
                    >
                        <LogOut size={18} />
                    </button>

                </div>

            </aside>


            {/* ==================================================
                CONTEÚDO PRINCIPAL
                ================================================== */}

            <main
                className={
                    `main-content ${
                        collapsed
                            ? "expanded"
                            : ""
                    }`
                }
            >

                <Routes>

                    <Route
                        path="/dashboard"
                        element={
                            <Dashboard
                                estatisticas={
                                    dashboardDados
                                }
                                ranking={ranking}
                                carregando={
                                    dashboardLoading
                                }
                                onAtualizar={
                                    carregarDashboard
                                }
                            />
                        }
                    />


                    <Route
                        path="/crm"
                        element={
                            <CrmDashboard />
                        }
                    />


                    <Route
                        path="/campanhas"
                        element={
                            <Campanhas />
                        }
                    />


                    <Route
                        path="/pipeline"
                        element={
                            <>
                                <Pipeline
                                    abrirLead={
                                        abrirLead
                                    }
                                    onLeadClick={
                                        abrirLead
                                    }
                                    refreshToken={
                                        pipelineRefreshToken
                                    }
                                    atualizar={() => {
                                        console.log(
                                            "App.jsx: Pipeline atualizado. Recarregando leads..."
                                        );

                                        setPipelineRefreshToken(
                                            atual => atual + 1
                                        );
                                    }}
                                />

                                {leadSelecionado && (

                                    <LeadWorkspace
                                        leadId={
                                            Number(
                                                leadSelecionado.id
                                            )
                                        }
                                        onClose={
                                            fecharLead
                                        }
                                        onUpdate={
                                            (
                                                leadAtualizado
                                            ) => {

                                                console.log(
                                                    "App.jsx: Lead atualizado:",
                                                    leadAtualizado
                                                );

                                                setLeadSelecionado(
                                                    atual => ({
                                                        ...atual,
                                                        ...leadAtualizado
                                                    })
                                                );

                                                setPipelineRefreshToken(
                                                    atual => atual + 1
                                                );
                                            }
                                        }
                                    />

                                )}

                            </>
                        }
                    />


                    <Route
                        path="/followups"
                        element={
                            <Followups />
                        }
                    />


                    <Route
                        path="/relatorio"
                        element={
                            <Relatorio />
                        }
                    />


                    <Route
                        path="/config"
                        element={
                            <Configuracoes />
                        }
                    />


                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />

                </Routes>

            </main>

        </div>
    );
}


/* ============================================================
   APP
   ============================================================ */

export default function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <AppLayout />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}









