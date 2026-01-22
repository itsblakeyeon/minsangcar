import Home from './pages/Home';
import Reviews from './pages/Reviews';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Reviews": Reviews,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};