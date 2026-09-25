require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Permite llamadas desde el Frontend en Vercel

// Verificar variables de entorno al arrancar el servidor
console.log('--- Comprobando variables de entorno ---');
console.log('DB_HOST:', process.env.DB_HOST ? 'Configurado' : 'FALTANTE');
console.log('DB_USER:', process.env.DB_USER ? 'Configurado' : 'FALTANTE');
console.log('DB_NAME:', process.env.DB_NAME ? 'Configurado' : 'FALTANTE');
console.log('DB_PORT:', process.env.DB_PORT || 3306);

// Pool de conexión con soporte SSL para Aiven
const conexion = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: { rejectUnauthorized: false }, // Cifrado SSL requerido por Aiven
  waitForConnections: true,
  connectionLimit: 10
});

// GET /ventas (JOIN múltiple)
app.get('/ventas', (req, res) => {
  const sql = `
    SELECT v.id, e.nombre AS estudiante, p.nombre AS producto,
    v.cantidad, v.fecha, p.precio, (v.cantidad * p.precio) AS total,
    v.estudiante_id, v.producto_id
    FROM ventas v
    INNER JOIN estudiantes e ON v.estudiante_id = e.id
    INNER JOIN productos p ON v.producto_id = p.id
  `;
  conexion.query(sql, (err, resultados) => {
    if (err) {
      console.error('❌ Error SQL en GET /ventas:', err.message);
      return res.status(500).json({ error: err.message, code: err.code });
    }
    res.json(resultados);
  });
});

// GET /estudiantes
app.get('/estudiantes', (req, res) => {
  conexion.query('SELECT * FROM estudiantes', (err, r) => {
    if (err) {
      console.error('❌ Error SQL en GET /estudiantes:', err.message);
      return res.status(500).json({ error: err.message, code: err.code });
    }
    res.json(r);
  });
});

// GET /productos
app.get('/productos', (req, res) => {
  conexion.query('SELECT * FROM productos', (err, r) => {
    if (err) {
      console.error('❌ Error SQL en GET /productos:', err.message);
      return res.status(500).json({ error: err.message, code: err.code });
    }
    res.json(r);
  });
});

// POST /ventas
app.post('/ventas', (req, res) => {
  const { estudiante_id, producto_id, cantidad, fecha } = req.body;
  conexion.query(
    'INSERT INTO ventas (estudiante_id, producto_id, cantidad, fecha) VALUES (?, ?, ?, ?)',
    [estudiante_id, producto_id, cantidad, fecha],
    (err) => {
      if (err) {
        console.error('❌ Error SQL en POST /ventas:', err.message);
        return res.status(500).json({ error: err.message, code: err.code });
      }
      res.send({ message: 'Venta registrada correctamente' });
    }
  );
});

// PUT /ventas/:id
app.put('/ventas/:id', (req, res) => {
  const id = req.params.id;
  const { estudiante_id, producto_id, cantidad, fecha } = req.body;
  conexion.query(
    'UPDATE ventas SET estudiante_id=?, producto_id=?, cantidad=?, fecha=? WHERE id=?',
    [estudiante_id, producto_id, cantidad, fecha, id],
    (err) => {
      if (err) {
        console.error('❌ Error SQL en PUT /ventas:', err.message);
        return res.status(500).json({ error: err.message, code: err.code });
      }
      res.send({ message: `Venta con ID ${id} actualizada` });
    }
  );
});

// DELETE /ventas/:id
app.delete('/ventas/:id', (req, res) => {
  const id = req.params.id;
  conexion.query('DELETE FROM ventas WHERE id=?', [id], (err) => {
    if (err) {
      console.error('❌ Error SQL en DELETE /ventas:', err.message);
      return res.status(500).json({ error: err.message, code: err.code });
    }
    res.send({ message: `Venta con ID ${id} eliminada` });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en puerto ${PORT}`);
});