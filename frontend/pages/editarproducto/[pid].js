import React from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { Formik } from 'formik';
import * as Yup from 'yup'
import client from '@/config/apollo';
import swalFlotante from '@/config/swalFlotante';
import NoEncontrada from '@/components/NoEncontrada';

const OBTENER_PRODUCTO = gql`
    query obtenerProductoPorId($obtenerProductoPorId: ID!) {
        obtenerProductoPorId(id: $obtenerProductoPorId) {
            nombre
            existencia
            precio
        }
    }
`

const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id: ID!, $input: ProductoInput) {
        actualizarProducto(id: $id, input: $input) {
            nombre
            existencia
            precio
        }
    }
`

const EditarProducto = () => {

    const router = useRouter()
    const {query:{id}} = router

    const {data, loading, error} = useQuery(OBTENER_PRODUCTO,{
        variables:{
            obtenerProductoPorId:id
        }
    })

    console.log(data)

    const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO)

    const schemaValidacion = Yup.object({
        nombre: Yup.string().required('El nombre es obligatorio'),
        existencia: Yup.number('La cantidad es numérica').required('La existencia es obligatoria').positive('La cantidad debe ser positiva').integer('La cantidad debe ser entera'),
        precio: Yup.number().required('El precio es obligatorio').positive('La precio debe ser positivo')
    })

    if (loading) return 'Cargando...'

    if(!data) return <NoEncontrada></NoEncontrada>

    const {obtenerProductoPorId} = data

    const actualizarInfoProducto = async valores =>{
        const {nombre, existencia, precio} = valores
        try {
            const{data} = await actualizarProducto({
                variables:{
                    id,
                    input:{
                        nombre,
                        existencia,
                        precio
                    }
                }
            })
            swalFlotante.fire({
                icon:'success',
                title:'Actualización de producto exitosa'
            })

            setTimeout(() => {
                client.clearStore()
                router.push('/productos')
            }, 1500);

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Editar Producto</h1>
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <Formik
                        validationSchema={schemaValidacion}
                        enableReinitialize
                        initialValues={obtenerProductoPorId}
                        onSubmit={(valores)=>{
                            actualizarInfoProducto(valores)
                        }}
                    >
                        {props=>{
                            console.log(props)
                            console.log(props.values)
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
                                            placeholder='Nombre Producto'
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
                                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='existencia'>Cantidad Disponible Producto: </label>
                                        <input 
                                            className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                            id='existencia'
                                            type='number'
                                            placeholder='Cantidad Disponible Producto'
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.existencia}
                                        ></input>
                                    </div>
                                    { props.touched.existencia && props.errors.existencia ? (
                                        <div className='text-left my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.existencia}</p>
                                        </div>
                                    ): null}
                                    <div className='mb-4'>
                                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='precio'>Precio: </label>
                                        <input 
                                            className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                            id='precio'
                                            type='number'
                                            placeholder='Precio Producto'
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.precio}
                                        ></input>
                                    </div>
                                    { props.touched.precio && props.errors.precio ? (
                                        <div className='text-left my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.precio}</p>
                                        </div>
                                    ): null}
                                    
                                    <input
                                        type='submit'
                                        className='rounded bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900'
                                        value='Actualizar Producto'
                                    />
                                    
                                </form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        </Layout>
    )
}

export default EditarProducto