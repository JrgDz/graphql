import React from 'react';
import { ApolloConsumer } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import { useRouter } from 'next/router';



const cerrarSesionUsuario = (cliente, history) =>{
    localStorage.removeItem('token')
    cliente.resetStore()
    //return router.push('/login')
}

const CerrarSesion = ({history}) => (
    
    <ApolloConsumer>
        {cliente => {
            return ( 
                <button 
                    onClick={()=>cerrarSesionUsuario(cliente, history)}
                    type='button' 
                    className='bg-blue-800 sm:w-auto font-blod uppercase text-xs rounded py-1 px-2 text-white shodow-md'
                >Cerrar Sesión
                </button>
            );
        }}
    </ApolloConsumer>
)
 
export default CerrarSesion;