
$(document).ready(function () {

    var IdQS = getParameterByName('id');
    document.getElementById("txtOrdenCompraId").value = IdQS;

    console.log(IdQS);

    LlenarProductos();
    LlenarTabla();


    var idOrden = document.getElementById("txtOrdenCompraId").value;

    if (!(idOrden > 0)) {

        window.location.href = "../index.html";

    }



    $("#btnAddDetalle").click(function (e) {

        e.preventDefault();

        AgregarProducto();

    });


});


//server azure
let host = "https://panaderianani.azurewebsites.net/";
/* let host = "https://localhost:5001/"; */

let list = [];

async function ObtenerDatos() {

    let url = host + 'api/OrdenCompraDetalles';

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


let objProducto = {};

async function RecuperarProducto(id) {


    let url = host + 'api/Productos';

    var resp = await fetch(url + "?id=" + id)
        .then(function (response) {
            console.log(response);
            return response.text();
        })
        .then(function (data) {

            if (data != undefined) {
                objProducto = JSON.parse(data);
            }
            else {
                console.log(data);
            }

            console.log(objProducto);

        })
        .catch(function (err) {
            console.log(err);
        });

}


async function LlenarTabla() {

    var idOrden = document.getElementById("txtOrdenCompraId").value;

    await ObtenerDatos();
    await RecuperarPP();


    $('#dtDetalles').empty();

    console.table(list);

    var Acum = 0;

    document.getElementById("titleTb").innerHTML = "Agregar Productos - Orden: " + idOrden;

    var id = document.getElementById("txtOrdenCompraId").value;


    list.forEach(function (elemento, indice, array) {

        
        var boton = null;
        var productoDesc = null;


        boton = '<button class="btn null" data-toggle="tooltip" data-placement="bottom" title="Eliminar" onclick="Eliminar(' + elemento.ordenCompraDetalleId + ');" null=""><i class="fa fa-times"></i></button>';


        listPP.forEach(function (item, indice, array) {

            if (elemento.productoId == item.productoId) {

                productoDesc = item.descripcion;

            }

        });



        if (indice == 0) {

            $('#dtDetalles').append('<thead> <tr> <th>No. </th> <th>Orden de Compra</th> <th>Producto</th> <th>Cantidad</th> <th>Total</th> <th>Operaciones</th> </tr> </thead>' +
                ' <tbody></tbody>');

        }

        
        if (elemento.ordenCompraId == id) {


            Acum += elemento.total;

            $('#dtDetalles').append('<tr> <td>' + elemento.ordenCompraDetalleId + '</td> <td>' + elemento.ordenCompraId + '</td> <td>' + productoDesc + '</td> <td>' + elemento.cantidad + '</td> <td>' + parseFloat(elemento.total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td> <td> ' + boton + ' </td> </tr>');


            

        }

        if (indice == array.length - 1) {

            $('#dtDetalles').append('<tfoot><tr> <td></td> <td></td> <td></td> <td><b> Importe Total </b> </td> <td>' + parseFloat(Acum).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td> <td> </td> </tr><tfoot>');
        }


    })

}



async function Eliminar(id) {

    if (id > 0) {

        let url = host + 'api/OrdenCompraDetalles';
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


let listPP = [];

async function RecuperarPP() {


    let url = host + 'api/Productos';

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


async function AgregarProducto () {

    var id = document.getElementById("txtOrdenCompraId").value;

    var productoId = document.getElementById("slProducto").value;
    var cantidad = document.getElementById("txtCantidad").value;


    if (id > 0) {

        await RecuperarProducto(productoId);


        if (productoId > 0 && cantidad > 0) {

            let url = host + 'api/OrdenCompraDetalles'; 
            var respuesta = null;
            var total = objProducto.costoUnit * cantidad;

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "OrdenCompraId": id, "ProductoId": productoId, "Cantidad": cantidad, "Total": total,
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
    else {

        Swal.fire('No se ha podido agregar el registro.', '', 'warning');

    }

}


function getParameterByName(name) {

    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

}



function LimpiarForm() {

    $("#slProducto").val("").change();
    document.getElementById("txtCantidad").value = "";

}


async function LlenarProductos() {

    await RecuperarPP();
    await RecuperarProductosDisp();
    await ObtenerOrdenes();


    $("#slProducto").empty();
    $('#slProducto').append('<option value="" disabled selected>' + '--- Seleccione ---' + '</option>');

    console.log(listPP);

    var idOrden = document.getElementById("txtOrdenCompraId").value;
    var objDataOrden = {};
    var objProvEncont = {};


    listOrdenes.forEach(function (item) {

        if (item.ordenCompraId == idOrden) {

            objDataOrden = item;
            console.log("datos orden");
            console.log(objDataOrden);
        }

    })



    listPP.forEach(function (obj) {


        listProductosDisp.forEach(function (item) {

            if (objDataOrden.proveedorId == item.proveedorId && item.productoId == obj.productoId) {

                $('#slProducto').append('<option value="' + obj.productoId + '">' + obj.descripcion + '</option>');

            }

        })

    });

}



let listProductosDisp = [];

async function RecuperarProductosDisp() {


    let url = host + 'api/ProveedorProductos';

    var resp = await fetch(url)
        .then(function (response) {
            console.log(response);
            return response.text();
        })
        .then(function (data) {

            if (data != undefined) {
                listProductosDisp = JSON.parse(data);
            }
            else {
                console.log(data);
            }

            console.log(listProductosDisp);

        })
        .catch(function (err) {
            console.log(err);
        });

}



let listOrdenes = [];

async function ObtenerOrdenes() {

    let url = host + 'api/OrdenCompras';

    var resp = await fetch(url)
        .then(function (response) {
            console.log(response);
            return response.text();
        })
        .then(function (data) {
            listOrdenes = JSON.parse(data);
        })
        .catch(function (err) {
            console.log(err);
        });

}
