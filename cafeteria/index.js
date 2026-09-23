const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(cors());

// Conexión a MySQL
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cafeteria'
});

conexion.connect((err) => {
    if (err) {
        console.error('Error al conectar con MySQL:', err);
        return;
    }

    console.log('Conectado a MySQL');
});

// ================================
// ESTUDIANTES
// ================================

// Obtener todos los estudiantes
app.get('/estudiantes', (req, res) => {

    conexion.query(
        'SELECT * FROM estudiantes',
        (err, results) => {

            if (err) {
                return res.status(500).send(err);
            }

            res.json(results);
        }
    );

});

// Obtener un estudiante por ID
app.get('/estudiantes/:id', (req, res) => {

    const { id } = req.params;

    conexion.query(
        'SELECT * FROM estudiantes WHERE id = ?',
        [id],
        (err, results) => {

            if (err) {
                return res.status(500).send(err);
            }

            res.json(results);
        }
    );

});

// Crear estudiante
app.post('/estudiantes', (req, res) => {

    const { nombre, grupo } = req.body;

    conexion.query(
        'INSERT INTO estudiantes (nombre, grupo) VALUES (?, ?)',
        [nombre, grupo],
        (err, result) => {

            if (err) {
                return res.status(500).send(err);
            }

            res.send({
                message: 'Estudiante registrado correctamente',
                id: result.insertId
            });
        }
    );

});

// Actualizar estudiante
app.put('/estudiantes/:id', (req, res) => {

    const { id } = req.params;
    const { nombre, grupo } = req.body;

    conexion.query(
        'UPDATE estudiantes SET nombre = ?, grupo = ? WHERE id = ?',
        [nombre, grupo, id],
        (err, result) => {

            if (err) {
                return res.status(500).send(err);
            }

            res.send({
                message: 'Estudiante actualizado correctamente'
            });
        }
    );

});

// Eliminar estudiante
app.delete('/estudiantes/:id', (req, res) => {

    const { id } = req.params;

    conexion.query(
        'DELETE FROM estudiantes WHERE id = ?',
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).send(err);
            }

            res.send({
                message: 'Estudiante eliminado correctamente'
            });
        }
    );

});


// ================================
// PRODUCTOS
// ================================

// Obtener todos los productos
app.get('/productos', (req, res) => {

    conexion.query(
        'SELECT * FROM productos',
        (err, results) => {

            if (err) {
                return res.status(500).send(err);
            }

            res.json(results);
        }
    );

});

// Obtener producto por ID
app.get('/productos/:id', (req, res) => {

    const { id } = req.params;

    conexion.query(
        'SELECT * FROM productos WHERE id = ?',
        [id],
        (err, results) => {

            if (err) {
                return res.status(500).send(err);
            }

            res.json(results);
        }
    );

});

// Crear producto
app.post('/productos', (req, res) => {

    const { nombre, precio } = req.body;

    conexion.query(
        'INSERT INTO productos (nombre, precio) VALUES (?, ?)',
        [nombre, precio],
        (err, result) => {

            if (err) {
                return res.status(500).send(err);
            }

            res.send({
                message: 'Producto registrado correctamente',
                id: result.insertId
            });
        }
    );

});

// Actualizar producto
app.put('/productos/:id', (req, res) => {

    const { id } = req.params;
    const { nombre, precio } = req.body;

    conexion.query(
        'UPDATE productos SET nombre = ?, precio = ? WHERE id = ?',
        [nombre, precio, id],
        (err, result) => {

            if (err) {
                return res.status(500).send(err);
            }

            res.send({
                message: 'Producto actualizado correctamente'
            });
        }
    );

});

// Eliminar producto
app.delete('/productos/:id', (req, res) => {

    const { id } = req.params;

    conexion.query(
        'DELETE FROM productos WHERE id = ?',
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).send(err);
            }

            res.send({
                message: 'Producto eliminado correctamente'
            });
        }
    );

});


// ================================
// VENTAS
// ================================

// Obtener todas las ventas
app.get('/ventas', (req, res) => {

    const sql = `
        SELECT 
            v.id,
            v.estudiante_id,
            v.producto_id,
            e.nombre AS estudiante,
            p.nombre AS producto,
            v.cantidad,
            v.fecha,
            p.precio,
            (v.cantidad * p.precio) AS total
        FROM ventas v
        INNER JOIN estudiantes e 
            ON v.estudiante_id = e.id
        INNER JOIN productos p 
            ON v.producto_id = p.id
    `;

    conexion.query(sql, (err, results) => {

        if (err) {
            return res.status(500).send(err);
        }

        res.json(results);
    });

});

// Obtener una venta por ID
app.get('/ventas/:id', (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT 
            v.id,
            e.nombre AS estudiante,
            p.nombre AS producto,
            v.cantidad,
            v.fecha,
            p.precio,
            (v.cantidad * p.precio) AS total
        FROM ventas v
        INNER JOIN estudiantes e 
            ON v.estudiante_id = e.id
        INNER JOIN productos p 
            ON v.producto_id = p.id
        WHERE v.id = ?
    `;

    conexion.query(sql, [id], (err, results) => {

        if (err) {
            return res.status(500).send(err);
        }

        res.json(results);
    });

});

// Registrar nueva venta
app.post('/ventas', (req, res) => {

    const {
        estudiante_id,
        producto_id,
        cantidad,
        fecha
    } = req.body;

    conexion.query(
        `INSERT INTO ventas 
        (estudiante_id, producto_id, cantidad, fecha)
        VALUES (?, ?, ?, ?)`,
        [
            estudiante_id,
            producto_id,
            cantidad,
            fecha
        ],
        (err, result) => {

            if (err) {
                return res.status(500).send(err);
            }

            res.send({
                message: 'Venta registrada correctamente',
                id: result.insertId
            });
        }
    );

});

// Actualizar venta
app.put('/ventas/:id', (req, res) => {

    const { id } = req.params;

    const {
        estudiante_id,
        producto_id,
        cantidad,
        fecha
    } = req.body;

    conexion.query(
        `UPDATE ventas 
        SET estudiante_id = ?, 
            producto_id = ?, 
            cantidad = ?, 
            fecha = ?
        WHERE id = ?`,
        [
            estudiante_id,
            producto_id,
            cantidad,
            fecha,
            id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).send(err);
            }

            res.send({
                message: 'Venta actualizada correctamente'
            });
        }
    );

});

app.delete('/ventas/:id', (req, res) => {

    const id = req.params.id;

    conexion.query(
        'DELETE FROM ventas WHERE id=?',
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).send(err);
            }

            res.send({
                message: `Venta con ID ${id} eliminada`
            });

        }
    );

});
// Eliminar venta
app.delete('/ventas/:id', (req, res) => {

    const { id } = req.params;

    conexion.query(
        'DELETE FROM ventas WHERE id = ?',
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).send(err);
            }

            res.send({
                message: 'Venta eliminada correctamente'
            });
        }
    );

});


// ================================
// INICIAR SERVIDOR
// ================================

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});