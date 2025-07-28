
import { ArrowDownUp, BarChart, CircleDollarSign, ChevronRight, RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BankRateCard } from '@/components/bank-rate-card';
import { ExchangeRateChart } from '@/components/exchange-rate-chart';
import { ExchangeRateCalendar } from '@/components/exchange-rate-calendar';

const banksData = [
  {
    name: 'BCP',
    date: '10/07/2024',
    buy: 3.785,
    sell: 3.825,
    buy_change: 0.002,
    sell_change: -0.001,
    logo_url: 'https://play-lh.googleusercontent.com/s_7-Me_t1QSoSJoV425n5nsI3dBA9j906Vv52gLzyzJ4Z4u_t6Ee0M216W7S_2S_Hig=w240-h480-rw',
    created_at: new Date().toISOString()
  },
  {
    name: 'Interbank',
    date: '10/07/2024',
    buy: 3.780,
    sell: 3.830,
    buy_change: -0.001,
    sell_change: 0.003,
    logo_url: 'https://play-lh.googleusercontent.com/4l_bV_4P12aO12NfIeCCQe2G5L-7-yI2jner_J0240J0s82Sj0cz4M0x_2_p_A7-XmE=w240-h480-rw',
    created_at: new Date().toISOString()
  },
  {
    name: 'BBVA',
    date: '10/07/2024',
    buy: 3.790,
    sell: 3.820,
    buy_change: 0.003,
    sell_change: -0.002,
    logo_url: 'https://play-lh.googleusercontent.com/mG-971i9cW2u26P1Rxm_T5_V-owj242Jazr52_f50O9n-yGk2g4xI0e-g_22lSlwse8=w240-h480-rw',
    created_at: new Date().toISOString()
  },
    {
    name: 'Scotiabank',
    date: '10/07/2024',
    buy: 3.775,
    sell: 3.835,
    buy_change: 0.001,
    sell_change: 0.001,
    logo_url: 'https://play-lh.googleusercontent.com/7I-scqC2Unu6U8-y45K-b2jIt0qg-4eQ3vB7qjGih0i28T2iP-p9K5vLh3e00-aO_GE=w240-h480-rw',
    created_at: new Date().toISOString()
  }
];


export default function Home() {
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
