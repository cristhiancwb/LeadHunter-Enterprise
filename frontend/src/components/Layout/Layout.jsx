import "../../styles/layout.css";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
    return (
        <div className="layout">

            <Sidebar />

            <div className="main">

                <Header />

                <main className="content">

                    {children}

                </main>

                <Footer />

            </div>

        </div>
    );
}