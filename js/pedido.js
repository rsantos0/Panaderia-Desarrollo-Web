
$(document).ready(function () {

    LlenarProveedores();

    LlenarTabla();


    $("#btnAddOrden").click(function (e) {

        e.preventDefault();

        var id = document.getElementById("txtOrdenId").value;
        var fecha = document.getElementById("slFecha").value;
        var fechaRec = document.getElementById("slFechaRec").value;
        var proveedor = document.getElementById("slProveedor").value;
        var total = "0";

        if (id > 0) {

            if (fecha != "" && fechaRec != "" && proveedor > 0 && total != "") {

                let url = host + 'api/OrdenCompras';
                var respuesta = null;

                fetch(url + "/" + id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "OrdenCompraId": id, "Fecha": fecha, "FechaRecepcion": fechaRec, "Total": total,
                        "ProveedorId": proveedor, "EstadoOrdenCompraId": 1,
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

            if (fecha != "" && fechaRec != "" && proveedor > 0 && total != "") {

                let url = host + 'api/OrdenCompras';
                var respuesta = null;

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "Fecha": fecha, "FechaRecepcion": fechaRec, "Total": total,
                        "ProveedorId": proveedor, "EstadoOrdenCompraId": 1,
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

    let url = host + 'api/OrdenCompras';

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


let listProveedores = [];

async function ObtenerProveedores() {

    let url = host + 'api/Proveedores';

    var resp = await fetch(url)
        .then(function (response) {
            console.log(response);
            return response.text();
        })
        .then(function (data) {
            listProveedores = JSON.parse(data);
        })
        .catch(function (err) {
            console.log(err);
        });

}



let listEstados = [];

async function ObtenerEstados() {

    let url = host + 'api/EstadoOrdenCompras';

    var resp = await fetch(url)
        .then(function (response) {
            console.log(response);
            return response.text();
        })
        .then(function (data) {
            listEstados = JSON.parse(data);
        })
        .catch(function (err) {
            console.log(err);
        });

}


async function LlenarTabla() {

    await ObtenerDatos();
    await ObtenerProveedores();
    await ObtenerEstados();

    $('#dtOrdenes').empty();

    console.table(list);


    list.forEach(function (elemento, indice, array) {

        var nombreProveedor = null;
        var estadoDesc = null;
        var boton = null;


        listProveedores.forEach(function (item, indice, array) {

            if (elemento.proveedorId == item.proveedorId) {

                nombreProveedor = item.nombre;
            }

        });

        listEstados.forEach(function (item, indice, array) {

            if (elemento.estadoOrdenCompraId == item.estadoOrdenCompraId) {

                estadoDesc = item.nombre;
            }

        });


        if (estadoDesc != 'Recibido') {
            botonMod= '<button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Modificar" onclick="RecuperarDatos(' + elemento.ordenCompraId + ');" null=""><i class="fa fa-pencil"></i></button>';
            botonAsignar= '<button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Asignar Productos" onclick="AsignarProductos(' + elemento.ordenCompraId + ');" null=""><i class="fa fa-cubes"></i></button>';
            boton = '<button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Marcar Recibido" onclick="MarcarRecibido(' + elemento.ordenCompraId + ');" null=""><i class="fa fa-check"></i></button>';
            botonVer = ''; 
        }
        else {
            botonMod='';
            botonAsignar='';
            botonVer = '<button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Ver detalle de orden" onclick="VerProductos(' + elemento.ordenCompraId + ');" null=""><i class="fa fa-eye"></i></button>';
            boton = '';
           
        }


        if (indice == 0) {

            $('#dtOrdenes').append('<thead> <tr> <th>No. </th> <th>Fecha</th> <th>Fecha Recepción Requerida</th> <th>Proveedor</th> <th>Estado</th> <th>Operaciones</th> </tr> </thead>' +
                ' <tbody><tr> <td>' + elemento.ordenCompraId + '</td> <td>' + elemento.fecha.split('T')[0] + '</td> <td>' + elemento.fechaRecepcion.split('T')[0] + '</td> <td>' + nombreProveedor + '</td>  <td>' + estadoDesc + '</td> <td> '+ botonMod +' <button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Eliminar" onclick="Eliminar(' + elemento.ordenCompraId + ');" null=""><i class="fa fa-trash"></i></button>   ' + botonAsignar + ' ' + botonVer + ' ' + boton + ' </td> </tr></tbody>');

        }
        else {

            $('#dtOrdenes').append('<tr> <td>' + elemento.ordenCompraId + '</td> <td>' + elemento.fecha.split('T')[0] + '</td> <td>' + elemento.fechaRecepcion.split('T')[0] + '</td> <td>' + nombreProveedor + '</td> <td>' + estadoDesc + '</td> <td>'+ botonMod +' <button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Eliminar" onclick="Eliminar(' + elemento.ordenCompraId + ');" null=""><i class="fa fa-trash"></i></button> ' + botonAsignar + ' ' + botonVer + ' ' + boton + '</td> </tr>');

        }

    })

}


async function RecuperarDatos(id) {

    var obj = {};

    let url = host + 'api/OrdenCompras';

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

            document.getElementById("txtOrdenId").value = obj.ordenCompraId;
            document.getElementById("slFecha").value = obj.fecha.split('T')[0];
            document.getElementById("slFechaRec").value = obj.fechaRecepcion.split('T')[0];
            $("#slProveedor").val(obj.proveedorId).change();


        })
        .catch(function (err) {
            console.log(err);
        });

}

async function Eliminar(id) {

    if (id > 0) {

        let url = host + 'api/OrdenCompras';
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

    window.location.href = "detalleOrden.html?id=" + id;
} 


function VerProductos(id) {

    window.location.href = "verDetalleOrden.html?id=" + id;
} 



function LimpiarForm() {

    document.getElementById("txtOrdenId").value = "";
    document.getElementById("slFecha").value = "";
    document.getElementById("slFechaRec").value = "";
    $("#slProveedor").val("").change();

}


let objProveedor = {};

async function RecuperarDatosProveedor(id) {


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


async function LlenarProveedores() {

    await ObtenerProveedores();

    $("#slProveedor").empty();
    $('#slProveedor').append('<option value="" disabled selected>' + '--- Seleccione ---' + '</option>');

    console.log(listProveedores);

    listProveedores.forEach(function (obj) {

        $('#slProveedor').append('<option value="' + obj.proveedorId + '">' + obj.nombre + '</option>');

    });

}


async function MarcarRecibido(id) {

    var obj = {};

    let url = host + 'api/OrdenCompras';

    var Acum = 0;


    await ObtenerDatosDetalles();
    await ObtenerProveedores();


    listDet.forEach(function (item, indice, array) {

        if (item.ordenCompraId == id) {

            Acum += item.total;
        }

    });


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

            if (obj && obj != undefined) {

                //
                var oProv = {};

                listProveedores.forEach(function (prov) {

                    if (obj.proveedorId == prov.proveedorId) {

                        oProv = prov;

                    }

                });
                //

                obj.estadoOrdenCompraId = 2;

                let url = host + 'api/OrdenCompras';
                var respuesta = null;

                fetch(url + "/" + id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(obj),
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
                    })



                        .catch(function (err) {
                            console.log(err);
                        });

                url = host + 'api/Proveedores';
                respuesta = null;

                oProv.saldo += Acum;

                fetch(url + "/" + obj.proveedorId, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(oProv),
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
                    })
                    .catch(function (err) {
                        console.log(err);
                    });



            }
            else {

                Swal.fire('No se ha podido actualizar el registro', '', 'warning');
            }


        })
        .catch(function (err) {
            console.log(err);
        });

}



let listDet = [];

async function ObtenerDatosDetalles() {

    let url = host + 'api/OrdenCompraDetalles';

    var resp = await fetch(url)
        .then(function (response) {
            console.log(response);
            return response.text();
        })
        .then(function (data) {
            listDet = JSON.parse(data);
        })
        .catch(function (err) {
            console.log(err);
        });

}

