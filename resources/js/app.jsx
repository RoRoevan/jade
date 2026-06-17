import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import Header from './Components/Header';
import Footer from './Components/Footer';
import '../css/app.css';
import { CartProvider } from './Components/CartModal.jsx';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        let page = pages[`./Pages/${name}.jsx`];
        
        page.default.layout = page.default.layout || ((page) => (
            <>
                <Header />
                <main>{page}</main>
                <Footer />
            </>
        ));
        
        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <CartProvider>
                <App {...props} />
            </CartProvider>
        );
    },
    progress: {
        color: '#2d5016',
    },
});