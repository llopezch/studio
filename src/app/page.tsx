import { ArrowDownUp, BarChart, CircleDollarSign, ChevronRight, RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BankRateCard } from '@/components/bank-rate-card';
import { ExchangeRateChart } from '@/components/exchange-rate-chart';
import { ExchangeRateCalendar } from '@/components/exchange-rate-calendar';
import { createClient } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const mockBanksData = [
    { name: 'BCP', created_at: new Date().toISOString(), buy: 3.751, sell: 3.791, buy_change: 0.002, sell_change: -0.001, logo_url: 'https://s3-ced-uploads-01.s3.amazonaws.com/1735795802665-bcp-2.svg' },
    { name: 'Interbank', created_at: new Date().toISOString(), buy: 3.74, sell: 3.802, buy_change: -0.001, sell_change: 0.003, logo_url: 'https://s3-ced-uploads-01.s3.amazonaws.com/1735795730806-Group%2048095814.svg' },
    { name: 'BBVA', created_at: new Date().toISOString(), buy: 3.745, sell: 3.795, buy_change: 0, sell_change: 0, logo_url: 'https://s3-ced-uploads-01.s3.amazonaws.com/1735789460305-bbva.svg' },
    { name: 'Scotiabank', created_at: new Date().toISOString(), buy: 3.72, sell: 3.82, buy_change: 0.005, sell_change: -0.002, logo_url: 'https://s3-ced-uploads-01.s3.amazonaws.com/1735789333707-scotiabank.svg' },
    { name: 'Banco de la Nación', created_at: new Date().toISOString(), buy: 3.73, sell: 3.78, buy_change: 0.001, sell_change: 0.001, logo_url: 'https://s3-ced-uploads-01.s3.amazonaws.com/1735795814723-Group%2048095815.svg' },
];

export default async function Home() {
  const supabase = createClient();
  let banksData = mockBanksData;
  let connectionError = null;

  if (supabase) {
    const { data, error } = await supabase.from('banks').select('*').order('created_at', { ascending: false });
    if (error) {
      connectionError = error;
    } else if(data && data.length > 0) {
      banksData = data;
    }
  } else {
     connectionError = { message: "Supabase credentials are not configured. Falling back to mock data." };
  }

  const bestBuy = Math.max(...banksData.map(b => b.buy));
  const bestSell = Math.min(...banksData.map(b => b.sell));
  const avgBuy = (banksData.reduce((sum, b) => sum + b.buy, 0) / banksData.length).toFixed(3);
  const difference = (bestSell - bestBuy).toFixed(3);
  const bestBuyBank = banksData.find(b => b.buy === bestBuy)?.name;
  const bestSellBank = banksData.find(b => b.sell === bestSell)?.name;

  return (
    <div className="bg-background text-foreground min-h-screen w-full">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Panel de Tipos de Cambio</h1>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <span>INICIO</span>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="font-semibold text-foreground">PEN / USD • MONEDA</span>
            </div>
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            <RefreshCw className="mr-2" />
            Actualizar
          </Button>
        </header>

        <main className="space-y-8">
          {connectionError && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error de Conexión</AlertTitle>
              <AlertDescription>
                No se pudo conectar con Supabase. Mostrando datos de ejemplo. Por favor, verifica tus credenciales en el archivo .env.local.
                <p className="font-mono text-xs mt-2">{connectionError.message}</p>
              </AlertDescription>
            </Alert>
          )}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mejor Compra</p>
                  <div className="text-2xl font-bold">S/{bestBuy.toFixed(3)}</div>
                  <p className="text-xs text-muted-foreground">{bestBuyBank}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mejor Venta</p>
                  <div className="text-2xl font-bold">S/{bestSell.toFixed(3)}</div>
                  <p className="text-xs text-muted-foreground">{bestSellBank}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-destructive" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Promedio Compra</p>
                  <div className="text-2xl font-bold">S/{avgBuy}</div>
                  <p className="text-xs text-muted-foreground">Entre {banksData.length} bancos</p>
                </div>
                <BarChart className="h-8 w-8 text-muted-foreground" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Diferencia</p>
                  <div className="text-2xl font-bold">S/{difference}</div>
                  <p className="text-xs text-muted-foreground">Entre bancos</p>
                </div>
                <ArrowDownUp className="h-8 w-8 text-muted-foreground" />
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Tipos de Cambio por Banco</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banksData.map((bank) => (
                <BankRateCard key={bank.name} name={bank.name} date={new Date(bank.created_at).toLocaleDateString('es-PE')} buy={bank.buy} sell={bank.sell} buyChange={bank.buy_change} sellChange={bank.sell_change} logoUrl={bank.logo_url} />
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
              <h2 className="text-2xl font-bold mb-4">Tipo de Cambio - SUNAT</h2>
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
