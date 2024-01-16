import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ModalProvider } from './utils/modal/modal-provider';
import { ThemeProvider } from '@mui/material';
import { theme } from './utils/theme/theme';
import {
  createBrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  RouterProvider,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import { routes } from './utils/router';
import { QueryClientProvider } from '@tanstack/react-query';
import { client } from './utils/react-query/client';
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracePropagationTargets: [
    'localhost',
    /^https:\/\/api\.video\.settler\.tech/,
  ],
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      ),
    }),
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,
});

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
