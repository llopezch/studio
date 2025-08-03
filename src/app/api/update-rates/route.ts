
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Este es el tipo de datos que esperamos recibir de n8n en el cuerpo de la solicitud (POST).
// Se basa en la estructura de salida que se ve en la captura de pantalla de n8n.
interface N8NData {
  fechahora: string; // Corregido de 'datetime' a 'fechahora'
  open: number;
  high: number;
  low: number;
  close: number;
}

export async function POST(request: Request) {
  // **Importante:** Usamos las variables de entorno del servidor para crear un cliente con permisos de administrador.
  // Esto es seguro porque este código solo se ejecuta en el servidor y las claves no son visibles para el usuario.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase server credentials are not configured.');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  // Se crea un cliente con la "llave maestra" (service_role) que puede saltarse las políticas RLS.
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const incomingData: N8NData[] = await request.json();
    
    // Validamos que los datos recibidos sean un array
    if (!Array.isArray(incomingData)) {
      throw new Error("El formato de los datos recibidos no es un array.");
    }
    
    // Nos aseguramos de que los datos no estén vacíos
    if (incomingData.length === 0) {
        return NextResponse.json({ message: 'Datos recibidos, pero el array está vacío. No se realizaron acciones.' }, { status: 200 });
    }
    
    // Ordenamos los datos por fecha (fechahora) de más reciente a más antiguo
    const sortedData = incomingData.sort((a, b) => new Date(b.fechahora).getTime() - new Date(a.fechahora).getTime());
    
    // Tomamos solo los últimos 7 registros
    const latestSeven = sortedData.slice(0, 7);

    // Mapeamos los datos al formato que nuestra base de datos espera.
    // Asumimos que la tabla 'PEN_USD_RECENT' tiene las columnas: 'time', 'value', 'change'.
    const dataToInsert = latestSeven.map((item, index, arr) => {
        // El valor de cambio es la diferencia con el registro anterior
        const previousItem = arr[index + 1];
        const change = previousItem ? item.open - previousItem.open : 0;
        
        return {
            // Guardamos la fecha completa para ordenarla si es necesario
            created_at: item.fechahora,
            // Formateamos la hora para mostrarla en el panel
            time: new Date(item.fechahora).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima' }),
            value: item.open,
            change: change
        };
    });

    // Antes de insertar, vaciamos la tabla para asegurarnos de que solo tenemos los 7 más recientes.
    const { error: deleteError } = await supabase.from('PEN_USD_RECENT').delete().neq('value', -9999); // Condición para borrar todo
    if (deleteError) {
        console.error('Error al limpiar la tabla PEN_USD_RECENT:', deleteError);
        throw deleteError;
    }

    // Insertamos los nuevos datos en la tabla 'PEN_USD_RECENT'
    const { error: insertError } = await supabase.from('PEN_USD_RECENT').insert(dataToInsert);
    if (insertError) {
        console.error('Error al insertar en PEN_USD_RECENT:', insertError);
        throw insertError;
    }

    return NextResponse.json({ message: 'Datos actualizados correctamente.', count: dataToInsert.length }, { status: 200 });

  } catch (error: any) {
    console.error('Error procesando la solicitud:', error);
    return NextResponse.json({ error: error.message || 'Ocurrió un error en el servidor.' }, { status: 500 });
  }
}
