import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";


import Dashboard from "./pages/Dashboard.jsx";


import CRM from "./pages/CRM.jsx";





function App(){



    return (



        <BrowserRouter>



            <Routes>





                <Route

                    path="/"

                    element={

                        <Dashboard />

                    }

                />








                <Route

                    path="/crm"

                    element={

                        <CRM />

                    }

                />









                <Route

                    path="/crm/leads"

                    element={

                        <Navigate

                            to="/crm"

                            replace

                        />

                    }

                />









                <Route

                    path="*"

                    element={

                        <Navigate

                            to="/"

                            replace

                        />

                    }

                />







            </Routes>





        </BrowserRouter>



    );


}



export default App;