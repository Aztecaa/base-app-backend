import { Router } from "express"

const router = Router()

// # Función auxiliar para leer usuarios desde .env
function getUsers() {
    try {
        return JSON.parse(process.env.USERS || "[]")
    } catch (error) {
        console.error("Error al parsear USERS en .env:", error)
        return []
    }
}

// # Endpoint POST /auth/login → recibe usuario y contraseña
router.post("/login", (req, res) => {
    const { username, password } = req.body  // # Credenciales del request
    const users = getUsers()                 // # Cargamos lista de usuarios

    // # Buscamos al usuario en la lista
    const user = users.find(u => u.username === username && u.password === password)

    if (!user) {
        return res.status(401).json({ message: "Credenciales inválidas" })
    }

    // # Guardamos el rol en la sesión
    // * Nos aseguramos de que req.session exista para no romper el código
    if (!req.session) {
        return res.status(500).json({ message: "Error: sesión no disponible" })
    }
    req.session.user = { username: user.username, role: user.role }

    return res.json({ message: `Bienvenido ${user.username}`, role: user.role })
})

// # Endpoint GET /auth/logout → destruye la sesión actual
router.get("/logout", (req, res) => {
    // * Verificamos que exista la sesión antes de destruirla
    if (!req.session) {
        return res.status(500).json({ message: "Error: sesión no disponible" })
    }
    req.session.destroy(() => {
        res.json({ message: "Sesión cerrada" })
    })
})

export default router