import React, {useEffect} from 'react'
import Layout from '@/components/Layout'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {useQuery, gql} from '@apollo/client'

const MEJORES_VENDEDORES = gql `
    query MejoresVendedores {
        mejoresVendedores {
            total
            vendedor {
                nombre
                apellido
            }
        }
    } 
`

const MejoresVendedores = () => {

    const {data, loading, error, startPolling, stopPolling} = useQuery(MEJORES_VENDEDORES)

    useEffect(()=>{
        startPolling(1000)
        return()=>{
            stopPolling()
        }
    },[startPolling, stopPolling])

    if(loading) return 'Cargando...'
    
    const {mejoresVendedores} = data

    const vendedorGrafica = []

    mejoresVendedores.map((vendedor, index) => {
        vendedorGrafica[index] = {
            ...vendedor.vendedor[0],
            total: vendedor.total,
            nombreCompleto: vendedor.vendedor[0].apellido + ' ' + vendedor.vendedor[0].nombre
            
        }
    })

    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Mejores Vendedores</h1>
            <BarChart
            className="mt-5"
            width={500}
            height={300}
            data={vendedorGrafica}
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

export default MejoresVendedores