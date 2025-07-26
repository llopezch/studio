import { ArrowDownUp, BarChart, CalendarDays, RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BankRateCard } from '@/components/bank-rate-card';
import { ExchangeRateChart } from '@/components/exchange-rate-chart';
import { ExchangeRateCalendar } from '@/components/exchange-rate-calendar';

async function getExchangeRate() {
  const mockData = {
    result: 'success',
    time_last_update_unix: Math.floor(Date.now() / 1000) - 3600,
    base_code: 'USD',
    conversion_rates: {
      PEN: 3.758,
    },
  };
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockData;
}

const banksData = [
  { name: 'Interbank', logo: 'https://placehold.co/100x30.png?text=Interbank', buy: 3.750, sell: 3.765, buyChange: -0.012, sellChange: 0.005, date: '15/01/24 14:30' },
  { name: 'BCP', logo: 'https://placehold.co/100x30.png?text=BCP', buy: 3.745, sell: 3.770, buyChange: -0.017, sellChange: 0.002, date: '15/01/24 14:25' },
  { name: 'BBVA', logo: 'https://placehold.co/100x30.png?text=BBVA', buy: 3.748, sell: 3.768, buyChange: 0.002, sellChange: 0.001, date: '15/01/24 14:35' },
  { name: 'Scotiabank', logo: 'https://placehold.co/100x30.png?text=Scotiabank', buy: 3.752, sell: 3.772, buyChange: 0.008, sellChange: -0.004, date: '15/01/24 14:20' },
  { name: 'Banco de la Nación', logo: 'https://placehold.co/100x30.png?text=Banco+Nacion', buy: 3.755, sell: 3.765, buyChange: -0.010, sellChange: -0.013, date: '15/01/24 14:28' },
];

export default async function Home() {
  const data = await getExchangeRate();
  const bestBuy = Math.max(...banksData.map(b => b.buy));
  const bestSell = Math.min(...banksData.map(b => b.sell));
  const avgBuy = (banksData.reduce((sum, b) => sum + b.buy, 0) / banksData.length).toFixed(3);
  const difference = (bestSell - bestBuy).toFixed(3);
  const bestBuyBank = banksData.find(b => b.buy === bestBuy)?.name;
  const bestSellBank = banksData.find(b => b.sell === bestSell)?.name;

  return (
    <div className="bg-background text-foreground min-h-screen w-full">
      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Panel de Tipos de Cambio</h1>
            <p className="text-muted-foreground">Monitoreo en tiempo real del dólar estadounidense</p>
          </div>
          <Button variant="outline">
            <RefreshCw className="mr-2" />
            Actualizar
          </Button>
        </header>

        <main className="space-y-8">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Mejor Compra</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">S/{bestBuy.toFixed(3)}</div>
                <p className="text-xs text-muted-foreground">{bestBuyBank}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Mejor Venta</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">S/{bestSell.toFixed(3)}</div>
                <p className="text-xs text-muted-foreground">{bestSellBank}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Promedio Compra</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">S/{avgBuy}</div>
                <p className="text-xs text-muted-foreground">Entre {banksData.length} bancos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Diferencia</CardTitle>
                <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">S/{difference}</div>
                <p className="text-xs text-muted-foreground">Entre bancos</p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Tipos de Cambio por Banco</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banksData.map((bank) => (
                <BankRateCard key={bank.name} {...bank} />
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
               <h2 className="text-2xl font-bold mb-4">Evolución del Tipo de Cambio</h2>
              <Card>
                <CardContent className="pt-6">
                  <ExchangeRateChart />
                </CardContent>
              </Card>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Calendario de Tipos de Cambio</h2>
              <Card>
                <CardContent className="p-2">
                  <ExchangeRateCalendar />
                </CardContent>
              </Card>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
