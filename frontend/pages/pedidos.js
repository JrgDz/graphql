import Head from 'next/head'
import Layout from '@/components/Layout'
import Link from 'next/link';
import { useQuery, gql } from '@apollo/client';
import Pedido from '@/components/Pedido';

const OBTENER_PEDIDOS_VENDEDOR = gql`
query ObtenerPedidosPorVendedor {
  obtenerPedidosPorVendedor {
    id
    pedido {
      id
      cantidad
      nombre
      precio
    }
    total
    cliente {
      id
      nombre
      apellido
      empresa
      email
      telefono
      vendedor
    }
    vendedor
    fecha
    estado
  }
}
`

const Pedidos = () => {

    const {data, loading, error} = useQuery(OBTENER_PEDIDOS_VENDEDOR)

    if (loading) return "Cargando..."

    const {obtenerPedidosPorVendedor} = data

    return (
      <>
      <div>
        <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Pedidos</h1>
        <Link href='/nuevopedido'>
          <p className='bg-blue-800 py-2 px-3 mt-3 inline-block text-white rounded text-sm hover:bg-blue-400 uppercase font-bold'>Nuevo Pedido</p>
        </Link>
        {obtenerPedidosPorVendedor.length === 0 ?(
          <p className='mt-5 text-center text-2xl'>De momento no existen pedidos creados</p>
        ):(
          obtenerPedidosPorVendedor.map(pedido => (
            <Pedido
              key={pedido.id}
              pedido={pedido}
            />
          ))
        )}
        </Layout>
      </div>
    </>
    );
  }
   
  export default Pedidos;
  