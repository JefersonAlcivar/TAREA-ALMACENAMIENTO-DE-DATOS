document.getElementById('cedula').addEventListener('input', function() {
    const cedula = document.getElementById('cedula');
    if (cedula.value.length > 10) {
        cedula.value = cedula.value.slice(0, 10);
    }
});

document.getElementById('telefono').addEventListener('input', function() {
    const telefono = document.getElementById('telefono');
    if (telefono.value.length > 10) {
        telefono.value = telefono.value.slice(0, 10);
    }
});

document.getElementById('clientForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const cedula = document.getElementById('cedula').value;
    const apellidos = document.getElementById('apellidos').value;
    const nombres = document.getElementById('nombres').value;
    const direccion = document.getElementById('direccion').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;

    // Validaciones
    const cedulaRegex = /^\d{10}$/;
    const nombreApellidoRegex = /^[a-zA-ZñÑ\s]+$/; // Permitir letras y "ñ"
    const direccionRegex = /^[\s\S]+$/; // Permitir cualquier carácter
    const telefonoRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Permitir caracteres especiales

    if (!cedulaRegex.test(cedula)) {
        alert('La cédula debe contener exactamente 10 dígitos.');
        return;
    }

    if (!nombreApellidoRegex.test(apellidos)) {
        alert('Los apellidos deben contener solo letras.');
        return;
    }

    if (!nombreApellidoRegex.test(nombres)) {
        alert('Los nombres deben contener solo letras.');
        return;
    }

    if (!direccionRegex.test(direccion)) {
        alert('La dirección es inválida.');
        return;
    }

    if (!telefonoRegex.test(telefono)) {
        alert('El teléfono debe contener exactamente 10 dígitos.');
        return;
    }

    if (!emailRegex.test(email)) {
        alert('El correo electrónico no es válido.');
        return;
    }

    // Almacenamiento local de múltiples clientes
    const cliente = { cedula, apellidos, nombres, direccion, telefono, email };
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];

    // Verificar si la cédula ya está registrada
    const cedulaExistente = clientes.find(c => c.cedula === cedula);
    if (cedulaExistente) {
        alert('Los datos ya han sido guardados anteriormente.');
        return;
    }

    clientes.push(cliente);
    localStorage.setItem('clientes', JSON.stringify(clientes));
    document.getElementById('responseMessage').innerText = 'Datos guardados exitosamente.';

});

// Exportar a TXT
document.getElementById('exportTextButton').addEventListener('click', function() {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const blob = new Blob([JSON.stringify(clientes, null, 2)], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'clientes.txt';
    link.click();
});

// Exportar a Excel
document.getElementById('exportExcelButton').addEventListener('click', function() {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    
    const wb = XLSX.utils.book_new();
    const ws_data = [
        ["Cédula", "Apellidos", "Nombres", "Dirección", "Teléfono", "Correo Electrónico"],
        ...clientes.map(cliente => [
            cliente.cedula,
            cliente.apellidos,
            cliente.nombres,
            cliente.direccion,
            cliente.telefono,
            cliente.email
        ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    
    // Estilos
    const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "007bff" } }
    };
    
    const range = XLSX.utils.decode_range(ws['!ref']);
    for(let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = XLSX.utils.encode_cell({ c: C, r: 0 });
        if (!ws[cell_address]) continue;
        ws[cell_address].s = headerStyle;
    }

    XLSX.utils.book_append_sheet(wb, ws, "Clientes");
    
    XLSX.writeFile(wb, "clientes.xlsx");
});

// Borrar registros
document.getElementById('deleteRecordsButton').addEventListener('click', function() {
    if (confirm('¿Estás seguro de que deseas borrar todos los registros?')) {
        localStorage.removeItem('clientes');
        document.getElementById('responseMessage').innerText = 'Todos los registros han sido borrados.';
    }
});
