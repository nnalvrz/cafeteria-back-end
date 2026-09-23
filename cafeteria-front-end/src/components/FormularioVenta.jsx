import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FormularioVenta({ onVentaRegistrada }) {
    const [formData, setFormData] = useState({
        estudiante_id: '',
        producto_id: '',
        cantidad: '',
        fecha: new Date().toISOString().split('T')[0]
    });

    const [estudiantes, setEstudiantes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:3000/estudiantes')
            .then(res => setEstudiantes(res.data))
            .catch(err => console.error('Error al cargar estudiantes:', err));

        axios.get('http://localhost:3000/productos')
            .then(res => setProductos(res.data))
            .catch(err => console.error('Error al cargar productos:', err));
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        axios.post('http://localhost:3000/ventas', formData)
            .then(res => {
                // Limpiar formulario
                setFormData({
                    estudiante_id: '',
                    producto_id: '',
                    cantidad: '',
                    fecha: new Date().toISOString().split('T')[0]
                });

                // Actualizar automáticamente la lista sin recargar la página
                if (onVentaRegistrada) {
                    onVentaRegistrada();
                }
            })
            .catch(err => {
                console.error('Error al registrar venta:', err);
            })
            .finally(() => setLoading(false));
    };

    const productoSeleccionado = productos.find(p => p.id === parseInt(formData.producto_id));
    const totalEstimado = productoSeleccionado && formData.cantidad ? (productoSeleccionado.precio * formData.cantidad).toFixed(2) : '0.00';

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <span style={styles.icon}>☕</span>
                <div>
                    <h2 style={styles.title}>Registrar Nueva Venta</h2>
                    <p style={styles.subtitle}>Gestión de pedidos de la Cafetería</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Estudiante</label>
                    <select
                        name="estudiante_id"
                        value={formData.estudiante_id}
                        onChange={handleChange}
                        required
                        style={styles.selectInput}
                    >
                        <option value="" style={styles.optionItem}>👤 Seleccione un estudiante...</option>
                        {estudiantes.map(e => (
                            <option key={e.id} value={e.id} style={styles.optionItem}>
                                {e.nombre} ({e.grupo || 'Sin grupo'})
                            </option>
                        ))}
                    </select>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Producto / Snack</label>
                    <select
                        name="producto_id"
                        value={formData.producto_id}
                        onChange={handleChange}
                        required
                        style={styles.selectInput}
                    >
                        <option value="" style={styles.optionItem}>🥪 Seleccione un producto...</option>
                        {productos.map(p => (
                            <option key={p.id} value={p.id} style={styles.optionItem}>
                                {p.nombre} — ${Number(p.precio).toFixed(2)}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={styles.row}>
                    <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>Cantidad</label>
                        <input
                            type="number"
                            name="cantidad"
                            min="1"
                            placeholder="Ej. 2"
                            value={formData.cantidad}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>Fecha de Compra</label>
                        <input
                            type="date"
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                </div>

                {productoSeleccionado && (
                    <div style={styles.summaryBox}>
                        <span>Total estimado:</span>
                        <strong style={styles.summaryPrice}>${totalEstimado}</strong>
                    </div>
                )}

                <button type="submit" style={styles.btnPrimary} disabled={loading}>
                    {loading ? 'Procesando...' : '🛒 Confirmar y Registrar Venta'}
                </button>
            </form>
        </div>
    );
}

const styles = {
    card: {
        backgroundColor: '#1e1e24',
        borderRadius: '16px',
        padding: '28px',
        maxWidth: '520px',
        margin: '20px auto',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        border: '1px solid #332228',
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        marginBottom: '24px',
        borderBottom: '2px solid #3d1b24',
        paddingBottom: '16px'
    },
    icon: {
        fontSize: '2.4rem',
        backgroundColor: '#3d1b24',
        padding: '10px 14px',
        borderRadius: '12px'
    },
    title: {
        margin: 0,
        color: '#f1c40f',
        fontSize: '1.4rem',
        fontWeight: '700'
    },
    subtitle: {
        margin: '4px 0 0 0',
        color: '#b0b0b0',
        fontSize: '0.85rem'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
    },
    row: {
        display: 'flex',
        gap: '14px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#ffd700',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    input: {
        padding: '12px 14px',
        borderRadius: '8px',
        border: '1.5px solid #f1c40f',
        fontSize: '0.95rem',
        outline: 'none',
        backgroundColor: '#2b2b36',
        color: '#ffd700'
    },
    selectInput: {
        padding: '12px 14px',
        borderRadius: '8px',
        border: '1.5px solid #f1c40f',
        fontSize: '0.95rem',
        outline: 'none',
        backgroundColor: '#2b2b36',
        color: '#ffd700'
    },
    optionItem: {
        backgroundColor: '#2b2b36',
        color: '#ffd700',
        padding: '10px'
    },
    summaryBox: {
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2b1e24',
        padding: '12px 16px',
        borderRadius: '8px',
        borderLeft: '4px solid #f1c40f',
        color: '#e0e0e0'
    },
    summaryPrice: {
        fontSize: '1.2rem',
        color: '#ffd700'
    },
    btnPrimary: {
        backgroundColor: '#6b1d2f',
        color: '#ffd700',
        border: '1px solid #f1c40f',
        padding: '14px',
        borderRadius: '10px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: '8px',
        boxShadow: '0 4px 12px rgba(107, 29, 47, 0.4)'
    }
};

export default FormularioVenta;