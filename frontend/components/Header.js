import React, { Component, useEffect } from 'react';
import { useQuery, gql, InMemoryCache } from '@apollo/client';
import { useRouter } from 'next/router';
import { ApolloConsumer } from '@apollo/client';
import CerrarSesion from './CerrarSesion';
import client from '../config/apollo'

const OBTENER_USUARIO = gql`
    query obtenerUsuario {
        obtenerUsuario {
            id, 
            nombre, 
            apellido
        }
    }
`

const Header = () => {

    const router = useRouter()

    const {data, loading, error} = useQuery(OBTENER_USUARIO)
    
    if(loading) return null
    
    // Si no hay información
    if(!data.obtenerUsuario){
        return router.push('/login')
    }
    
    const {nombre, apellido} = data.obtenerUsuario

    // console.log(nombre)
    // console.log(apellido)
    
    const cerrarSesionUsuario = () => {
        localStorage.removeItem('token')
        // RECARGAR COMPONENTE - FUNCIONA CON APOLLO
        client.clearStore()

        router.push('/login')
    }

    return ( 
        <>
            <div className='flex justify-end'>
                <p className='mr-2'>Hola: {nombre} {apellido}</p>
                <button 
                    onClick={()=>cerrarSesionUsuario()}
                    type='button' 
                    className='bg-blue-800 sm:w-auto font-blod uppercase text-xs rounded py-1 px-2 text-white shodow-md'
                >Cerrar Sesión
                </button>
            </div>
        </>
     );
}
 
export default Header;