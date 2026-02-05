import Home from './pages/Home';
import Reviews from './pages/Reviews';
import AdminSmsLogs from './pages/AdminSmsLogs';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Reviews": Reviews,
    "AdminSmsLogs": AdminSmsLogs,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};