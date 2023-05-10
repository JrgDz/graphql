const {ApolloServer, gql} = require("apollo-server");
const typeDefs = require("./db/schema")
const resolvers = require("./db/resolvers")
const jwt = require('jsonwebtoken')
const conectarDB = require("./config/db")

// Conectar a la base de datos
conectarDB();

// servidor
const server = new ApolloServer({
    typeDefs, 
    resolvers, 
    context: ({req}) => {
        // console.log(req.headers['authorization'])

        // console.log(req.headers)

        const token = req.headers['authorization'] || '';
        if (token){
            try {
                const usuario = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETA)
                console.log(usuario)
                return{usuario}
            } catch (error) {
                console.log("Hubo un error en el CONTEXT")
                console.log(error)
            }
        }
    }
});

// arrancar servidor
server.listen().then( ({url})=>{
    console.log(`Servidor listo en la URL ${url}`)
})