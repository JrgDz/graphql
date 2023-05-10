const Usuario = require("../models/Usuario");
const Producto = require("../models/Producto");
const Cliente = require("../models/Cliente")
const Pedido = require("../models/Pedido")
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config({ path: 'variables.env' })

const crearToken = (usuario, secreta, expiresIn) => {
    const { id, email, nombre, apellido } = usuario;
    return jwt.sign({ id, nombre, apellido }, secreta, { expiresIn })
}

// resolver
const resolvers = {
    Query: {
        obtenerUsuario: async (_, {}, ctx) => {
            // const usuarioId = await jwt.verify(token, process.env.SECRETA)
            // return usuarioId
            return ctx.usuario
        },
        obtenerProductos: async () => {
            try {
                const productos = await Producto.find({});
                return productos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerProductoPorId: async (_, { id }) => {
            // Validar si existe el producto
            const existeProducto = await Producto.findById(id);
            if (!existeProducto) {
                throw new Error("El producto no existe")
            }
            return existeProducto
        },
        obtenerClientes: async () => {
            try {
                const clientes = await Cliente.find({})
                return clientes
            } catch (error) {
                console.log(error)
            }
        },
        obtenerClientesVendedor: async (_, { }, ctx) => {
            try {
                const clientes = await Cliente.find({ vendedor: ctx.usuario.id.toString() })
                return clientes
            } catch (error) {
                console.log(error)
            }
        },
        obtenerClientePorId: async (_, { id }, ctx) => {

            // Validar si el cliente existe
            let cliente = await Cliente.findById(id)
            if (!cliente) {
                throw new Error("El cliente no existe")
            }

            // Validar si el cliente tiene un vendedor asigando
            if (cliente.vendedor === undefined) {
                throw new Error("El cliente no tiene vendedor asigando")
            }

            // Validar que el cliente pertenezca al vendedor
            if (cliente.vendedor.toString() !== ctx.usuario.id) {
                throw new Error("El cliente no pertenece al vendedor: " + ctx.usuario.nombre + " " + ctx.usuario.apellido)
            }

            return cliente
        },
        obtenerPedidos: async () => {
            try {
                const pedidos = await Pedido.find({})
                return pedidos
            } catch (error) {
                console.log(error)
            }
        },
        obtenerPedidosPorVendedor: async (_, { }, ctx) => {

            // Validar si el vendedor tiene pedidos
            const existenPedidos = await Pedido.find({ vendedor: ctx.usuario.id })
            if (!existenPedidos) {
                throw new Error("El vendedor no tiene pedidos asignados")
            }

            return existenPedidos
        },
        obtenerPedidoPorId: async (_, { id }, ctx) => {

            //Validar que el pedido existe
            const existePedido = await Pedido.findById(id)
            if (!existePedido) {
                throw new Error("No existe pedido con el ID ingresado")
            }

            // Validar si el pedido pertenece al usuario logeado
            if (existePedido.vendedor.toString() !== ctx.usuario.id) {
                throw new Error("El pedido no pertenece al usuario logeado")
            }

            return existePedido
        },
        mejoresClientes: async () => {
            const clientes = await Pedido.aggregate([
                {$match : {estado:"COMPLETADO"}},
                { $group:{
                    _id: "$cliente",
                    total: {$sum:"$total"}
                }},
                {$lookup:{
                    from: "clientes",
                    localField: "_id",
                    foreignField: "_id",
                    as: "cliente"
                }},
                {$limit:2},
                {$sort:{"cliente.nombre":1}}
            ])
            return clientes
        },
        mejoresVendedores: async () =>{
            const vendedores = await Pedido.aggregate([
                {$match:{estado:"COMPLETADO"}},
                {$group:{
                    _id:"$vendedor",
                    total:{$sum:"$total"}
                }},
                {$lookup:{
                    from:"usuarios",
                    localField:"_id",
                    foreignField: "_id",
                    as:"vendedor"
                }},
                {$sort:{"total":-1}}
            ])
            return vendedores
        },
        buscarProducto: async (_, {texto}) =>{
            const productos = await Producto.find({ $text: {$search: texto}}).limit(10)
            return productos
        }
    },
    Mutation: {
        nuevoUsuario: async (_, { input }) => {

            const { email, password } = input

            // Validar si el usuario existe
            const existeUsuario = await Usuario.findOne({ email });
            if (existeUsuario) {
                throw new Error("El usuario ya está registrado")
            }

            // Hashear el password
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);

            // Guardar en la DB
            try {
                const usuario = new Usuario(input);
                const resultado = await usuario.save();
                return resultado;
            } catch (error) {
                console.log(error)
            }

        },

        autenticarUsuario: async (_, { input }) => {
            const { email, password } = input

            // Validar si el usuario existe
            const existeUsuario = await Usuario.findOne({ email });
            if (!existeUsuario) {
                throw new Error("El usuario no existe")
            }

            // Validar si el password es correcto
            const validarPassword = await bcryptjs.compare(password, existeUsuario.password)
            if (!validarPassword) {
                throw new Error("EL password es incorrecto")
            }

            // Crear el token
            return {
                token: crearToken(existeUsuario, process.env.SECRETA, '24h')
            }
        },

        nuevoProducto: async (_, { input }) => {
            const { nombre, existencia, precio } = input

            // Validar si el producto existe
            const existeProducto = await Producto.findOne({ nombre });
            if (existeProducto) {
                throw new Error("El producto ya existe")
            }

            // Guardar en la base de datos
            try {
                const producto = new Producto(input);
                const resultado = await producto.save();
                return resultado;
            } catch (error) {
                console.log(error)
            }
        },

        actualizarProducto: async (_, { id, input }) => {
            // Validar si existe el producto
            let producto = await Producto.findById(id);
            if (!producto) {
                throw new Error("El producto no existe")
            }

            producto = await Producto.findOneAndUpdate({ _id: id }, input, { new: true })
            return producto
        },

        eliminarProducto: async (_, { id }) => {
            let producto = await Producto.findById(id);
            if (!producto) {
                throw new Error("El producto no existe")
            }

            producto = await Producto.findByIdAndRemove(id)
            return "El producto " + producto.nombre + " fue eliminado"
        },

        nuevoCliente: async (_, { input }, ctx) => {

            console.log(ctx);
            const { email } = input

            // Validar si existe el cliente
            let cliente = await Cliente.findOne({ email });
            if (cliente) {
                throw new Error("El cliente ya existe");
            }
            cliente = new Cliente(input);

            // Asignar el vendedor
            cliente.vendedor = ctx.usuario.id

            // Guardar en la base de datos
            try {
                const resultado = await cliente.save();
                return resultado
            } catch (error) {
                console.log(error)
            }
        },

        actualizarCliente: async (_, { id, input }, ctx) => {

            // Validar que el cliente existe
            let cliente = await Cliente.findById(id)
            if (!cliente) {
                throw new Error("El cliente no existe")
            }

            // Validar que el cliente tenga vendedor asigando
            if (cliente.vendedor === undefined) {
                throw new Error("El usuario no tiene vendedor asigando")
            }

            // Validar que el cliente pertenece al vendedor
            if (cliente.vendedor.toString() !== ctx.usuario.id) {
                throw new Error("El cliente no pertenece al usuario logeado")
            }

            cliente = await Cliente.findOneAndUpdate({ _id: id }, input, { new: true })
            return cliente

        },

        eliminarCliente: async (_, { id }, ctx) => {
            // Validar que el cliente existe
            let cliente = await Cliente.findById(id)

            if (!cliente) {
                throw new Error("El cliente no existe")
            }

            // Validar que el cliente tenga vendedor asigando
            if (cliente.vendedor === undefined) {
                throw new Error("El usuario no tiene vendedor asigando")
            }

            // Validar que el cliente pertenece al vendedor
            if (cliente.vendedor.toString() !== ctx.usuario.id) {
                throw new Error("El cliente no pertenece al usuario logeado")
            }

            cliente = await Cliente.findByIdAndRemove(id)
            return "El cliente " + cliente.apellido + " " + cliente.nombre + " fue eliminado"
        },
        nuevoPedido: async (_, { input }, ctx) => {

            let total = 0

            const { cliente, pedido } = input

            // Validar si el cliente existe
            let clienteExiste = await Cliente.findById(cliente)
            if (!clienteExiste) {
                throw new Error("El cliente no existe")
            }

            // Validar si el cliente tiene vendedor asigando
            if (clienteExiste.vendedor === undefined) {
                throw new Error("El cliente no tiene vendedor asignado")
            }

            // Validar si el cliente es del vendedor
            if (clienteExiste.vendedor.toString() !== ctx.usuario.id) {
                throw new Error("El cliente no pertenece al usuario logeado")
            }

            // Validar stock disponible

            // El forEach no es asícrono
            // pedido.forEach( async articulo => {
            //     const {id, cantidad} = articulo

            //     const producto = await Producto.findById(id)

            //     const {nombre, existencia} = producto
            //     if(cantidad > existencia){
            //         console.log("El artículo " + nombre + " excede la cantidad disponible")
            //     }
            // });

            for await (const articulo of pedido) {

                const { id, cantidad } = articulo

                const producto = await Producto.findById(id)

                const { nombre, existencia } = producto

                if (cantidad > existencia) {
                    throw new Error("El artículo " + nombre + " excede la cantidad disponible")
                } else {
                    // Sumar el total
                    // total = total + (producto.precio * articulo.cantidad) //El cálculo se lo hace en el FRONTEND
                    // Restar del disponible
                    // producto.existencia = producto.existencia - articulo.cantidad
                    // await producto.save()
                    // Mostrar datos del producto
                    // articulo.detalle = producto
                }
            }
            for await (const articuloSave of pedido) {
                const productoSave = await Producto.findById(articuloSave.id)
                productoSave.existencia = productoSave.existencia - articuloSave.cantidad
                await productoSave.save()
            }

            // Crear el pedido
            // input.total = total //El cálculo se lo hace en el FRONTEND
            const nuevoPedido = new Pedido(input)

            // Asignar vendedor al pedido
            nuevoPedido.vendedor = ctx.usuario.id

            // Guardar pedido
            const resultado = await nuevoPedido.save()
            return resultado
        },
        actualizarPedido: async (_, { id, input }, ctx) => {
            let inexistentes = 0
            let contador = 0
            let total = 0

            const { pedido, cliente } = input

            // Validar si el pedido existe
            const existePedido = await Pedido.findById(id)
            if (!existePedido) {
                throw new Error("El pedido no existe")
            }

            // Validar si existe el cliente
            const existeCliente = await Cliente.findById(cliente)
            if (!existeCliente) {
                throw new Error("El cliente no existe")
            }

            // Validar si el cliente y el pedido pertenecen al usuario logeado
            if (ctx.usuario.id !== existeCliente.vendedor.toString()) {
                throw new Error("El cliente no le pertenece al usuario logeado")
            }

            if (ctx.usuario.id !== existePedido.vendedor.toString()) {
                throw new Error("El pedido no le pertenece al usuario logeado")
            }

            // Revisar el stock 
            if (pedido) {
                for await (const articulo of pedido) {
                    contador = contador + 1
                    const producto = await Producto.findById(articulo.id)
                    const { nombre, existencia } = producto
                    if (producto) {
                        if (articulo.cantidad > producto.existencia) {
                            console.log("El artículo " + nombre + " excede la cantidad disponible")
                            inexistentes = inexistentes + 1
                        } else {
                            // Sumar el total
                            total = total + (producto.precio * articulo.cantidad)
                            // Restar del disponible
                            producto.existencia = producto.existencia - articulo.cantidad
                            await producto.save()
                        }
                    } else {
                        inexistentes = inexistentes + 1
                    }
                }
            }

            // Guardar el pedido
            if (inexistentes < contador || contador === 0) {
                input.total = total
                const resultado = await Pedido.findOneAndUpdate({ _id: id }, input, { new: true })
                return resultado
            }

        }
    }
};

module.exports = resolvers