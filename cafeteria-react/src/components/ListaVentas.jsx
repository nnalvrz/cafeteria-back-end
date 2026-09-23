import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditarVenta from './EditarVenta';

function ListaVentas() {
    const [ventas, setVentas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

    const cargarVentas = () => {
        axios.get('http://localhost:3000/ventas')
            .then(res => setVentas(res.data))
            .catch(err => console.error('Error al obtener ventas:', err))
            .finally(() => setCargando(false));
    };

    useEffect(() => {
        cargarVentas();
        const interval = setInterval(() => {
            cargarVentas();
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    // Eliminación directa e inmediata sin alertas ni confirmaciones
    const eliminarVenta = (id) => {
        axios.delete(`http://localhost:3000/ventas/${id}`)
            .then(() => cargarVentas())
            .catch(err => console.error('Error al eliminar venta:', err));
    };

    const totalGeneral = ventas.reduce((acc, curr) => acc + Number(curr.total || 0), 0);

    return (
        <div style={styles.container}>
            <div style={styles.headerBar}>
                <div>
                    <h2 style={styles.title}>Cafetería — Registro de Ventas</h2>
                    <p style={styles.subtitle}>Historial detallado de consumos estudiantiles</p>
                </div>
                <div style={styles.kpiCard}>
                    <span style={styles.kpiLabel}>Recaudado Total</span>
                    <strong style={styles.kpiValue}>${totalGeneral.toFixed(2)}</strong>
                </div>
            </div>

            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Estudiante</th>
                            <th style={styles.th}>Producto</th>
                            <th style={styles.th}>Cant.</th>
                            <th style={styles.th}>Precio Unit.</th>
                            <th style={styles.th}>Total</th>
                            <th style={styles.th}>Fecha</th>
                            <th style={styles.thCenter}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cargando && ventas.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={styles.tdEmpty}>Cargando ventas...</td>
                            </tr>
                        ) : ventas.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={styles.tdEmpty}>No hay ventas registradas aún.</td>
                            </tr>
                        ) : (
                            ventas.map(v => (
                                <tr key={v.id} style={styles.tr}>
                                    <td style={{ ...styles.td, fontWeight: '600', color: '#ffee00' }}>
                                        🎓 {v.estudiante}
                                    </td>
                                    <td style={styles.td}>
                                        <span style={styles.badgeProducto}>🍿 {v.producto}</span>
                                    </td>
                                    <td style={styles.td}>{v.cantidad}</td>
                                    <td style={styles.td}>${Number(v.precio).toFixed(2)}</td>
                                    <td style={{ ...styles.td, fontWeight: '700', color: '#ffee00' }}>
                                        ${Number(v.total).toFixed(2)}
                                    </td>
                                    <td style={styles.tdDate}>{v.fecha}</td>
                                    <td style={styles.tdCenter}>
                                        <button
                                            onClick={() => setVentaSeleccionada(v)}
                                            style={styles.btnEdit}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={() => eliminarVenta(v.id)}
                                            style={styles.btnDelete}
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {ventaSeleccionada && (
                <div style={styles.modalOverlay}>
                    <EditarVenta
                        venta={ventaSeleccionada}
                        onUpdate={() => {
                            setVentaSeleccionada(null);
                            cargarVentas();
                        }}
                        onCancel={() => setVentaSeleccionada(null)}
                    />
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '1000px',
        margin: '30px auto',
        padding: '0 10px',
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    },
    headerBar: {
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '15px'
    },
    title: {
        margin: 0,
        color: '#ffee00',
        fontSize: '1.6rem',
        fontWeight: '700'
    },
    subtitle: {
        margin: '4px 0 0 0',
        color: '#00d2d3',
        fontSize: '0.9rem'
    },
    kpiCard: {
        backgroundColor: '#252932',
        color: '#ffee00',
        padding: '12px 20px',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        border: '1.5px solid #ffee00',
        boxShadow: '0 0 10px rgba(255, 238, 0, 0.15)'
    },
    kpiLabel: {
        fontSize: '0.75rem',
        color: '#ffffff',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    kpiValue: {
        fontSize: '1.4rem',
        fontWeight: '700',
        color: '#ffee00'
    },
    tableWrapper: {
        backgroundColor: '#1b1d22',
        borderRadius: '14px',
        overflow: 'hidden',
        border: '1px solid #2a2e37'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left'
    },
    th: {
        backgroundColor: '#252932',
        color: '#00d2d3',
        padding: '14px 16px',
        fontSize: '0.85rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        borderBottom: '2px solid #3b4252'
    },
    thCenter: {
        backgroundColor: '#252932',
        color: '#00d2d3',
        padding: '14px 16px',
        fontSize: '0.85rem',
        textTransform: 'uppercase',
        textAlign: 'center',
        borderBottom: '2px solid #3b4252'
    },
    tr: {
        borderBottom: '1px solid #2a2e37'
    },
    td: {
        padding: '14px 16px',
        fontSize: '0.95rem',
        color: '#e0e0e0'
    },
    tdDate: {
        padding: '14px 16px',
        fontSize: '0.88rem',
        color: '#8a92a3'
    },
    tdCenter: {
        padding: '14px 16px',
        textAlign: 'center',
        display: 'flex',
        justify: 'center',
        gap: '8px'
    },
    tdEmpty: {
        textAlign: 'center',
        padding: '30px',
        color: '#8a92a3',
        fontStyle: 'italic'
    },
    badgeProducto: {
        backgroundColor: '#252932',
        color: '#ffee00',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '0.85rem',
        border: '1px solid #3b4252'
    },
    btnEdit: {
        backgroundColor: '#ffee00',
        color: '#1b1d22',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: '700'
    },
    btnDelete: {
        backgroundColor: '#ff4757',
        color: '#ffffff',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: '600'
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        justify: 'center',
        alignItems: 'center',
        zIndex: 1000
    }
};

export default ListaVentas;