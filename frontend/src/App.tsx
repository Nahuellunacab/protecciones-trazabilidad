import AppRouter from "./routes/AppRouter";

import OfflineBanner
from "./components/common/OfflineBanner";

function App() {

    return (

        <>

            <OfflineBanner />

            <AppRouter />

        </>
    );
}

export default App;