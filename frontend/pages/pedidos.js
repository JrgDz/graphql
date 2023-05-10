import Head from 'next/head'
import Layout from '@/components/Layout'
import Link from 'next/link';
import { useQuery, gql } from '@apollo/client';
import Pedido from '@/components/Pedido';

const OBTENER_PEDIDOS = gql`
  query obtenerPedidos {
    obtenerPedidos {
      id
      cliente
      pedido{
        id
        cantidad
      }  
      vendedor
      total
      estado
    }
  }
`

const Pedidos = () => {

    const {data, loading, error} = useQuery(OBTENER_PEDIDOS)

    console.log(data)


    if (loading) return "Cargando..."

    console.log("Despues del LOADING!!!!")
    console.log(data)

    const {obtenerPedidos} = data

    return (
      <>
      <div>
        <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Pedidos</h1>
        <Link href='/nuevopedido'>
          <p className='bg-blue-800 py-2 px-3 mt-3 inline-block text-white rounded text-sm hover:bg-blue-400 uppercase font-bold'>Nuevo Pedido</p>
        </Link>
        {obtenerPedidos.length === 0 ?(
          <p className='mt-5 text-center text-2xl'>No hay pedidos aún</p>
        ):(
          obtenerPedidos.map(pedido => (
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
  