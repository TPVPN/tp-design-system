import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { FlagProvider } from '@tpvpn/ui/components/tp/flag';
import App from '@/app/App';
import { asset } from '@/lib/assets';
import '@/index.css';

// Vite's BASE_URL always ends with "/" ("/" or "/tp-design-system/"); React Router wants no trailing slash.
const basename = import.meta.env.BASE_URL.replace(/\/+$/, '') || '/';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      {/* circle-flags live in public/brand/flags (mirrored from @tpvpn/brand) */}
      <FlagProvider baseUrl={asset('brand/flags/')}>
        <App />
      </FlagProvider>
    </BrowserRouter>
  </StrictMode>,
);
