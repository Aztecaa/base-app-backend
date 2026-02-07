// routes/productos.js
import express from "express";
import { productos } from "../store/stock.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.json(productos);
});

router.post("/", (req, res) => {
    let {
        codigo = "",
        nombre = "",
        precio = 0,
        cantidadUnidadesSueltas = 0,
    } = req.body;

    if (!codigo || !nombre) {
        return res.status(400).json({ ok: false, msg: "Faltan datos obligatorios" });
    }

    cantidadUnidadesSueltas = Number(cantidadUnidadesSueltas) || 0;
    precio = Number(precio) || 0;

    const existente = productos.find(p => p.codigo === codigo);

    if (existente) {
        existente.cantidadUnidadesSueltas += cantidadUnidadesSueltas;
        existente.precio = precio;
    } else {
        productos.push({
            codigo,
            nombre,
            precio,
            cantidadUnidadesSueltas,
        });
    }

    // 🔴 NO socket acá
    res.json({ ok: true, productos });
});

export default router;
