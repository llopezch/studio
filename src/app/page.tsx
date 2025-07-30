
import { ArrowDownUp, BarChart, ChevronRight, RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';
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

const logos: Record<string, string> = {
    'BCP': 'https://s3-ced-uploads-01.s3.amazonaws.com/1735795802665-bcp-2.svg',
    'INTERBANCARIO': 'https://s3-ced-uploads-01.s3.amazonaws.com/1735795730806-Group%2048095814.svg',
    'INTERBANK': 'https://s3-ced-uploads-01.s3.amazonaws.com/1735795730806-Group%2048095814.svg',
    'BBVA': 'https://s3-ced-uploads-01.s3.amazonaws.com/1735789460305-bbva.svg',
    'SCOTIABANK': 'https://s3-ced-uploads-01.s3.amazonaws.com/1735789333707-scotiabank.svg',
    'BANCO DE LA NACION': 'https://s3-ced-uploads-01.s3.amazonaws.com/1735795814723-Group%2048095815.svg',
};

// Interface for data coming from Supabase
interface SupabaseBankData {
  Banco: string;
  Fecha: string; // YYYY-MM-DD
  Compra: number;
  Venta: number;
}

interface SupabaseSunatData {
  Fecha: string; 
  Compra: number;
  Venta: number;
}

// Interface for data used in the components
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
  [key: string]: { // Key is YYYY-MM-DD
    buy: number;
    sell: number;
  }
}

interface ChartData {
  date: string;
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
  // Formato YYYY-MM-DD consistente
  return date.toISOString().split('T')[0];
}

export default async function Home() {
  const supabase = createClient();
  let banksData: BankData[] = [];
  let chartData: ChartData[] = [];
  let sunatData: SunatData = {};
  let sunatStartDate: string | null = null;
  let connectionError: { message: string | React.ReactNode } | null = null;
  let hasData = false;

  if (supabase) {
    // Fetch Banks Data
    const { data: banksResult, error: banksError } = await supabase
      .from('BANCOS')
      .select('Banco, Fecha, Compra, Venta');
    
    if (banksError) {
      console.error("Supabase error (BANCOS):", banksError);
      if (isObjectEmpty(banksError)) {
        connectionError = { message: rlsHelpMessage('BANCOS') };
      } else {
        connectionError = { message: `Error al consultar la tabla 'BANCOS': ${banksError.message}` };
      }
    } else if (banksResult && banksResult.length > 0) {
      const supabaseData = banksResult as SupabaseBankData[];
      banksData = supabaseData.map(item => ({
        name: item.Banco,
        created_at: item.Fecha,
        buy: item.Compra,
        sell: item.Venta,
        buy_change: 0, 
        sell_change: 0,
        logo_url: logos[item.Banco.toUpperCase()] || 'https://placehold.co/128x32.png',
      }));
      hasData = true;

      const dailyAverages: { [key: string]: { sum: number, count: number, dateObj: Date } } = {};
      
      supabaseData.forEach(item => {
        const dateKey = item.Fecha;
        const dateObj = new Date(dateKey + 'T00:00:00Z'); // Ensure UTC parsing
        if (!dailyAverages[dateKey]) {
          dailyAverages[dateKey] = { sum: 0, count: 0, dateObj: dateObj };
        }
        dailyAverages[dateKey].sum += (item.Compra + item.Venta) / 2;
        dailyAverages[dateKey].count++;
      });
      
      chartData = Object.keys(dailyAverages).map(dateKey => {
        const avg = dailyAverages[dateKey].sum / dailyAverages[dateKey].count;
        const dateObj = dailyAverages[dateKey].dateObj;
        return {
          date: `${dateObj.getUTCDate()} ${dateObj.toLocaleDateString('es-PE', { month: 'short', timeZone: 'UTC' }).replace('.', '')}`,
          value: parseFloat(avg.toFixed(4)),
          fullDate: dateObj,
        }
      }).sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());

    } else if (banksResult && banksResult.length === 0 && !connectionError) {
      connectionError = { message: "Conectado a Supabase, pero la tabla 'BANCOS' está vacía. Mostrando datos de ejemplo." };
    }

    // Fetch SUNAT data only if there is no previous critical error
    if (!connectionError) {
      const { data: sunatResult, error: sunatError } = await supabase
        .from('SUNAT')
        .select('Fecha, Compra, Venta');
      
      console.log('Datos SUNAT desde Supabase:', sunatResult);

      if (sunatError) {
          console.error("Supabase error (SUNAT):", sunatError);
          if (isObjectEmpty(sunatError)) {
              connectionError = { message: rlsHelpMessage('SUNAT') };
          } else {
              connectionError = { message: `Error al consultar la tabla 'SUNAT': ${sunatError.message}` };
          }
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
      } else if (sunatResult && sunatResult.length === 0 && !connectionError) {
          connectionError = { message: "Conectado a Supabase, pero la tabla 'SUNAT' está vacía." };
      }
    }
  } else {
     connectionError = { message: "Las credenciales de Supabase no están configuradas o son inválidas. Por favor, revisa tu archivo .env.local. Mostrando datos de ejemplo." };
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
                <BankRateCard key={`${bank.name}-${bank.created_at}`} name={bank.name} date={new Date(bank.created_at + 'T00:00:00Z').toLocaleDateString('es-PE', { timeZone: 'UTC' })} buy={bank.buy} sell={bank.sell} buyChange={bank.buy_change} sellChange={bank.sell_change} logoUrl={bank.logo_url} />
              )) : (
                 <p className="text-muted-foreground col-span-full">No hay datos de bancos para mostrar.</p>
              )}
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
               <h2 className="text-2xl font-bold mb-4">Evolución del Tipo de Cambio</h2>
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

        </main>
      </div>
    </div>
  );
}

    