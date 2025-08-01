
import * as React from 'react';
import { ArrowDownUp, BarChart, ChevronRight, RefreshCw, TrendingDown, TrendingUp, CircleDollarSign, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BankRateCard } from '@/components/bank-rate-card';
import { ExchangeRateChart } from '@/components/exchange-rate-chart';
import { ExchangeRateCalendar } from '@/components/exchange-rate-calendar';
import { createClient } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { PenUsdChart } from '@/components/pen-usd-chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';


const mockBanksData = [
    { name: 'BCP', created_at: new Date().toISOString(), buy: 3.751, sell: 3.791, buy_change: 0.002, sell_change: -0.001, logo_url: 'https://s3-ced-uploads-01.s3.amazonaws.com/1735795802665-bcp-2.svg' },
    { name: 'Interbank', created_at: new Date().toISOString(), buy: 3.74, sell: 3.802, buy_change: -0.001, sell_change: 0.003, logo_url: 'https://s3-ced-uploads-01.s3.amazonaws.com/1735795730806-Group%2048095814.svg' },
    { name: 'BBVA', created_at: new Date().toISOString(), buy: 3.745, sell: 3.795, buy_change: 0, sell_change: 0, logo_url: 'https://s3-ced-uploads-01.s3.amazonaws.com/1735789460305-bbva.svg' },
    { name: 'Scotiabank', created_at: new Date().toISOString(), buy: 3.72, sell: 3.82, buy_change: 0.005, sell_change: -0.002, logo_url: 'https://s3-ced-uploads-01.s3.amazonaws.com/1735789333707-scotiabank.svg' },
    { name: 'Banco de la Nación', created_at: new Date().toISOString(), buy: 3.73, sell: 3.78, buy_change: 0.001, sell_change: 0.001, logo_url: 'https://s3-ced-uploads-01.s3.amazonaws.com/1735795814723-Group%2048095815.svg' },
];

const generateMockPenUsdData = () => {
    const data = [];
    const now = new Date();
    let rate = 0.2750;
    // Generate data for the last 365 days
    for (let i = 365; i >= 0; i--) { 
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000); // One entry per day
        rate += (Math.random() - 0.5) * 0.0005; 
        data.push({
            created_at: date.toISOString(),
            rate: parseFloat(rate.toFixed(5)),
        });
        // Add more granular data for the last day
        if (i === 0) {
            for (let j = 1; j <= 20; j++) {
                 const recentDate = new Date(now.getTime() - j * 30 * 60 * 1000);
                 rate += (Math.random() - 0.5) * 0.0001;
                 data.push({
                    created_at: recentDate.toISOString(),
                    rate: parseFloat(rate.toFixed(5)),
                 })
            }
        }
    }
    return data.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

const mockPenUsdRates = generateMockPenUsdData();

const logos: Record<string, string> = {
    'BCP': 'https://s3-ced-uploads-01.s3.amazonaws.com/1735795802665-bcp-2.svg',
    'INTERBANCARIO': 'https://s3-ced-uploads-01.s3.amazonaws.com/1735795730806-Group%2048095814.svg',
    'INTERBANK': 'https://s3-ced-uploads-01.s3.amazonaws.com/1735795730806-Group%2048095814.svg',
    'BBVA': 'https://s3-ced-uploads-01.s3.amazonaws.com/1735789460305-bbva.svg',
    'SCOTIABANK': 'https://s3-ced-uploads-01.s3.amazonaws.com/1735789333707-scotiabank.svg',
    'BANCO DE LA NACION': 'https://s3-ced-uploads-01.s3.amazonaws.com/1735795814723-Group%2048095815.svg',
};

interface SupabaseBankData {
  Banco: string;
  Fecha: string; 
  Compra: number;
  Venta: number;
}

interface SupabaseSunatData {
  Fecha: string;
  Compra: number;
  Venta: number;
}

interface SupabasePenUsdData {
  created_at: string;
  rate: number;
}

interface BankData {
  name: string;
  created_at: string;
  buy: number;
  sell: number;
  buy_change: number;
  sell_change: number;
  logo_url: string;
}

export interface SunatData {
  [key: string]: { 
    buy: number;
    sell: number;
  }
}

interface ChartData {
  date: string;
  value: number;
  fullDate: Date;
}

export interface PenUsdChartData {
  date: string; // Short format for X-axis
  fullDateStr: string; // Long format for Tooltip
  value: number;
  fullDate: Date;
}

const isObjectEmpty = (obj: any) => obj && Object.keys(obj).length === 0 && obj.constructor === Object;

const rlsHelpMessage = (tableName: string) => (
  <>
    <span>No se pudieron obtener los datos de la tabla '{tableName}'. Esto usualmente se debe a que la 'Seguridad a Nivel de Fila' (RLS) está habilitada y no hay una política que permita la lectura.</span>
    <br /><br />
    <span>Para solucionarlo, ve al <b>SQL Editor</b> en tu proyecto de Supabase y ejecuta la siguiente consulta para permitir el acceso de lectura público a tu tabla:</span>
    <pre className="mt-2 p-2 bg-gray-800 text-white rounded-md text-sm">
      {`CREATE POLICY "Enable read access for all users" ON "public"."${tableName}" FOR SELECT USING (true);`}
    </pre>
  </>
);

export const toDateKey = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true });
}

interface PenUsdRateWithChange extends SupabasePenUsdData {
    change: number;
}


export default async function Home() {
  const supabase = createClient();
  let banksData: BankData[] = [];
  let chartData: ChartData[] = [];
  let sunatData: SunatData = {};
  let sunatStartDate: string | null = null;
  let connectionError: { message: string | React.ReactNode } | null = null;
  let hasData = false;
  
  let penUsdRates: PenUsdRateWithChange[] = [];
  let penUsdChartData: PenUsdChartData[] = [];
  let latestPenUsdRate: number | null = null;
  let latestPenUsdChange: number | null = null;


  if (supabase) {
    const { data: banksResult, error: banksError } = await supabase
      .from('BANCOS')
      .select('Banco, Fecha, Compra, Venta');
    
    if (banksError && isObjectEmpty(banksError)) {
        connectionError = { message: rlsHelpMessage('BANCOS') };
    } else if (banksError) {
        console.error("Supabase error (BANCOS):", banksError);
        connectionError = { message: `Error al consultar la tabla 'BANCOS': ${banksError.message}` };
    } else if (banksResult && banksResult.length > 0) {
      const allBankData = banksResult as SupabaseBankData[];
      const dataByDate: { [key: string]: SupabaseBankData[] } = allBankData.reduce((acc, item) => {
        const date = item.Fecha;
        if (!acc[date]) { acc[date] = []; }
        acc[date].push(item);
        return acc;
      }, {} as { [key: string]: SupabaseBankData[] });

      const sortedDates = Object.keys(dataByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      const latestDate = sortedDates[0];
      const previousDate = sortedDates[1];

      const latestData = dataByDate[latestDate] || [];
      const previousDataMap: { [key: string]: { Compra: number, Venta: number } } = 
        previousDate ? dataByDate[previousDate].reduce((acc, item) => {
          acc[item.Banco] = { Compra: item.Compra, Venta: item.Venta };
          return acc;
        }, {} as { [key: string]: { Compra: number, Venta: number } }) : {};

      banksData = latestData.map(item => {
        const prev = previousDataMap[item.Banco];
        const buyChange = prev ? item.Compra - prev.Compra : 0;
        const sellChange = prev ? item.Venta - prev.Venta : 0;
        
        return {
          name: item.Banco, created_at: item.Fecha, buy: item.Compra, sell: item.Venta,
          buy_change: buyChange, sell_change: sellChange,
          logo_url: logos[item.Banco.toUpperCase()] || 'https://placehold.co/128x32.png',
        };
      });
      hasData = true;

    } else if (banksResult && banksResult.length === 0 && !connectionError) {
      connectionError = { message: "Conectado a Supabase, pero la tabla 'BANCOS' está vacía. Mostrando datos de ejemplo." };
    }

    if (!connectionError || (connectionError && !connectionError.message.toString().includes('BANCOS'))) {
      const { data: sunatResult, error: sunatError } = await supabase.from('SUNAT').select('Fecha, Compra, Venta');
      
      if (sunatError && isObjectEmpty(sunatError)) {
          connectionError = { message: rlsHelpMessage('SUNAT') };
      } else if (sunatError) {
          console.error("Supabase error (SUNAT):", sunatError);
          connectionError = { message: `Error al consultar la tabla 'SUNAT': ${sunatError.message}` };
      } else if (sunatResult && sunatResult.length > 0) {
          const supabaseSunatData = (sunatResult as SupabaseSunatData[]).sort((a, b) => new Date(a.Fecha).getTime() - new Date(b.Fecha).getTime());
          sunatData = supabaseSunatData.reduce((acc, item) => {
              if (item.Fecha) {
                  const dateKey = toDateKey(new Date(item.Fecha + 'T00:00:00Z'));
                  acc[dateKey] = { buy: item.Compra, sell: item.Venta };
              }
              return acc;
          }, {} as SunatData);

          if (supabaseSunatData[0]?.Fecha) {
              sunatStartDate = toDateKey(new Date(supabaseSunatData[0].Fecha + 'T00:00:00Z'));
          }

          chartData = supabaseSunatData.map(item => {
              const dateObj = new Date(item.Fecha + 'T00:00:00Z');
              return {
                  date: `${dateObj.getUTCDate()} ${dateObj.toLocaleDateString('es-PE', { month: 'short', timeZone: 'UTC' }).replace('.', '')}`,
                  value: item.Compra, fullDate: dateObj,
              };
          }).sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
      } else if (sunatResult && sunatResult.length === 0 && !connectionError) {
          connectionError = { message: "Conectado a Supabase, pero la tabla 'SUNAT' está vacía." };
      }
    }
    
    const rawPenUsdRates = mockPenUsdRates;
    penUsdRates = rawPenUsdRates.map((rate, index) => {
        const previousRate = rawPenUsdRates[index + 1];
        const change = previousRate ? rate.rate - previousRate.rate : 0;
        return { ...rate, change };
    });

  } else {
     connectionError = { message: "Las credenciales de Supabase no están configuradas o son inválidas. Por favor, revisa tu archivo .env.local. Mostrando datos de ejemplo." };
     const rawPenUsdRates = mockPenUsdRates;
     penUsdRates = rawPenUsdRates.map((rate, index) => {
        const previousRate = rawPenUsdRates[index + 1];
        const change = previousRate ? rate.rate - previousRate.rate : 0;
        return { ...rate, change };
     });
  }

  if (penUsdRates.length > 0) {
      penUsdChartData = penUsdRates.map(item => {
          const dateObj = new Date(item.created_at);
          return {
              date: dateObj.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }),
              fullDateStr: `${dateObj.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })} ${dateObj.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`,
              value: item.rate,
              fullDate: dateObj,
          };
      }).sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());

      if (penUsdRates.length >= 2) {
          latestPenUsdRate = penUsdRates[0].rate;
          latestPenUsdChange = penUsdRates[0].rate - penUsdRates[1].rate;
      } else if (penUsdRates.length === 1) {
          latestPenUsdRate = penUsdRates[0].rate;
          latestPenUsdChange = 0;
      }
  }

  if (!hasData && !connectionError) {
      banksData = mockBanksData;
  }

  const bestBuy = banksData.length > 0 ? Math.max(...banksData.map(b => b.buy)) : 0;
  const bestSell = banksData.length > 0 ? Math.min(...banksData.map(b => b.sell)) : 0;
  const avgBuy = banksData.length > 0 ? (banksData.reduce((sum, b) => sum + b.buy, 0) / banksData.length).toFixed(3) : '0.000';
  const difference = banksData.length > 0 ? (bestSell - bestBuy).toFixed(3) : '0.000';
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
              <AlertTitle>Aviso de Conexión</AlertTitle>
              <AlertDescription>
                {connectionError.message}
              </AlertDescription>
            </Alert>
          )}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mejor Compra</p>
                  <div className="text-2xl font-bold">S/{bestBuy > 0 ? bestBuy.toFixed(3) : '---'}</div>
                  <p className="text-xs text-muted-foreground">{bestBuyBank || 'N/A'}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mejor Venta</p>
                  <div className="text-2xl font-bold">S/{bestSell > 0 ? bestSell.toFixed(3) : '---'}</div>
                  <p className="text-xs text-muted-foreground">{bestSellBank || 'N/A'}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-destructive" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Promedio Compra</p>
                  <div className="text-2xl font-bold">S/{avgBuy}</div>
                  <p className="text-xs text-muted-foreground">{banksData.length > 0 ? `Entre ${banksData.length} bancos` : 'N/A'}</p>
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
              {banksData.length > 0 ? banksData.map((bank) => (
                <BankRateCard key={`${bank.name}-${bank.created_at}`} name={bank.name} date={new Date(bank.created_at + 'T00:00:00Z').toLocaleDateString('es-PE', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' })} buy={bank.buy} sell={bank.sell} buyChange={bank.buy_change} sellChange={bank.sell_change} logoUrl={bank.logo_url} />
              )) : (
                 <p className="text-muted-foreground col-span-full">No hay datos de bancos para mostrar.</p>
              )}
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
               <h2 className="text-2xl font-bold mb-4">Evolución del Tipo de Cambio (USD a PEN)</h2>
              <Card>
                <CardContent className="pt-6">
                  <ExchangeRateChart data={chartData} />
                </CardContent>
              </Card>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Tipo de Cambio - SUNAT</h2>
              <Card>
                <CardContent className="p-2">
                  <ExchangeRateCalendar rates={sunatData} startDate={sunatStartDate} />
                </CardContent>
              </Card>
            </div>
          </section>
          
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CircleDollarSign className="text-primary"/>
                    <span>Cambio PEN a USD</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {penUsdRates.length > 0 ? (
                    <div className="flex flex-col">
                      {penUsdRates.slice(0, 8).map((rate, index) => (
                        <React.Fragment key={rate.created_at}>
                          <div className="flex items-center justify-between p-4 hover:bg-muted/50">
                            <div>
                              <div className="font-bold text-base">{formatTime(new Date(rate.created_at))}</div>
                              <div className="text-sm text-muted-foreground">PEN a USD</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-base">{rate.rate.toFixed(4)}</div>
                               <Badge variant='outline' className={cn(
                                "text-xs font-semibold px-2 py-1 mt-1 rounded-md border-transparent",
                                rate.change >= 0 ? 'bg-gray-900 text-white' : 'bg-gray-500 text-white'
                               )}>
                                {rate.change >= 0 ? '+' : ''}{rate.change.toFixed(4)}
                              </Badge>
                            </div>
                          </div>
                          {index < 7 && penUsdRates.length > 1 && <Separator />}
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8 px-4">No hay datos de PEN a USD para mostrar.</p>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                   <CardTitle>Información sobre la conversión de PEN a USD</CardTitle>
                   {penUsdRates.length > 0 && (
                      <CardDescription>
                         <div className="flex items-center gap-2 text-base sm:text-lg">
                            <span className="text-2xl sm:text-3xl font-bold text-foreground">{latestPenUsdRate?.toFixed(4)}</span>
                            <span className="text-muted-foreground">USD por 1 PEN</span>
                            {latestPenUsdChange !== null && (
                                <Badge variant={latestPenUsdChange >= 0 ? "default" : "destructive"} className={`ml-1 text-sm ${latestPenUsdChange >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {latestPenUsdChange >= 0 ? '+' : ''}{latestPenUsdChange.toFixed(4)}
                                </Badge>
                            )}
                         </div>
                      </CardDescription>
                   )}
                </CardHeader>
                <CardContent className="pt-0">
                  <PenUsdChart data={penUsdChartData} />
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
