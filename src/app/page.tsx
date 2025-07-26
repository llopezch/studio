import { TrendingDown, TrendingUp } from 'lucide-react';
import { RateCard } from '@/components/rate-card';
import { InfoPanel } from '@/components/info-panel';

async function getExchangeRate() {
  // In a real app, you would fetch this from a reliable API
  // const res = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/USD`, { next: { revalidate: 3600 } });
  // const data = await res.json();
  // For this example, we'll use mocked data.
  const mockData = {
    result: 'success',
    time_last_update_unix: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    base_code: 'USD',
    conversion_rates: {
      PEN: 3.758,
    },
  };
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockData;
}

export default async function Home() {
  const data = await getExchangeRate();
  const midRate = data.conversion_rates.PEN;

  // Simulate a buy/sell spread
  const buyRate = (midRate * 0.985).toFixed(3);
  const sellRate = (midRate * 1.015).toFixed(3);

  const lastUpdated = new Date(data.time_last_update_unix * 1000).toLocaleString('es-PE', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Lima',
  });

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl text-center">
        <header className="mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-primary">
            SolValor
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Tipo de Cambio del Dólar (USD) a Sol (PEN)
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RateCard
            type="Compra"
            rate={buyRate}
            Icon={TrendingDown}
          />
          <RateCard
            type="Venta"
            rate={sellRate}
            Icon={TrendingUp}
          />
        </div>

        <InfoPanel
          source="ExchangeRate-API.com (simulado)"
          lastUpdated={lastUpdated}
        />
      </div>
    </main>
  );
}
