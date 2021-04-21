$(document).ready(function () {

    var IdQS = getParameterByName('id');
    document.getElementById("txtProveedorId").value = IdQS;

    console.log(IdQS);


    if (IdQS > 0) {

        RecuperarProveedor(IdQS);
    }


    LlenarTabla();


    var idProveedor = document.getElementById("txtProveedorId").value;

    if (!(idProveedor > 0)) {

        window.location.href = "../pages/proveedores.html";

    }

});


//server azure
let host = "https://panaderianani.azurewebsites.net/";
/* let host = "https://localhost:5001/"; */

let list = [];

async function ObtenerDatos() {

    let url = host + 'api/Productos';

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


let objProveedor = {};

async function RecuperarProveedor(id) {


    let url = host + 'api/Proveedores';

    var resp = await fetch(url + "?id=" + id)
        .then(function (response) {
            console.log(response);
            return response.text();
        })
        .then(function (data) {

            if (data != undefined) {
                objProveedor = JSON.parse(data);
            }
            else {
                console.log(data);
            }

            console.log(objProveedor);

        })
        .catch(function (err) {
            console.log(err);
        });

}


async function LlenarTabla() {

    var idProveedor = document.getElementById("txtProveedorId").value;

    await ObtenerDatos();
    await RecuperarProveedor(idProveedor);
    await RecuperarPP();


    $('#dtProductos').empty();

    console.table(list);

    document.getElementById("titleTb").innerHTML = "Asignar Productos - Proveedor: " + objProveedor.nombre;

    list.forEach(function (elemento, indice, array) {

        var encontrado = false;
        var valEncont = 0;
        var estado = "No asignado";

        listPP.forEach(function (item, indice, array) {

            if (item.productoId == elemento.productoId && objProveedor.proveedorId == item.proveedorId) {

                encontrado = true;
                valEncont = item.ProveedorProductoId;
            }

        })



        var boton = null;

        if (encontrado) {

            estado = "Asignado";

            boton = '<button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Quitar" onclick="Quitar(' + valEncont + ');" null=""><i class="fa fa-times"></i></button>';

        }
        else {

            boton = '<button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Asignar" onclick="Asignar(' + elemento.productoId + ');" null=""><i class="fa fa-check"></i></button>';

        }


        if (indice == 0) {

            $('#dtProductos').append('<thead> <tr> <th>No. </th> <th>Descripión</th> <th>Precio Unitario</th> <th>Estado</th> <th>Operaciones</th> </tr> </thead>' +
                ' <tbody><tr> <td>' + elemento.productoId + '</td> <td>' + elemento.descripcion + '</td> <td>' + parseFloat(elemento.costoUnit).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td> <td>' + estado + '</td> <td> ' + boton + '  </td> </tr></tbody>');

        }
        else {

            $('#dtProductos').append('<tr> <td>' + elemento.productoId + '</td> <td>' + elemento.descripcion + '</td> <td>' + parseFloat(elemento.costoUnit).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td> <td>' + estado + '</td> <td> ' + boton + '  </td> </tr>');

        }

    })

}


async function RecuperarDatos(id) {

    var obj = {};

    let url = host + 'api/Productos';

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

            document.getElementById("txtProductoId").value = obj.productoId;
            document.getElementById("txtDescripcion").value = obj.descripcion;
            document.getElementById("txtCosto").value = parseFloat(obj.costoUnit).toFixed(2);


        })
        .catch(function (err) {
            console.log(err);
        });

}

async function Quitar(id) {

    if (id > 0) {

        let url = host + 'api/ProveedorProductos';
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

                Swal.fire('Registro quitado exitosamente', '', 'success');

            })
            .catch(function (err) {
                console.log(err);
            });

    }

}


function Asignar(id) {

    var idProveedor = document.getElementById("txtProveedorId").value;


    if (id > 0 && idProveedor > 0) {

        let url = host + 'api/ProveedorProductos';
        var respuesta = null;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "ProductoId": id, "ProveedorId": idProveedor,
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

                Swal.fire('Registro asignado exitosamente', '', 'success');


            })
            .catch(function (err) {
                console.log(err);
            });

    }
    else {

        Swal.fire('No se ha podido asignar el registro.', '', 'warning');
    }


}


let listPP = [];

async function RecuperarPP() {


    let url = host + 'api/ProveedorProductos';

    var resp = await fetch(url)
        .then(function (response) {
            console.log(response);
            return response.text();
        })
        .then(function (data) {

            if (data != undefined) {
                listPP = JSON.parse(data);
            }
            else {
                console.log(data);
            }

            console.log(listPP);

        })
        .catch(function (err) {
            console.log(err);
        });

}


function getParameterByName(name) {

    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

}

