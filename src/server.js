import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from '../src/routes/auth.routes.js'
import session from 'express-session'
import { isAuthenticated, isSupervisor } from "../src/middlewares/auth.js"

// # Cargamos variables de entorno desde .env
dotenv.config()

// # Middleware para parsear JSON en requests
const app = express()

// # Esto permite que Express entienda body en formato JSON sin necesidad de usar body-parser
app.use(express.json())



// # Elegimos la URL del frontend según entorno
const allowedOrigin = process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_PROD
    : process.env.FRONTEND_DEV

// # Middleware para permitir CORS (comunicación entre frontend y backend)
app.use(cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 🔑 aseguramos métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization']  // 🔑 headers permitidos
}))

// # Configuración de sesiones
// * Esto crea un objeto req.session que podemos usar en cualquier ruta
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret', // clave secreta
    resave: false,       // # No guardar sesión si no hubo cambios
    saveUninitialized: false, // # No guardar sesión vacía
    cookie: { secure: process.env.NODE_ENV === 'production' } // # true si usamos https
}))

// # Usar rutas de auth
app.use('/auth', authRoutes)

// # Leemos los usuarios del .env USERS=[JSON]
let users = []
try {
    users = JSON.parse(process.env.USERS || "[]")
} catch (error) {
    console.error("Error al parsear USERS en .env:", error)
}

// # Endpoint GET /users → devuelve todos los usuarios cargados / TEST
app.get('/users', (req, res) => {
    res.json(users)
})

// Ruta protegida
app.get("/protect-route", isAuthenticated, (req, res) => {
    res.json({ message: "Bienvenido la ruta para usuarios logueados", user: req.session.user })
})

// Ruta protegida para admin
app.get("/admin", isSupervisor, (req, res) => {
    res.json({ message: "Sección solo para supervisores" })
})

// # Definimos el puerto de la app (por defecto 4000 o el de Render)
const PORT = process.env.PORT || 4000

// # Iniciamos el servidor en el puerto definido
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`))
