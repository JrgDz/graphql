import React, {useState} from 'react';
import Layout from '@/components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { useQuery, useMutation, gql, InMemoryCache } from '@apollo/client';
import { useRouter } from 'next/router';
import swalFlotante from '@/config/swalFlotante';

const AUTENTICAR_USUARIO = gql`
    mutation autenticarUsuario ($input: AutenticarInput) {
        autenticarUsuario(input : $input) {
            token
        }
    }
`

const Login = () => {

    // routing
    const router = useRouter()

    // Mutation para crear nuevos usuarios
    const [autenticarUsuario]= useMutation(AUTENTICAR_USUARIO)

    const formik = useFormik({
        initialValues:{
            email:'', 
            password:''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('El email no es valido').required('El email es obligatorio'),
            password: Yup.string().required('El password es obligatorio')
        }),
        onSubmit: async valores => {
            try {
                const {email, password} = valores
                const {data} = await autenticarUsuario({
                    variables:{
                        input:{
                            email,
                            password
                        }
                    }
                })
                // console.log(data)
                // console.log(email)

                // Guardar el token en el storage
                const {token} = data.autenticarUsuario
                localStorage.setItem('token', token)

                swalFlotante.fire({
                    icon:'success',
                    title:'Inicio de sesión exitoso!'
                })

                // Redireccionar hacia clientes
                setTimeout(() => {
                    router.push('/')
                 }, 1500);

            } catch (error) {

                // console.log(error)

                swalFlotante.fire({
                    icon: 'error',
                    title: error.message.replace('GraphQL error: ', '')
                })
            }
        }
    })


    return (
        <>
            <Layout>
                <h1 className='text-center text-2xl text-white font-light'>Login</h1>

                <div className='flex justify-center mt-5'>
                    <div className='w-full max-w-sm'>
                        <form className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4' onSubmit={formik.handleSubmit}>
                            <div className='mb-4'>
                                <label className='text-left block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                                    Email
                                </label>
                                <input 
                                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    id='email'
                                    type='email'
                                    placeholder='Email Usuario'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                />
                            </div>
                            { formik.touched.email && formik.errors.email ? (
                                <div className='text-left my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                    <p className='font-bold'>Error</p>
                                    <p>{formik.errors.email}</p>
                                </div>
                            ): null}
                            <div className='mb-4'>
                                <label className='text-left block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                                    Password
                                </label>
                                <input 
                                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    id='password'
                                    type='password'
                                    placeholder='Password Usuario'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                />
                            </div>
                            { formik.touched.password && formik.errors.password ? (
                                <div className='text-left my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' >
                                    <p className='font-bold'>Error</p>
                                    <p>{formik.errors.password}</p>
                                </div>
                            ): null}
                            <input 
                                type="submit"
                                className='rounded bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900'
                                value="Iniciar Sesión"
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    );
}
 
export default Login;