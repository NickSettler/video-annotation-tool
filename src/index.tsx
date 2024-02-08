import React, { Suspense } from 'react';
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
import * as Sentry from '@sentry/react';
import pkg from '../package.json';
import SpinnerFullScreen from './views/common/spinner-full-screen';
import { browserTracingIntegration, replayIntegration } from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_APP_SENTRY_DSN,
  environment: import.meta.env.MODE,
  release: `${pkg.version}`,
  tracePropagationTargets: [
    'localhost',
    /^https:\/\/api\.video\.settler\.tech/,
  ],
  integrations: [
    browserTracingIntegration(),
    replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
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
          <Suspense fallback={<SpinnerFullScreen />}>
            <RouterProvider
              router={router}
              future={{
                // eslint-disable-next-line camelcase
                v7_startTransition: true,
              }}
            />
          </Suspense>
        </ModalProvider>
      </QueryClientProvider>
    </Provider>
  </ThemeProvider>,
  // </React.StrictMode>,
);
