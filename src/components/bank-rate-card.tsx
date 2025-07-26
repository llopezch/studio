import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

const BankLogo = ({ name }: { name: string }) => {
  const logos: Record<string, React.ReactNode> = {
    'Interbank': (
      <svg width="100" height="28" viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.79 27.04L20.04 0.819998H27.1L20.84 27.04H13.79Z" fill="#0079C2"/>
        <path d="M37.81 0.819998L33.21 21.4L33.03 21.4L28.17 0.819998H21.2L28.89 27.04H37.81L45.49 0.819998H37.81Z" fill="#0079C2"/>
        <path d="M45.89 17.51L45.89 27.04H38.83V0.819998H45.89L45.89 11.53C45.89 11.53 47.93 0.819998 47.93 0.819998H54.02L48.83 13.99L54.67 27.04H48.45L45.89 21.06V17.51Z" fill="#0079C2"/>
        <path d="M57.11 27.04L57.11 0.819998H68.74C68.74 0.819998 73.13 0.819998 73.13 5.43999C73.13 10.06 68.74 10.06 68.74 10.06H64.17V17.51H68.39C68.39 17.51 73.66 17.51 73.66 22.13C73.66 26.75 68.39 27.04 68.39 27.04H57.11ZM64.17 7.55999H65.81C65.81 7.55999 67.59 7.55999 67.59 5.43999C67.59 3.31999 65.81 3.31999 65.81 3.31999H64.17V7.55999ZM64.17 24.12H66.16C66.16 24.12 68.12 24.12 68.12 21.99C68.12 19.86 66.16 19.86 66.16 19.86H64.17V24.12Z" fill="#0079C2"/>
        <path d="M85.39 0.819998L80.79 21.4L80.61 21.4L75.75 0.819998H68.78L76.47 27.04H85.39L93.07 0.819998H85.39Z" fill="#0079C2"/>
        <path d="M100 0.819998L93.18 27.04H86.27L93.07 0.819998H100Z" fill="#0079C2"/>
        <path d="M13.44 0.819998L6.89 27.04H0L6.81 0.819998H13.44Z" fill="#0079C2"/>
      </svg>
    ),
    'BCP': (
      <svg width="80" height="30" viewBox="0 0 80 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.4 12.87C22.4 11.23 21.84 9.87 20.8 8.79C19.76 7.71 18.28 7.17 16.36 7.17H10.12V22.8H16.84C18.64 22.8 20.07 22.31 21.13 21.33C22.19 20.35 22.72 19.03 22.72 17.37V16.95C22.72 15.21 22.25 13.89 21.31 12.99C21.75 12.33 22.4 13.45 22.4 12.87ZM16.52 10.05C17.68 10.05 18.26 10.59 18.26 11.67V12.93C18.26 13.97 17.68 14.49 16.52 14.49H14.04V10.05H16.52ZM16.68 17.07C17.92 17.07 18.54 17.61 18.54 18.69V19.83C18.54 20.91 17.92 21.45 16.68 21.45H14.04V17.07H16.68Z" fill="#003087"/>
        <path d="M36.19 7.17H28.99V22.8H32.91V16.77H36.19C38.07 16.77 39.46 16.2 40.36 15.06C41.26 13.92 41.71 12.42 41.71 10.56C41.71 8.7 41.26 7.2 40.36 6.06C39.46 4.92 38.07 4.35 36.19 4.35V7.17ZM36.19 14.01H32.91V9.93H36.19C37.23 9.93 37.75 10.45 37.75 11.49C37.75 12.53 37.23 13.05 37.75 14.01H36.19Z" fill="#003087"/>
        <path d="M44.43 22.8V4.35H55.83V7.17H48.35V12.15H54.75V14.97H48.35V19.98H56.19V22.8H44.43Z" fill="#003087"/>
      </svg>
    ),
    'BBVA': (
      <svg width="70" height="20" viewBox="0 0 70 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.3 0H0L7.1 20H19.4L12.3 0Z" fill="#004481"/>
        <path d="M25.1 0H12.8L19.9 20H32.2L25.1 0Z" fill="#004481"/>
        <path d="M47.8 0H38.5L34.1 12.1L29.7 0H20.4L29.7 20H38.5L47.8 0Z" fill="#004481"/>
        <path d="M54.9 0L47.8 20H60.1L67.2 0H54.9Z" fill="#004481"/>
      </svg>
    ),
    'Scotiabank': (
      <svg width="120" height="25" viewBox="0 0 120 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.5 12.5C22.5 19.4 17.4 25 12.5 25C5.6 25 0 19.4 0 12.5C0 5.6 5.6 0 12.5 0C17.4 0 22.5 5.6 22.5 12.5Z" fill="#ED1C24"/>
        <path d="M35.8 24.5H28.5V0.5H35.8C41.4 0.5 45.6 4.7 45.6 10.3V14.7C45.6 20.3 41.4 24.5 35.8 24.5ZM35.8 5.4C38.6 5.4 40.8 7.6 40.8 10.4V14.6C40.8 17.4 38.6 19.6 35.8 19.6H33.3V5.4H35.8Z" fill="#000"/>
        <path d="M62.6 12.5C62.6 19.1 57.8 24.5 51.5 24.5C45.2 24.5 40.4 19.1 40.4 12.5C40.4 5.9 45.2 0.5 51.5 0.5C57.8 0.5 62.6 5.9 62.6 12.5ZM57.8 12.5C57.8 8.8 55.1 5.4 51.5 5.4C47.9 5.4 45.2 8.8 45.2 12.5C45.2 16.2 47.9 19.6 51.5 19.6C55.1 19.6 57.8 16.2 57.8 12.5Z" fill="#000"/>
        <path d="M78.4 24.5H73.6L68.8 16.2V24.5H64V0.5H68.8V8.8L73.6 0.5H78.4L72.4 12.5L78.4 24.5Z" fill="#000"/>
        <path d="M91.8 24.5H80.2V0.5H91.8V5.4H85V9.9H91V14.8H85V19.6H91.8V24.5Z" fill="#000"/>
        <path d="M104.9 24.5H98.6C93.8 24.5 90.2 20.9 90.2 16.1V8.9C90.2 4.1 93.8 0.5 98.6 0.5H104.9V5.4H99.4C96.9 5.4 95 7.3 95 9.7V15.3C95 17.7 96.9 19.6 99.4 19.6H104.9V24.5Z" fill="#000"/>
        <path d="M119.5 24.5H114.7L112.2 18.2H105.8L103.3 24.5H98.5L105.3 0.5H108.7L119.5 24.5ZM109 7.3L107.1 13.3H111L109 7.3Z" fill="#000"/>
      </svg>
    ),
    'Banco de la Nación': (
       <svg width="110" height="30" viewBox="0 0 110 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.6 22.4H8.4V7.8H14.6C18.6 7.8 22 11.2 22 15.2C22 19.2 18.6 22.4 14.6 22.4ZM14.6 10.6H11.2V19.6H14.6C16.8 19.6 18.8 17.6 18.8 15.2C18.8 12.8 16.8 10.6 14.6 10.6Z" fill="#CF142B"/>
        <path d="M25.8 22.4V7.8H38.2V10.6H28.6V14.2H37.4V17H28.6V22.4H25.8Z" fill="#000"/>
        <path d="M53 15.2C53 19.2 49.6 22.4 45.6 22.4C41.6 22.4 38.2 19.2 38.2 15.2C38.2 11.2 41.6 7.8 45.6 7.8C49.6 7.8 53 11.2 53 15.2ZM42 15.2C42 17.6 43.6 19.6 45.6 19.6C47.6 19.6 49.2 17.6 49.2 15.2C49.2 12.8 47.6 10.6 45.6 10.6C43.6 10.6 42 12.8 42 15.2Z" fill="#000"/>
        <path d="M68.6 22.4L64.4 16.2H61.8V22.4H59V7.8H64.8C68.2 7.8 70.6 10.2 70.6 13.2C70.6 15.6 69.4 17.6 67.6 18.6L72 22.4H68.6ZM64.8 10.6H61.8V13.8H64.8C66.4 13.8 67.8 12.8 67.8 11.2C67.8 9.6 66.4 8.6 64.8 8.6V10.6Z" fill="#000"/>
        <path d="M75.8 22.4V7.8H78.6V22.4H75.8Z" fill="#000"/>
        <path d="M92.6 22.4H88.4L82.6 7.8H85.6L89.6 19L93.6 7.8H96.6L92.6 22.4Z" fill="#000"/>
        <path d="M109.2 22.4H103V7.8H106C110 7.8 112.4 10.2 112.4 13.2C112.4 16.2 110 18.6 107.6 19.4L113.2 22.4H109.2ZM106 10.6H103V16.6H106C108.4 16.6 109.6 15 109.6 13.2C109.6 11.4 108.4 10.6 106 10.6Z" fill="#000"/>
      </svg>
    ),
  };
  return <div className="w-24 h-10 flex items-center justify-center">{logos[name] || null}</div>;
};


interface BankRateCardProps {
  name: string;
  date: string;
  buy: number;
  sell: number;
  buyChange: number;
  sellChange: number;
}

function RateChange({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <div className={cn(
      "flex items-center text-xs",
      isPositive ? "text-green-600" : "text-red-600"
    )}>
      {isPositive ? '+' : ''}{value.toFixed(4)}
    </div>
  )
}

export function BankRateCard({ name, date, buy, sell, buyChange, sellChange }: BankRateCardProps) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BankLogo name={name} />
          <div>
            <div className="font-bold">{name}</div>
            <div className="text-xs text-muted-foreground">{date}</div>
          </div>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <div className="text-sm text-muted-foreground">Compra</div>
            <div className="font-bold text-lg text-red-600">{buy.toFixed(3)}</div>
            <RateChange value={buyChange} />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Venta</div>
            <div className="font-bold text-lg text-green-600">{sell.toFixed(3)}</div>
            <RateChange value={sellChange} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}