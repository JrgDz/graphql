import {ApolloProvider} from '@apollo/client'
import client from '@/config/apollo'
import PedidoState from '@/context/pedidos/PedidoState'

// import '@/styles/globals.css'

// export default function App({ Component, pageProps }) {
//   return(
//     <ApolloProvider>
//       <Component {...pageProps} />
//     </ApolloProvider>  
//   ) 
    
// }

const MyApp = ({Component, pageProps}) => {
  return(
      <ApolloProvider client={client}>
        <PedidoState>
          <Component {...pageProps} />
        </PedidoState>
      </ApolloProvider> 
  )
}

export default MyApp