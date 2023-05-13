import React, {useEffect} from 'react'
import Layout from '@/components/Layout'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {useQuery, gql} from '@apollo/client'

const MEJORES_CLIENTES = gql `
    query MejoresClientes {
        mejoresClientes {
            total
            cliente {
                nombre
                apellido
            }
        }
    }
`

const MejoresClientes = () => {

    const {data, loading, error, startPolling, stopPolling} = useQuery(MEJORES_CLIENTES)

    useEffect(()=>{
        startPolling(1000)
        return()=>{
            stopPolling()
        }
    },[startPolling, stopPolling])

    if(loading) return 'Cargando...'
    
    const {mejoresClientes} = data

    const clienteGrafica = []

    mejoresClientes.map((cliente, index) => {
        clienteGrafica[index] = {
            ...cliente.cliente[0],
            total: cliente.total,
            nombreCompleto: cliente.cliente[0].apellido + ' ' + cliente.cliente[0].nombre
            
        }
    })

    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Mejores Clientes</h1>
            <BarChart
            className="mt-5"
            width={500}
            height={300}
            data={clienteGrafica}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombreCompleto" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#3182CE" />
            </BarChart>
        </Layout>
    )
}

export default MejoresClientes