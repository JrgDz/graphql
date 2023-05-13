import Layout from '@/components/Layout'
import AsignarCliente from '@/components/pedidos/AsignarCliente'
import React, { useEffect, useState, useContext } from 'react'
import { gql, useMutation } from '@apollo/client'
import swalFlotante from '@/config/swalFlotante'
import { useRouter } from 'next/router'
import client from '@/config/apollo'

// Context de Pedidos
import PedidoContext from '@/context/pedidos/PedidoContext'
import AsignarProducto from '@/components/pedidos/AsignarProductos'
import ResumenPedido from '@/components/pedidos/ResumenPedido'
import Total from '@/components/pedidos/Total'


const NUEVO_PEDIDO = gql`
    mutation nuevoPedido($input: PedidoInput) {
        nuevoPedido(input: $input) {
        id,
        total
        }
    }
`


const NuevoPedido = () => {

    const router = useRouter()

    // Utilizar context y extraer funciones y valores

    const pedidoContext = useContext(PedidoContext)
    const {cliente, productos, total} = pedidoContext

    const validarPedido = ()=>{
        return !productos.every(producto => producto.cantidad > 0) || total === 0 || cliente.length === 0 ? "opacity-50 cursor-not-allowed" : ""
    }

    const [nuevoPedido] = useMutation(NUEVO_PEDIDO)

    const crearNuevoPedido = async ()=>{

        // Remover la data no necesaria del producto
        const pedido = productos.map(({__typename, existencia, ...producto})=>producto)

        const {id} = cliente
        try {
            const {data}= await nuevoPedido({
                variables:{
                    input:{
                        cliente: id,
                        total,
                        pedido
                    }
                }
            })
            swalFlotante.fire({
                icon:"success",
                title:"Pedido generado exitosamente"
            })

            setTimeout(() => {
                client.clearStore()
                router.push('/pedidos')
            }, 1500);

        } catch (error) {
            swalFlotante.fire({
                icon:'error',
                title: error.message.replace("GraphQL error: ","")
            })
        }
    }

    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Crear nuevo Pedido</h1>
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <AsignarCliente/>
                    <AsignarProducto/>
                    <ResumenPedido />
                    <Total />
                    <button
                        type='button'
                        className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validarPedido()}`}
                        onClick={()=>crearNuevoPedido()}
                    >
                        Registra Pedido
                    </button>
                </div>
            </div>
        </Layout>
    )
}

export default NuevoPedido