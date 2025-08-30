// # Middleware para verificar si hay un usuario logueado
export function isAuthenticated(req, res, next) {
    if (!req.session.user) {
        return res.status(403).json({ message: "No autenticado" })
    }
    next()  // # Si hay sesión activa → pasamos al siguiente middleware/endpoint
}

// # Middleware para verificar si el usuario es supervisor
// * Esto te permite proteger rutas críticas que solo debería usar un rol específico.
export function isSupervisor(req, res, next) {
    if (req.session.user?.role !== "supervisor") {
        return res.status(403).json({ message: "Acceso denegado" })
    }
    next()
}
