import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ModalProvider } from './utils/modal/modal-provider';
import { ThemeProvider } from '@mui/material';
import { theme } from './utils/theme/theme';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './utils/router';
import { QueryClientProvider } from '@tanstack/react-query';
import { client } from './utils/react-query/client';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const router = createBrowserRouter(routes);

root.render(
  // <React.StrictMode>
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <ModalProvider>
          <RouterProvider
            router={router}
            future={{
              // eslint-disable-next-line camelcase
              v7_startTransition: true,
            }}
          />
        </ModalProvider>
      </QueryClientProvider>
    </Provider>
  </ThemeProvider>,
  // </React.StrictMode>,
);
