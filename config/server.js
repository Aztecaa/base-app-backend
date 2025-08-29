import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

// 📌 Leemos los usuarios desde .env
let users = []
try {
    users = JSON.parse(process.env.USERS || "[]")
} catch (error) {
    console.error("Error al parsear USERS en .env:", error)
}

// 📌 Endpoint que devuelve los usuarios
app.get('/users', (req, res) => {
    res.json(users)
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`))