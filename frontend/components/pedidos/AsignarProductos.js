import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import { useQuery, gql } from "@apollo/client";
import PedidoContext from "@/context/pedidos/PedidoContext";

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

const AsignarProducto = () => {

    const [productos, setProductos] = useState([])

    const {data, loading, error} = useQuery(OBTENER_PRODUCTOS)

    const pedidoContext = useContext(PedidoContext)
    const {agregarProducto} = pedidoContext

    useEffect(()=>{
        // Función para pasar a PedidoState
        agregarProducto(productos)
    },[productos])

    const seleccionarProducto = producto =>{                                                                
        setProductos(producto)
    }

    if(loading) return null

    const {obtenerProductos} = data

    return (
        <>
            <p className='mt-5 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>2.- Asigna productos al Pedido</p>
            <Select
                className='mt-3'
                options={obtenerProductos}
                isMulti={true}
                onChange={producto => seleccionarProducto(producto)}
                getOptionValue={producto=>producto.id}
                getOptionLabel={producto=>`${producto.nombre} -- ${producto.existencia} Disponibles`}
                placeholder="Busque o seleccione el Producto"
                noOptionsMessage={()=>"No existe producto"}
            ></Select>
        </>
    );
}
 
export default AsignarProducto;