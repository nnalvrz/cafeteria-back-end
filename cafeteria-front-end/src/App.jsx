import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListaVentas from './components/ListaVentas';
import FormularioVenta from './components/FormularioVenta';

function App() {
    const [ventas, setVentas] = useState([]);
    const [cargando, setCargando] = useState(true);

    // Función para obtener la lista de ventas actualizada desde la API
    const cargarVentas = () => {
        setCargando(true);
        axios.get('http://localhost:3000/ventas')
            .then(res => setVentas(res.data))
            .catch(err => console.error('Error al obtener ventas:', err))
            .finally(() => setCargando(false));
    };

    // Cargar ventas la primera vez que se monta la aplicación
    useEffect(() => {
        cargarVentas();
    }, []);

    return (
        <div style={styles.appContainer}>
            <header style={styles.header}>
                <h1 style={styles.title}>☕ Cafetería Escolar</h1>
                <p style={styles.subtitle}>Sistema de Control y Registro de Ventas</p>
            </header>

            <main style={styles.mainContent}>
                {/* Se pasa la función cargarVentas para ejecutarse tras guardar */}
                <FormularioVenta onVentaRegistrada={cargarVentas} />

                {/* Se pasa el estado de ventas y las funciones de recarga */}
                <ListaVentas 
                    ventas={ventas} 
                    cargando={cargando} 
                    onUpdate={cargarVentas} 
                />
            </main>
        </div>
    );
}

const styles = {
    appContainer: {
        backgroundColor: '#121214',
        minHeight: '100vh',
        color: '#ffffff',
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        padding: '20px'
    },
    header: {
        textAlign: 'center',
        padding: '20px 0 10px 0',
        borderBottom: '1px solid #332228',
        marginBottom: '20px'
    },
    title: {
        margin: 0,
        color: '#ffd700',
        fontSize: '2.2rem',
        fontWeight: '700',
        letterSpacing: '0.5px'
    },
    subtitle: {
        margin: '6px 0 0 0',
        color: '#b0b0b0',
        fontSize: '1rem'
    },
    mainContent: {
        maxWidth: '1100px',
        margin: '0 auto'
    }
};

export default App; 