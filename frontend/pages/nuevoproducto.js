import Layout from '@/components/Layout'
import React from 'react'
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import swalFlotante from '@/config/swalFlotante'

const NUEVO_PRODUCTO = gql`
    mutation nuevoProducto ($input: ProductoInput) {
        nuevoProducto(input: $input) {
            id
            nombre
            existencia
            precio
            creado
        ,
        }
    }
`
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

const NuevoProducto = () => {

    const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
        update(cache, {data: {nuevoProducto}}){
            // Obtener el objeto de la cache para actualizar
            const {obtenerProductos} = cache.readQuery({query: OBTENER_PRODUCTOS})

            // Actualizamos la cache
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data:{
                    obtenerProductos: [...obtenerProductos, nuevoProducto]
                }
            })

        }
    })

    const router = useRouter()

    const formik = useFormik({
        initialValues:{
            nombre:'',
            existencia:'',
            precio:''
        },
        validationSchema:Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            existencia: Yup.number('La cantidad es numérica').required('La existencia es obligatoria').positive('La cantidad debe ser positiva').integer('La cantidad debe ser entera'),
            precio: Yup.number().required('El precio es obligatorio').positive('La precio debe ser positivo')
        }),
        onSubmit: async valores =>{
            try {
                console.log("Entra al boton nuevo producto")
                const {nombre, existencia, precio} = valores
                const {data} =  await nuevoProducto({
                    variables:{
                        input:{
                            nombre,
                            existencia,
                            precio
                        }
                    }
                })
                swalFlotante.fire({
                    icon:'success',
                    title:'Ingreso de producto exitoso'
                })
                setTimeout(() => {
                    // Redireccionar
                    router.push("/productos")
                }, 1500);
            } catch (error) {
                console.log(error)
            }
        }
    })

    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Nuevo Producto</h1>
            <div className='flex justify-center mt-5'>
                    <div className='w-full max-w-lg'>
                        <form className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4' 
                            onSubmit={formik.handleSubmit}
                        >
                            <div className='mb-4'>
                                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'>Nombre: </label>
                                <input 
                                    className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    id='nombre'
                                    type='text'
                                    placeholder='Nombre Producto'
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
                                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='existencia'>Cantidad Disponible Producto: </label>
                                <input 
                                    className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    id='existencia'
                                    type='number'
                                    placeholder='Cantidad Disponible Producto'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.existencia}
                                ></input>
                            </div>
                            { formik.touched.existencia && formik.errors.existencia ? (
                                <div className='text-left my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                    <p className='font-bold'>Error</p>
                                    <p>{formik.errors.existencia}</p>
                                </div>
                            ): null}
                            <div className='mb-4'>
                                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='precio'>Precio: </label>
                                <input 
                                    className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    id='precio'
                                    type='number'
                                    placeholder='Precio Producto'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.precio}
                                ></input>
                            </div>
                            { formik.touched.precio && formik.errors.precio ? (
                                <div className='text-left my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                    <p className='font-bold'>Error</p>
                                    <p>{formik.errors.precio}</p>
                                </div>
                            ): null}
                            
                            <input
                                type='submit'
                                className='rounded bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900'
                                value='Registrar Producto'
                            />
                            
                        </form>
                    </div>
            </div>
        </Layout>
    )
}

export default NuevoProducto