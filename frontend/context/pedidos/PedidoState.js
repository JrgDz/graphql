import React, {useReducer} from "react";
import PedidoContext from "./PedidoContext";
import PedidoReducer from "./PedidoReducer";

import {
    SELECCIONAR_CLIENTE,
    SELECCIONAR_PRODUCTO,
    CANTIDAD_PRODUCTOS,
    ACTUALIZAR_TOTAL
} from '../../types'

const PedidoState = ({children}) => {
    // State de Pedidos
    const initialState = {
        cliente:{},
        productos:[],
        total:0
    }

    const [state, dispatch] = useReducer(PedidoReducer, initialState)

    // Modificar el Cliente
    const agregarCliente = cliente => {
        dispatch({
            type:SELECCIONAR_CLIENTE,
            payload:cliente
        })
    }

    const agregarProducto = productosSeleccionados => {
        let nuevoState 
        if(state.productos.length > 0){
            // Hacer una copia del segundo arreglo para asiganrlo al primero
            nuevoState = productosSeleccionados.map(producto => {
                const nuevoObjeto = state.productos.find(productoState => productoState.id === producto.id)
                return {...producto, ...nuevoObjeto}
            })
    
        } else {
            nuevoState = productosSeleccionados
        }
        dispatch({
            type:SELECCIONAR_PRODUCTO,
            payload:nuevoState
        })
    }

    // Modifica la cantidades de los productos
    const cantidadProductos = nuevoProducto =>{
        dispatch({
            type:CANTIDAD_PRODUCTOS,
            payload:nuevoProducto
        })
    }

    const actualizarTotal = () => {
        dispatch({
            type:ACTUALIZAR_TOTAL
        })
        
    }


    return (
        <PedidoContext.Provider
            value={{
                cliente:state.cliente,
                productos:state.productos,
                total:state.total,       
                agregarCliente,
                agregarProducto,
                cantidadProductos,
                actualizarTotal
            }}
        >
            {children}
        </PedidoContext.Provider>
    );
}
 
export default PedidoState;