import React from 'react';
import ReactDOM from 'react-dom/client';
import {Toaster} from "react-hot-toast";
import {setupStore} from "./store/store";
import {Provider} from "react-redux";
import App from "./App";

const store = setupStore();

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
                className: '',
                duration: 5000,
                style: {
                    background: '#363636',
                    color: '#fff',
                },

                success: {
                    duration: 3000
                },
            }}
        />
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>
);
