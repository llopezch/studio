
import * as React from 'react';
import { ArrowDownUp, BarChart, ChevronRight, RefreshCw, TrendingDown, TrendingUp, ArrowUp, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BankRateCard } from '@/components/bank-rate-card';
import { ExchangeRateCalendar } from '@/components/exchange-rate-calendar';
import { createClient } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { ExchangeRateChart } from '@/components/exchange-rate-chart';
import { PenUsdChart } from '@/components/pen-usd-chart';
import { RecentChangesCard } from '@/components/recent-changes-card';
import { RefreshButton } from '@/components/refresh-button';

export const dynamic = 'force-dynamic';

const mockBanksData = [
    { name: 'BCP', created_at: new Date().toISOString(), buy: 3.751, sell: 3.791, buy_change: 0.002, sell_change: -0.001, logo_url: 'https://s3-ced-uploads-01.s3.amazonaws.com/1735795802665-bcp-2.svg' },
    { name: 'Interbank', created_at: new Date().toISOString(), buy: 3.74, sell: 3.802, buy_change: -0.001, sell_change: 0.003, logo_url: 'https://s3-ced-uploads-01.s3.amazonaws.com/1735795730806-Group%2048095814.svg' },
    { name: 'BBVA', created_at: new Date().toISOString(), buy: 3.745, sell: 3.795, buy_change: 0, sell_change: 0, logo_url: 'https://s3-ced-uploads-01.s3.amazonaws.com/1735789460305-bbva.svg' },
    { name: 'Scotiabank', created_at: new Date().toISOString(), buy: 3.72, sell: 3.82, buy_change: 0.005, sell_change: -0.002, logo_url: 'https://s3-ced-uploads-01.s3.amazonaws.com/1735789333707-scotiabank.svg' },
    { name: 'Banco de la Nación', created_at: new Date().toISOString(), buy: 3.73, sell: 3.78, buy_change: 0.001, sell_change: 0.001, logo_url: 'https://s3-ced-uploads-01.s3.amazonaws.com/1735795814723-Group%2048095815.svg' },
    { name: 'Pichincha', created_at: new Date().toISOString(), buy: 3.75, sell: 3.80, buy_change: 0.001, sell_change: 0.001, logo_url: 'https://s3-ced-uploads-01.s3.amazonaws.com/1753482392626-Banco%20Pichincha%20Logo%20128_25.svg' },
];

const logos: Record<string, string> = {
    'BCP': 'https://s3-ced-uploads-01.s3.amazonaws.com/1735795802665-bcp-2.svg',
    'INTERBANCARIO': 'https://s3-ced-uploads-01.s3.amazonaws.com/1735795730806-Group%2048095814.svg',
    'INTERBANK': 'https://s3-ced-uploads-01.s3.amazonaws.com/1735795730806-Group%2048095814.svg',
    'BBVA': 'https://s3-ced-uploads-01.s3.amazonaws.com/1735789460305-bbva.svg',
    'SCOTIABANK': 'https://s3-ced-uploads-01.s3.amazonaws.com/1735789333707-scotiabank.svg',
    'BANCO DE LA NACION': 'https://s3-ced-uploads-01.s3.amazonaws.com/1735795814723-Group%2048095815.svg',
    'PICHINCHA': 'https://s3-ced-uploads-01.s3.amazonaws.com/1753482392626-Banco%20Pichincha%20Logo%20128_25.svg',
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

export interface SunatChartData {
    date: string;
    value: number;
    fullDate: Date;
}

export interface PenUsdData {
  fechahora: string;
  cierre: number;
}

export interface PenUsdChartData {
  date: string;
  value: number;
  fullDate: Date;
}

export interface RecentConversion {
  id: string;
  time: string;
  value: number;
  change: number;
}

const isRLSError = (error: any): boolean => {
    return error && error.message && (error.message.includes('security policies') || error.message.includes('violates row-level security policy'));
};

const rlsHelpMessage = (tableName: string) => (
    <>
        <span>No se pudieron obtener datos de la tabla <strong>`{tableName}`</strong>. Esto puede ocurrir si la 'Seguridad a Nivel de Fila' (RLS) está activada y no existe una política que permita el acceso.</span>
        <br /><br />
        <span>Para solucionarlo, puedes ir al <strong>Editor SQL</strong> en tu proyecto de Supabase y ejecutar el siguiente comando para crear una política de acceso público de solo lectura:</span>
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


export default async function Home() {
  const supabase = createClient();
  let banksData: BankData[] = [];
  let sunatData: SunatData = {};
  let sunatStartDate: string | null = null;
  let connectionError: { message: string | React.ReactNode } | null = null;
  let hasData = false;
  let recentConversions: RecentConversion[] = [];
  let penToUsdData: PenUsdChartData[] = [];
  
  let sunatChartData: SunatChartData[] = [];


  if (supabase) {
    // Fetch Banks Data
    const { data: banksResult, error: banksError } = await supabase
      .from('BANCOS')
      .select('Banco, Fecha, Compra, Venta');
    
    if (banksError) {
        if (isRLSError(banksError)) {
            connectionError = { message: rlsHelpMessage('BANCOS') };
        } else {
            console.error("Supabase error (BANCOS):", banksError);
            connectionError = { message: `Error al consultar la tabla 'BANCOS': ${banksError.message}.` };
        }
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
    
    // Fetch SUNAT Data
    if (!connectionError) {
        const { data: sunatResult, error: sunatError } = await supabase.from('SUNAT').select('Fecha, Compra, Venta').order('Fecha', { ascending: true });
        
        if (sunatError) {
            if (isRLSError(sunatError)) {
                connectionError = { message: rlsHelpMessage('SUNAT') };
            } else {
                console.error("Supabase error (SUNAT):", sunatError);
                connectionError = { message: `Error al consultar la tabla 'SUNAT': ${sunatError.message}.` };
            }
        } else if (sunatResult && sunatResult.length > 0) {
            const todayInLima = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Lima' }));
            todayInLima.setHours(0, 0, 0, 0);

            const filteredSunatData = (sunatResult as SupabaseSunatData[]).filter(item => {
                const itemDate = new Date(item.Fecha + 'T00:00:00Z');
                return itemDate <= todayInLima;
            });
            
            sunatData = filteredSunatData.reduce((acc, item) => {
                if (item.Fecha) {
                    const dateKey = toDateKey(new Date(item.Fecha + 'T00:00:00Z'));
                    acc[dateKey] = { buy: item.Compra, sell: item.Venta };
                }
                return acc;
            }, {} as SunatData);

            sunatChartData = filteredSunatData.map(item => {
                const dateObj = new Date(item.Fecha + 'T00:00:00Z');
                return {
                    date: `${dateObj.getUTCDate()} ${dateObj.toLocaleDateString('es-PE', { month: 'short', timeZone: 'UTC' }).replace('.', '')}`,
                    value: item.Compra,
                    fullDate: dateObj,
                };
            });

            if (filteredSunatData[0]?.Fecha) {
                sunatStartDate = toDateKey(new Date(filteredSunatData[0].Fecha + 'T00:00:00Z'));
            }
        } else if (sunatResult && sunatResult.length === 0 && !connectionError) {
            connectionError = { message: "Conectado a Supabase, pero la tabla 'SUNAT' está vacía." };
        }
    }
    
    // Fetch Recent Conversions from 'update_30min' and 'actualizaciones_panel'
    if (!connectionError) {
        const { data: recentResult, error: recentError } = await supabase
          .from('update_30min')
          .select('fechahora, cierre')
          .order('fechahora', { ascending: false })
          .limit(7);
          
        const { data: updatesResult, error: updatesError } = await supabase
          .from('actualizaciones_panel')
          .select('fechaahora')
          .order('fechaahora', { ascending: false })
          .limit(7);

        if (recentError) {
            const tableName = 'update_30min';
            if (isRLSError(recentError)) {
                connectionError = { message: rlsHelpMessage(tableName) };
            } else {
                console.error(`Supabase error (${tableName}):`, recentError);
                connectionError = { message: `Error al consultar la tabla '${tableName}': ${recentError.message}.` };
            }
        } else if (updatesError) {
            const tableName = 'actualizaciones_panel';
            if (isRLSError(updatesError)) {
                connectionError = { message: rlsHelpMessage(tableName) };
            } else {
                 console.error(`Supabase error (${tableName}):`, updatesError);
                 connectionError = { message: `Error al consultar la tabla '${tableName}': La columna 'fechaahora' podría no existir o el RLS está activado.` };
            }
        } else if (recentResult && recentResult.length > 0 && updatesResult && updatesResult.length === 0 && !connectionError) {
            connectionError = { message: "Conectado a Supabase, pero la tabla 'actualizaciones_panel' está vacía. La tarjeta 'Cambios Recientes' usará las fechas de 'update_30min'." };
        }
        
        if (recentResult && recentResult.length > 0) {
            const updateTimes = updatesResult ? updatesResult.map(u => u.fechaahora) : [];
            
            recentConversions = recentResult.slice(0, 7).map((item, index, arr) => {
                const currentValue = item.cierre;
                const previousValue = arr[index + 1] ? arr[index + 1].cierre : currentValue;
                const change = currentValue - previousValue;
                
                // Assign a corresponding update time, fallback to the original time if not available
                const updateTime = updateTimes[index] || item.fechahora;
                
                return { id: item.fechahora, time: updateTime, value: currentValue, change };
            });
        }
    }

    // Fetch Annual Data from 'updateanual'
    if (!connectionError) {
        const { data: annualResult, error: annualError } = await supabase
            .from('updateanual')
            .select('fechahora, cierre')
            .order('fechahora', { ascending: true });

        if (annualError) {
            const tableName = 'updateanual';
            if (isRLSError(annualError)) {
                connectionError = { message: rlsHelpMessage(tableName) };
            } else {
                console.error(`Supabase error (${tableName}):`, annualError);
                connectionError = { message: `Error al consultar la tabla '${tableName}': ${annualError.message}.` };
            }
        } else if (annualResult && annualResult.length > 0) {
            penToUsdData = annualResult.map(item => {
                const dateObj = new Date(item.fechahora);
                return {
                    date: `${dateObj.getUTCDate()} ${dateObj.toLocaleDateString('es-PE', { month: 'short', timeZone: 'UTC' }).replace('.', '')}`,
                    value: item.cierre,
                    fullDate: dateObj
                };
            });
        }
    }
  } else {
     connectionError = { message: "Las credenciales de Supabase no están configuradas o son inválidas. Por favor, revisa tu archivo .env.local. Mostrando datos de ejemplo." };
  }

  if (!hasData) {
      banksData = mockBanksData;
  }

  const bestBuy = banksData.length > 0 ? Math.max(...banksData.map(b => b.buy)) : 0;
  const bestSell = banksData.length > 0 ? Math.min(...banksData.map(b => b.sell)) : 0;
  const avgBuy = banksData.length > 0 ? (banksData.reduce((sum, b) => sum + b.buy, 0) / banksData.length).toFixed(3) : '0.000';
  const difference = banksData.length > 0 ? (bestSell - bestBuy).toFixed(3) : '0.000';
  const bestBuyBank = banksData.find(b => b.buy === bestBuy)?.name;
  const bestSellBank = banksData.find(b => b.sell === bestSell)?.name;

  const latestPenToUsd = penToUsdData[penToUsdData.length - 1]?.value || 0;
  const previousPenToUsd = penToUsdData[penToUsdData.length - 2]?.value || 0;
  const penToUsdChange = latestPenToUsd - previousPenToUsd;
  const penToUsdChangePercent = previousPenToUsd !== 0 ? (penToUsdChange / previousPenToUsd) * 100 : 0;
  
  const recentConversionsList = recentConversions.slice(0, 7);

  return (
    <div className="bg-background text-foreground min-h-screen w-full">
      <header className="bg-[hsl(var(--header-background))] text-[hsl(var(--header-foreground))] py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
              <div className="flex items-center text-sm mb-2 text-white">
                <span className="font-semibold text-[hsl(var(--accent-green))]">INICIO</span>
                <ChevronRight className="h-4 w-4 mx-1" />
                <span className="font-semibold">PEN / USD • MONEDA</span>
              </div>
              <h1 className="text-3xl font-bold font-headline text-white">Panel de Tipos de Cambio</h1>
          </div>
          <RefreshButton />
        </div>
      </header>

      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
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
                <TrendingUp className="h-8 w-8 text-green-500" />
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
            <h2 className="text-2xl font-bold mb-4 font-headline">Tipos de Cambio por Banco</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
              {banksData.length > 0 ? banksData.map((bank) => (
                <BankRateCard key={`${bank.name}-${bank.created_at}`} name={bank.name} date={new Date(bank.created_at + 'T00:00:00Z').toLocaleDateString('es-PE', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' })} buy={bank.buy} sell={bank.sell} buyChange={bank.buy_change} sellChange={bank.sell_change} logoUrl={bank.logo_url} />
              )) : (
                 <p className="text-muted-foreground col-span-full">No hay datos de bancos para mostrar.</p>
              )}
            </div>
          </section>
          
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4 font-headline">Evolución del Tipo de Cambio (USD a PEN)</h2>
              <Card>
                <CardContent className="pt-6">
                  <ExchangeRateChart data={sunatChartData} />
                </CardContent>
              </Card>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 font-headline">Tipo de Cambio - SUNAT</h2>
              <Card>
                <CardContent className="p-2">
                  <ExchangeRateCalendar rates={sunatData} startDate={sunatStartDate} />
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
             <RecentChangesCard conversions={recentConversionsList} />
            <div className="lg:col-span-2">
              <Card>
                  <CardHeader>
                    <CardTitle className="font-headline">Histórico PEN/USD</CardTitle>
                    <CardDescription>
                        {latestPenToUsd > 0 ? 'Último valor registrado frente al día anterior.' : 'No hay datos suficientes para mostrar.'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2 pr-6 pb-6">
                   {penToUsdData.length > 0 ? (
                    <>
                     {latestPenToUsd > 0 && 
                        <div className="p-4 pt-0">
                            <div className="flex items-baseline gap-4">
                                <div className="text-3xl font-bold">
                                   {latestPenToUsd.toFixed(4)}
                                   <span className="text-sm font-normal text-muted-foreground ml-2">USD</span>
                                </div>
                                <div className="flex items-center text-sm">
                                   <span className={`flex items-center font-semibold ${penToUsdChange >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                                       <ArrowUp className={`h-4 w-4 mr-1 ${penToUsdChange < 0 && 'rotate-180'}`} />
                                       {penToUsdChange.toFixed(4)} ({penToUsdChangePercent.toFixed(2)}%)
                                   </span>
                                </div>
                            </div>
                        </div>
                     }
                     <PenUsdChart data={penToUsdData} />
                    </>
                    ) : (
                      <div className="h-[400px] flex items-center justify-center">
                        <p className="text-muted-foreground text-center p-6">No hay datos para mostrar el gráfico.</p>
                      </div>
                    )}
                  </CardContent>
              </Card>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
