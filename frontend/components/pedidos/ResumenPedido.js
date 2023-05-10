import React, {useContext, useEffect} from 'react'
import PedidoContext from '@/context/pedidos/PedidoContext'
import ResumenProducto from './ResumenProducto'


const ResumenPedido = () => {

    const pedidoContext = useContext(PedidoContext)
    const {productos, actualizarTotal} = pedidoContext

    useEffect(()=>{
        actualizarTotal()
    },[productos])

    return (
        <>
            <p className='mt-5 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>3.- Asigna cantidades a los productos para el Pedido</p>
            {productos.length > 0 ? (
                <>
                {productos.map(producto =>(
                    <ResumenProducto
                        key={producto.id}
                        producto={producto}
                    />
                ))}
                </>
            ):(
                <p className='mt-5 text-sm'>No hay productos</p>
            )}
        </>
    )
}

export default ResumenPedido