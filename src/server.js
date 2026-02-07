import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import http from "http";
import { Server } from "socket.io";

import authRoutes from '../src/routes/auth.routes.js';
import { isAuthenticated, isSupervisor } from "../src/middlewares/auth.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(express.json());

// CORS por entorno
const allowedOrigin = process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_PROD
    : process.env.FRONTEND_DEV;

app.use(cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Rutas auth
app.use('/auth', authRoutes);

// Users desde env
let users = [];
try {
    users = JSON.parse(process.env.USERS || "[]");
} catch (error) {
    console.error("Error al parsear USERS:", error);
}

app.get('/users', (req, res) => res.json(users));

app.get("/protect-route", isAuthenticated, (req, res) => {
    res.json({ message: "Ruta protegida", user: req.session.user });
});

app.get("/admin", isSupervisor, (req, res) => {
    res.json({ message: "Solo supervisores" });
});

// =======================
// SOCKET.IO
// =======================
const io = new Server(server, {
    cors: {
        origin: allowedOrigin,
        credentials: true,
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("🟢 Cliente conectado:", socket.id);
});

// =======================
// LISTEN
// =======================
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`🚀 Server + Socket.IO escuchando en ${PORT}`);
});
