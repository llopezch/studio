import { ArrowDownUp, BarChart, CalendarDays, RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BankRateCard } from '@/components/bank-rate-card';
import { ExchangeRateChart } from '@/components/exchange-rate-chart';
import { ExchangeRateCalendar } from '@/components/exchange-rate-calendar';

const banksData = [
  { name: 'Interbank', buy: 3.510, sell: 3.605, buyChange: -0.019, sellChange: -0.005, date: '15/01/24 14:30', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Interbank_logo.svg/320px-Interbank_logo.svg.png' },
  { name: 'BCP', buy: 3.505, sell: 3.610, buyChange: -0.017, sellChange: 0.002, date: '15/01/24 14:25', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/BCP_logo.svg/2560px-BCP_logo.svg.png' },
  { name: 'BBVA', buy: 3.508, sell: 3.608, buyChange: 0.002, sellChange: 0.001, date: '15/01/24 14:35', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/BBVA_2019.svg/2560px-BBVA_2019.svg.png' },
  { name: 'Scotiabank', buy: 3.512, sell: 3.612, buyChange: 0.008, sellChange: -0.004, date: '15/01/24 14:20', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Scotiabank_logo.svg/2560px-Scotiabank_logo.svg.png' },
  { name: 'Banco de la Nación', buy: 3.515, sell: 3.615, buyChange: -0.010, sellChange: -0.013, date: '15/01/24 14:28', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Banco_de_la_Naci%C3%B3n_logo.svg/2560px-Banco_de_la_Naci%C3%B3n_logo.svg.png' },
];

export default async function Home() {
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
                <BankRateCard key={bank.name} name={bank.name} date={bank.date} buy={bank.buy} sell={bank.sell} buyChange={bank.buyChange} sellChange={bank.sellChange} logoUrl={bank.logoUrl} />
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
