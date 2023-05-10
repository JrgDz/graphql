import Head from 'next/head'
import Layout from '@/components/Layout'
import { useQuery, gql } from '@apollo/client';
import Producto from '@/components/Producto';
import Link from 'next/link';

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
      id
      nombre
      existencia
      precio
    }
  }
`

const Productos = () => {

  // Consultar los productos

  const {data, loading, error} = useQuery(OBTENER_PRODUCTOS)

  if (loading) return 'Cargando...'

    return (
      <>
      <div>
        <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Productos</h1>
        <Link href='/nuevoproducto'>
          <p className='bg-blue-800 py-2 px-3 mt-3 inline-block text-white rounded text-sm hover:bg-blue-400 uppercase font-bold'>Nuevo Producto</p>
        </Link>
        <table className='table-auto shadow-md mt-4 w-full w-lg'>
          <thead className='bg-gray-700'>
            <tr className='text-white'>
              <th className='w-1/5 py-2'>Nombre</th>
              <th className='w-1/5 py-2'>Existencia</th>
              <th className='w-1/5 py-2'>Precio</th>
              <th className='w-1/5 py-2'>Eliminar</th>
              <th className='w-1/5 py-2'>Editar</th>
            </tr>
          </thead>
          <tbody className='bg-white'>
            {data.obtenerProductos.map(producto =>(
                <Producto
                  key={producto.id}
                  producto={producto}
                />
              ))}
          </tbody>
        </table>
        </Layout>
      </div>
    </>
    );
  }
   
  export default Productos;
  