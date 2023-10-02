import {
    createBrowserRouter,
    Route,
    createRoutesFromElements
} from 'react-router-dom';
import RootLayout from '../Layout/RootLayout';
import Dashboard from '../Pages/Dashboard/Dashboard';

const Router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<RootLayout />}>
            <Route index element={<Dashboard />}></Route>
        </Route>
    )
)

export default Router;