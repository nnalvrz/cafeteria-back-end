import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditarVenta({ venta, onUpdate, onCancel }) {
    const [formData, setFormData] = useState({
        estudiante_id: venta.estudiante_id || '',
        producto_id: venta.producto_id || '',
        cantidad: venta.cantidad || 1,
        fecha: venta.fecha || ''
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

        axios.put(`http://localhost:3000/ventas/${venta.id}`, formData)
            .then(() => {
                // Se ejecuta la actualización de inmediato y se cierra el modal sin mostrar alertas
                if (onUpdate) {
                    onUpdate();
                }
            })
            .catch(err => console.error('Error al actualizar venta:', err))
            .finally(() => setLoading(false));
    };

    return (
        <div style={styles.modalCard}>
            <div style={styles.header}>
                <span style={styles.icon}>✏️</span>
                <div>
                    <h3 style={styles.title}>Modificar Venta #{venta.id}</h3>
                    <p style={styles.subtitle}>Ajusta los detalles del ticket de consumo</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>ESTUDIANTE</label>
                    <select
                        name="estudiante_id"
                        value={formData.estudiante_id}
                        onChange={handleChange}
                        required
                        style={styles.selectInput}
                    >
                        <option value="" style={styles.optionItem}>Seleccione estudiante...</option>
                        {estudiantes.map(e => (
                            <option key={e.id} value={e.id} style={styles.optionItem}>
                                {e.nombre} - {e.grupo}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>PRODUCTO</label>
                    <select
                        name="producto_id"
                        value={formData.producto_id}
                        onChange={handleChange}
                        required
                        style={styles.selectInput}
                    >
                        <option value="" style={styles.optionItem}>Seleccione producto...</option>
                        {productos.map(p => (
                            <option key={p.id} value={p.id} style={styles.optionItem}>
                                {p.nombre} - ${Number(p.precio).toFixed(2)}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={styles.row}>
                    <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>CANTIDAD</label>
                        <input
                            type="number"
                            name="cantidad"
                            min="1"
                            value={formData.cantidad}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>FECHA</label>
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

                <div style={styles.buttonGroup}>
                    {onCancel && (
                        <button type="button" onClick={onCancel} style={styles.btnSecondary}>
                            Cancelar
                        </button>
                    )}
                    <button type="submit" style={styles.btnPrimary} disabled={loading}>
                        {loading ? 'Guardando...' : '💾 Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
}

const styles = {
    modalCard: {
        backgroundColor: '#1b1d22',
        borderRadius: '16px',
        padding: '28px',
        width: '90%',
        maxWidth: '480px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
        border: '1px solid #2a2e37',
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        borderBottom: '2px solid #2a2e37',
        paddingBottom: '12px'
    },
    icon: {
        fontSize: '1.8rem',
        backgroundColor: '#252932',
        padding: '8px 12px',
        borderRadius: '10px'
    },
    title: {
        margin: 0,
        color: '#ffee00', // Título en AMARILLO
        fontSize: '1.25rem',
        fontWeight: '700'
    },
    subtitle: {
        margin: '2px 0 0 0',
        color: '#00d2d3', // Subtítulo en CIEN/TURQUESA
        fontSize: '0.8rem'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    row: {
        display: 'flex',
        gap: '12px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        fontSize: '0.8rem',
        fontWeight: '600',
        color: '#a0a7b5',
        textTransform: 'uppercase'
    },
    input: {
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1.5px solid #3b4252',
        fontSize: '0.9rem',
        outline: 'none',
        backgroundColor: '#252932',
        color: '#ffee00', // Texto en AMARILLO
        fontWeight: '500'
    },
    selectInput: {
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1.5px solid #3b4252',
        fontSize: '0.9rem',
        outline: 'none',
        backgroundColor: '#252932',
        color: '#ffee00', // Texto desplegable en AMARILLO
        fontWeight: '500'
    },
    optionItem: {
        backgroundColor: '#252932',
        color: '#ffee00'
    },
    buttonGroup: {
        display: 'flex',
        justify: 'flex-end',
        gap: '10px',
        marginTop: '10px'
    },
    btnPrimary: {
        backgroundColor: '#ffee00', // Botón principal en AMARILLO
        color: '#1b1d22',
        border: 'none',
        padding: '10px 18px',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: '800',
        cursor: 'pointer'
    },
    btnSecondary: {
        backgroundColor: '#252932',
        color: '#a0a7b5',
        border: '1px solid #3b4252',
        padding: '10px 18px',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer'
    }
};

export default EditarVenta;