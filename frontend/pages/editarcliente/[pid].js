import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup'
import client from '@/config/apollo';
import swalFlotante from '@/config/swalFlotante';

const OBTENER_CLIENTE = gql`
    query obtenerClientePorId($obtenerClientePorIdId: ID!) {
        obtenerClientePorId(id: $obtenerClientePorIdId) {
            nombre
            apellido
            empresa
            email
            telefono
        }
    }
`

const ACTUALIZAR_CLIENTE = gql`
    mutation actualizarCliente($actualizarClienteId: ID!, $input: ClienteInput) {
        actualizarCliente(id: $actualizarClienteId, input: $input) {
            nombre
            apellido
            empresa
            email
        }
    }
`

const EditarCliente = () => {

    // Obtener el id
    const router = useRouter()
    const {query:{id}} = router
    // console.log(id)

    // Consultar para obtener el cliente
    const {data, loading, error} = useQuery(OBTENER_CLIENTE,{
        variables:{
            obtenerClientePorIdId : id
        }
    })

    // Actualizar el cliente
    const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE)

    // Schema de validación
    const schemaValidacion = Yup.object({
        nombre: Yup.string().required('El nombre es obligatorio'),
        apellido: Yup.string().required('El apellido es obligatorio'),
        empresa: Yup.string().required('La empresa es obligatoria'),
        email: Yup.string().email('El email no es valido').required('El email es obligatorio')
    })


    if (loading) return 'Cargando...'

    const {obtenerClientePorId} = data

    // Modificar el cliente en la base de datos
    const actualizarInfoCliente = async valores =>{
        const {nombre, apellido, empresa, email, telefono} = valores
        try {
            const {data} = await actualizarCliente({
                variables:{
                    actualizarClienteId:id, 
                    input:{
                        nombre,
                        apellido,
                        empresa,
                        email,
                        telefono
                    }
                }
            })
            // console.log(data)
            // Mostrar alerta
            swalFlotante.fire({
                icon:'success',
                title:'Actualización de cliente exitosa'
            })

            setTimeout(() => {
                // Redireccionar
                client.clearStore()
                router.push("/")

            }, 1500);
            
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Editar Cliente</h1>
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <Formik
                        validationSchema={schemaValidacion}
                        enableReinitialize
                        initialValues={obtenerClientePorId}
                        onSubmit={(valores)=>{
                            actualizarInfoCliente(valores)
                        }}
                    >
                        {props =>{
                            return(
                                <form className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4' 
                                    onSubmit={props.handleSubmit}
                                >
                                    <div className='mb-4'>
                                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'>Nombre: </label>
                                        <input 
                                            className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                            id='nombre'
                                            type='text'
                                            placeholder='Nombre Cliente'
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.nombre}
                                        ></input>
                                    </div>
                                    { props.touched.nombre && props.errors.nombre ? (
                                        <div className='text-left my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.nombre}</p>
                                        </div>
                                    ): null}
                                    <div className='mb-4'>
                                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='apellido'>Apellido: </label>
                                        <input 
                                            className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                            id='apellido'
                                            type='text'
                                            placeholder='Apellido Cliente'
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.apellido}
                                        ></input>
                                    </div>
                                    { props.touched.apellido && props.errors.apellido ? (
                                        <div className='text-left my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.apellido}</p>
                                        </div>
                                    ): null}
                                    <div className='mb-4'>
                                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='empresa'>Empresa: </label>
                                        <input 
                                            className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                            id='empresa'
                                            type='text'
                                            placeholder='Empresa Cliente'
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.empresa}
                                        ></input>
                                    </div>
                                    { props.touched.empresa && props.errors.empresa ? (
                                        <div className='text-left my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.empresa}</p>
                                        </div>
                                    ): null}
                                    <div className='mb-4'>
                                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>Email: </label>
                                        <input 
                                            className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                            id='email'
                                            type='email'
                                            placeholder='Email Cliente'
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.email}
                                        ></input>
                                    </div>
                                    { props.touched.email && props.errors.email ? (
                                        <div className='text-left my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.email}</p>
                                        </div>
                                    ): null}
                                    <div className='mb-4'>
                                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='telefono'>Teléfono: </label>
                                        <input 
                                            className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                            id='telefono'
                                            type='tel'
                                            placeholder='Teléfono Cliente'
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.telefono}
                                        ></input>
                                    </div>
                                    <input
                                        type='submit'
                                        className='rounded bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900'
                                        value='Actualizar Cliente'
                                    />
                                    
                                </form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        </Layout>
    );
}
 
export default EditarCliente;