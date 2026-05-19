import { Link, Outlet } from "react-router-dom";

function MainLayout() {

    return (

        <div>

            <nav
                style={{
                    padding: "15px",
                    borderBottom: "1px solid gray",
                    marginBottom: "20px"
                }}
            >

                <Link to="/">
                    Inicio
                </Link>

                {" | "}

                <Link to="/reles">
                    Relés
                </Link>

            </nav>

            <div style={{ padding: "20px" }}>

                <Outlet />

            </div>

        </div>
    );
}

export default MainLayout;