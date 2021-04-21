
$(document).ready(function () {

    LlenarTabla();


    $("#btnAddProveedor").click(function (e) {

        e.preventDefault();

        var id = document.getElementById("txtProveedorId").value;
        var nombre = document.getElementById("txtNombre").value;
        var direccion = document.getElementById("txtDireccion").value;
        var telefono = document.getElementById("txtTelefono").value;
        var correo = document.getElementById("txtCorreo").value;
        var nit = document.getElementById("txtNit").value;
   

        if (id > 0) {

            if (nombre != "" && direccion != "" && telefono != "" && correo != "" && nit != "" )
            {

                let url = host + 'api/Proveedores';
                var respuesta = null;

                fetch(url + "/" + id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "ProveedorId": id, "Nombre": nombre, "Direccion": direccion, "Telefono": telefono,
                        "Correo": correo, "NIT": nit, 
                    }),
                    cache: 'no-cache'
                })
                    .then(function (response) {
                        console.log(response);
                        return response.text();
                    })
                    .then(function (data) {

                        if (data != undefined && data != null && data != "") {
                            respuesta = JSON.parse(data);
                        }

                        LlenarTabla();
                        LimpiarForm();

                        Swal.fire('Registro modificado exitosamente', '', 'success');

                    })
                    .catch(function (err) {
                        console.log(err);
                    });

            }
            else {

                Swal.fire('Se deben completar todos los datos.', '', 'info');

            }

        }
        else {

            if (nombre != "" && direccion != "" && telefono != "" && correo != "" && nit != "") {

                    let url = host + 'api/Proveedores';
                    var respuesta = null;

                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "Nombre": nombre, "Direccion": direccion, "Telefono": telefono,
                            "Correo": correo, "NIT": nit, 
                        }),
                        cache: 'no-cache'
                    })
                    .then(function (response) {
                        console.log(response);
                        return response.text();
                    })
                    .then(function (data) {
                        respuesta = JSON.parse(data);

                        LlenarTabla();
                        LimpiarForm();

                        Swal.fire('Registro agregado exitosamente', '', 'success');


                    })
                    .catch(function (err) {
                        console.log(err);
                    });

            }
            else {

                Swal.fire('Se deben completar todos los datos.', '', 'info');

            }

        }

    });

});



//server azure
let host = "https://panaderianani.azurewebsites.net/";
/* let host = "https://localhost:5001/"; */
let list = [];

async function ObtenerDatos() {

    let url = host + 'api/Proveedores';

    var resp = await fetch(url)
        .then(function (response) {
            console.log(response);
            return response.text();
        })
        .then(function (data) {
            list = JSON.parse(data);
        })
        .catch(function (err) {
            console.log(err);
        });

}


async function LlenarTabla() {

    await ObtenerDatos();

    $('#dtProveedores').empty();

    console.table(list);

    list.forEach(function (elemento, indice, array) {

        if (indice == 0) {

            $('#dtProveedores').append('<thead> <tr> <th>No. </th> <th>Nombre</th> <th>Dirección</th> <th>Teléfono</th> <th>Correo</th> <th>NIT</th> <th>Operaciones</th> </tr> </thead>' +
                ' <tbody><tr> <td>' + elemento.proveedorId + '</td> <td>' + elemento.nombre + '</td> <td>' + elemento.direccion + '</td> <td>' + elemento.telefono + '</td> <td>' + elemento.correo + '</td> <td>' + elemento.nit + '</td>  <td><button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Modificar" onclick="RecuperarDatos(' + elemento.proveedorId + ');" null=""><i class="fa fa-pencil"></i></button> <button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Eliminar" onclick="Eliminar(' + elemento.proveedorId + ');" null=""><i class="fa fa-trash"></i></button> <button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Asignar Productos" onclick="AsignarProductos(' + elemento.proveedorId + ');" null=""><i class="fa fa-cubes"></i></button>  </td> </tr></tbody>');

        }
        else {

            $('#dtProveedores').append('<tr> <td>' + elemento.proveedorId + '</td> <td>' + elemento.nombre + '</td> <td>' + elemento.direccion + '</td> <td>' + elemento.telefono + '</td> <td>' + elemento.correo + '</td> <td>' + elemento.nit + '</td>  <td><button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Modificar" onclick="RecuperarDatos(' + elemento.proveedorId + ');" null=""><i class="fa fa-pencil"></i></button> <button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Eliminar" onclick="Eliminar(' + elemento.proveedorId + ');" null=""><i class="fa fa-trash"></i></button> <button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Asignar Productos" onclick="AsignarProductos(' + elemento.proveedorId + ');" null=""><i class="fa fa-cubes"></i></button> </td>');

        }

    })

}


async function RecuperarDatos(id) {

    var obj = {};

    let url = host + 'api/Proveedores';

    var resp = await fetch(url + "?id=" + id)
        .then(function (response) {
            console.log(response);
            return response.text();
        })
        .then(function (data) {

            if (data != undefined) {
                obj = JSON.parse(data);
            }
            else {
                console.log(data);
            }

            console.log(obj);

            document.getElementById("txtNombre").value = obj.nombre;
            document.getElementById("txtProveedorId").value = obj.proveedorId;
            document.getElementById("txtDireccion").value = obj.direccion;
            document.getElementById("txtTelefono").value = obj.telefono;
            document.getElementById("txtCorreo").value = obj.correo;
            document.getElementById("txtNit").value = obj.nit;
        })
        .catch(function (err) {
            console.log(err);
        });

}

async function Eliminar(id) {

    if (id > 0) {

        let url = host + 'api/Proveedores';
        var respuesta = null;

        fetch(url + "/" + id, {
            method: 'DELETE',
        })
            .then(function (response) {
                console.log(response);
                return response.text();
            })
            .then(function (data) {

                if (data != undefined && data != null && data != "") {
                    respuesta = JSON.parse(data);
                }

                LlenarTabla();

                Swal.fire('Registro eliminado exitosamente', '', 'success');

            })
            .catch(function (err) {
                console.log(err);
            });

    }

}


function AsignarProductos(id) {

    window.location.href = "asignarProductosProveedor.html?id=" + id;
}



function LimpiarForm() {

    document.getElementById("txtNombre").value = "";
    document.getElementById("txtProveedorId").value = "";
    document.getElementById("txtDireccion").value = "";
    document.getElementById("txtTelefono").value = "";
    document.getElementById("txtCorreo").value = "";
    document.getElementById("txtNit").value = "";


}

