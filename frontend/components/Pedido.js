import React, {useState, useEffect} from 'react'
import {useMutation, gql} from '@apollo/client'

const ACTUALIZAR_PEDIDO = gql `
    mutation ActualizarPedido($id: ID!, $input: PedidoInput) {
        actualizarPedido(id: $id, input: $input) {
        estado
        }
    }
`

const ELIMINAR_PEDIDO = gql `
    mutation EliminarPedido($id: ID!) {
        eliminarPedido(id: $id)
    }
`

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

const Pedido = ({pedido}) => {

    const {id, total, cliente, cliente:{nombre, apellido, email, telefono}, estado} = pedido
    
    const [actualizarPedido] = useMutation(ACTUALIZAR_PEDIDO)
    const [eliminarPedido] = useMutation(ELIMINAR_PEDIDO, {
        update(cache){
            const {obtenerPedidosPorVendedor} = cache.readQuery({query:OBTENER_PEDIDOS_VENDEDOR})

            cache.writeQuery({
                query:OBTENER_PEDIDOS_VENDEDOR,
                data:{
                    obtenerPedidosPorVendedor : obtenerPedidosPorVendedor.filter(pedidoActual=>pedidoActual.id !== id)
                }
            })
        }
    })

    const [estadoPedido, setEstadoPedido] = useState(estado)
    const [clase, setClase] = useState('')
    
    useEffect(()=>{
        if(estadoPedido){
            setEstadoPedido(estadoPedido)
        }
        clasePedido()
        cambiarEstado()
    },[estadoPedido])

    const cambiarEstado = async estadoPedido => {
        try {
            const {data} = await actualizarPedido({
                variables:{
                    id,
                    input:{
                        cliente:cliente.id,
                        estado:estadoPedido
                    }
                }
            })
            setEstadoPedido(data.actualizarPedido.estado)
        } catch (error) {
            console.log(error)
        }
    }

    const confirmarEliminarPedido = async id => {
        try {
            const {data} = await eliminarPedido({
                variables:{
                    id
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    
    // Funcion que modifica el color del pedido de acuerdo a su estado
    const clasePedido = ()=>{
        if(estadoPedido === 'PENDIENTE'){
            setClase('border-yellow-500')
            
        }else if (estadoPedido === 'COMPLETADO'){
            setClase('border-green-500')
        }else{
            setClase('border-red-800')
        }
    }



    return (
        <div className={` ${clase} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
            <div>
                <p className='font-bold text-gray-800'>Cliente: {apellido} {nombre}</p>
                {email && (
                    <p className='flex items-center mt-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        {email}
                    </p>
                )}
                {telefono && (
                    <p className='flex items-center mt-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                        {telefono}
                    </p>
                )}
                <h2 className='text-gray-800 font-bold mt-10'>Estado pedido:</h2>
                <select
                    className='mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold'
                    value={estadoPedido}
                    onChange={e=> cambiarEstado(e.target.value)}
                >
                    <option value="COMPLETADO">COMPLETADO</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="CANCELADO">CANCELADO</option>
                </select>
            </div>
            <div>
                <h2 className='text-gray-800 font-bold mt-2'>Resumen de Pedido</h2>
                { pedido.pedido.map(articulo =>(
                    <div key={articulo.id} className='mt-4'>
                        <p className='text-sm text-gray-600'>Producto: {articulo.nombre}</p>
                        <p className='text-sm text-gray-600'>Cantidad: {articulo.cantidad}</p>
                    </div>
                ))}
                <p className='text-gray-800 mt-3 font-bold'>Total:
                    <span className='font-light'> ${total}</span>
                </p>
                <button
                    className='flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight uppercase text-xs font-blod'
                    onClick={()=>confirmarEliminarPedido(id)}
                >
                    Eliminar Pedido
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                </button>
            </div>

        </div>
    )
}

export default Pedido