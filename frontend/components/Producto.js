import React from 'react'
import { useMutation, gql } from '@apollo/client'
import Swal from 'sweetalert2'
import swalFlotante from '@/config/swalFlotante'
import Router from 'next/router'

const ELIMINAR_PRODUCTO = gql`
    mutation eliminarProducto($eliminarProductoId: ID!) {
        eliminarProducto(id: $eliminarProductoId)
    }
`

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

const Producto = ({producto}) => {


    const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
        update(cache){
            //Obtener copia de objeto de cache
            const {obtenerProductos} = cache.readQuery({query:OBTENER_PRODUCTOS})

            // Reescribir la cache
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data:{
                    obtenerProductos : obtenerProductos.filter(productoActual => productoActual.id !== id)
                }
            })
        }
    })

    const {id, nombre, existencia, precio} = producto

    const editarProducto = ()=>{
        Router.push({
            pathname:'/editarproducto/id',
            query:{id}
        })
    }

    const confirmarEliminarProducto = ()=>{
        console.log('Eliminando ' , id)

        Swal.fire({
            title: '¿Deseas eliminar este producto?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si. Eliminar',
            cancelButtonText: 'No. Cancelar'
        }).then( async (result) => {
            if (result.isConfirmed) {
                console.log(id)
                try {
                    const {data} = await eliminarProducto({
                        variables:{ 
                            eliminarProductoId:id
                        }
                    })
                    swalFlotante.fire({
                        icon:'success',
                        title:data.eliminarProducto
                    })
                } catch (error) {
                    console.log(error)
                }
            }
        })
    }

    
    return (
        <tr>
            <td className='border px-4 py-2'>{nombre}</td>
            <td className='border px-4 py-2'>{existencia}</td>
            <td className='border px-4 py-2'>{precio}</td>
            <td className='border px-4 py-2'>
                <button
                    type='button'
                    className='flex justify-center items-center bg-red-700 w-full py-2 px-4 text-white font-bold text-xs rounded uppercase'
                    onClick={()=> confirmarEliminarProducto()}                    
                >
                    Eliminar
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>


                </button>
            </td>
            <td className='border px-4 py-2'>
                <button
                    type='button'
                    className='flex justify-center items-center bg-green-600 w-full py-2 px-4 text-white font-bold text-xs rounded uppercase'
                    onClick={()=> editarProducto()}                    
                >
                    Editar
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>



                </button>
            </td>
        </tr>
    )
}

export default Producto