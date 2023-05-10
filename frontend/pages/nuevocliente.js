import React, {useState} from 'react';
import Layout from '@/components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import swalFlotante from '@/config/swalFlotante';

const NUEVO_CLIENTE = gql`
    mutation nuevoCliente($input: ClienteInput) {
        nuevoCliente(input: $input) {
            id
            nombre
            apellido
            empresa
            email
            telefono
        }
    }
`
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

const NuevoCliente = () => {

    const [nuevoCliente] = useMutation(NUEVO_CLIENTE, {
        update(cache, {data:{nuevoCliente}}){
            // Obtener el objeto del cache para actualizar
            const {obtenerClientesVendedor} = cache.readQuery({ query : OBTENER_CLIENTES_USUARIO });

            // Reescribir el cache
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data:{
                    obtenerClientesVendedor:[...obtenerClientesVendedor, nuevoCliente]
                }
            })
        }
    })

    const [mensaje, guardarMensaje] = useState(null)

    const router = useRouter()

    const formik = useFormik({
        initialValues:{
            nombre:'',
            apellido:'',
            empresa:'',
            email:'',
            telefono:''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            apellido: Yup.string().required('El apellido es obligatorio'),
            empresa: Yup.string().required('La empresa es obligatoria'),
            email: Yup.string().email('El email no es valido').required('El email es obligatorio')
        }),
        onSubmit: async valores => {
            try {
                const {nombre, apellido, empresa, email, telefono} = valores

                const {data} = await nuevoCliente({
                    variables:{
                        input:{
                            nombre, 
                            apellido, 
                            empresa,
                            email,
                            telefono
                        }
                    }
                })
                
                // Mostrar mensaje
                // guardarMensaje('Guardando...')

                // Mostrar mensaje con SWAL
                swalFlotante.fire({
                    icon:'success',
                    title:'Creación de cliente exitosa'
                })

                setTimeout(() => {
                    router.push('/')
                }, 1500);

            } catch (error) {

                swalFlotante.fire({
                    icon:'error',
                    title:error.message.replace('GraphQL error: ', '')
                })

                // guardarMensaje(error.message.replace('GraphQL error: ', ''))
                // setTimeout(() => {
                //     guardarMensaje(null)
                // }, 1500);
            }
        }
        
    })

    const mostrarMensaje = () => {
        return(
            <div className='bg-white py-2 px-3 w-full my-3 max-w-lg text-center mx-auto'>
                <p>{mensaje}</p>
            </div>
        )
    }

    return ( 
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Nuevo Cliente</h1>
            {mensaje && mostrarMensaje()}
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <form className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4' onSubmit={formik.handleSubmit}>
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'>Nombre: </label>
                            <input 
                                className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id='nombre'
                                type='text'
                                placeholder='Nombre Cliente'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.nombre}
                            ></input>
                        </div>
                        { formik.touched.nombre && formik.errors.nombre ? (
                            <div className='text-left my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.nombre}</p>
                            </div>
                        ): null}
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='apellido'>Apellido: </label>
                            <input 
                                className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id='apellido'
                                type='text'
                                placeholder='Apellido Cliente'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.apellido}
                            ></input>
                        </div>
                        { formik.touched.apellido && formik.errors.apellido ? (
                            <div className='text-left my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.apellido}</p>
                            </div>
                        ): null}
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='empresa'>Empresa: </label>
                            <input 
                                className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id='empresa'
                                type='text'
                                placeholder='Empresa Cliente'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.empresa}
                            ></input>
                        </div>
                        { formik.touched.empresa && formik.errors.empresa ? (
                            <div className='text-left my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.empresa}</p>
                            </div>
                        ): null}
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>Email: </label>
                            <input 
                                className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id='email'
                                type='email'
                                placeholder='Email Cliente'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            ></input>
                        </div>
                        { formik.touched.email && formik.errors.email ? (
                            <div className='text-left my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.email}</p>
                            </div>
                        ): null}
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='telefono'>Teléfono: </label>
                            <input 
                                className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id='telefono'
                                type='tel'
                                placeholder='Teléfono Cliente'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.telefono}
                            ></input>
                        </div>
                        <input
                            type='submit'
                            className='rounded bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900'
                            value='Registrar Cliente'
                        />
                        
                    </form>
                </div>
            </div>
        </Layout>
    );
}
 
export default NuevoCliente;