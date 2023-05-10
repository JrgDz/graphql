import Head from 'next/head'
import Layout from '@/components/Layout'
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Clientes from './clientes'

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
    id
    nombre
    apellido
    empresa
    email  
    }
  }
`

const Index = () => {

  const router = useRouter()

  // Consulta de Apollo

  const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO)

  if(loading) return <>Cargando...</>
  if(!data.obtenerClientesVendedor){
    return router.push('/login')
  }


  return (
    <>
    <div>
      <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Clientes</h1>

      <Link href='/nuevocliente'>
        <p className='bg-blue-800 py-2 px-3 mt-3 inline-block text-white rounded text-sm hover:bg-blue-400 uppercase font-bold'>Nuevo Cliente</p>
      </Link>

        <table className='table-auto shadow-md mt-4 w-full w-lg'>
          <thead className='bg-gray-700'>
            <tr className='text-white'>
              <th className='w-1/5 py-2'>Nombre</th>
              <th className='w-1/5 py-2'>Empresa</th>
              <th className='w-1/5 py-2'>Email</th>
              <th className='w-1/5 py-2'>Eliminar</th>
              <th className='w-1/5 py-2'>Editar</th>
            </tr>
          </thead>
          <tbody className='bg-white'>
            {data.obtenerClientesVendedor.map(cliente =>(
                <Clientes
                  key={cliente.id}
                  cliente={cliente}
                />
              ))}
          </tbody>
        </table>
      </Layout>
    </div>
  </>
  );
}
 
export default Index;


