
$(document).ready(function () {

    var IdQS = getParameterByName('id');
    document.getElementById("txtOrdenCompraId").value = IdQS;

    console.log(IdQS);
    LlenarTabla();


    var idOrden = document.getElementById("txtOrdenCompraId").value;

    if (!(idOrden > 0)) {

        window.location.href = "../index.html";

    }
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




async function LlenarTabla() {

    var idOrden = document.getElementById("txtOrdenCompraId").value;

    await ObtenerDatos();
    await RecuperarPP();


    $('#dtDetalles').empty();

    console.table(list);

    var Acum = 0;

    document.getElementById("titleTb").innerHTML = "Detalle Productos de la Orden: " + idOrden;

    var id = document.getElementById("txtOrdenCompraId").value;


    list.forEach(function (elemento, indice, array) {

        
        var boton = null;
        var productoDesc = null;

        listPP.forEach(function (item, indice, array) {

            if (elemento.productoId == item.productoId) {

                productoDesc = item.descripcion;

            }

        });



        if (indice == 0) {

            $('#dtDetalles').append('<thead> <tr> <th>No. </th> <th>Orden de Compra</th> <th>Producto</th> <th>Cantidad</th> <th>Total</th>  </tr> </thead>' +
                ' <tbody></tbody>');

        }

        
        if (elemento.ordenCompraId == id) {


            Acum += elemento.total;

            $('#dtDetalles').append('<tr> <td>' + elemento.ordenCompraDetalleId + '</td> <td>' + elemento.ordenCompraId + '</td> <td>' + productoDesc + '</td> <td>' + elemento.cantidad + '</td> <td>' + parseFloat(elemento.total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td> </tr>');


            

        }

        if (indice == array.length - 1) {

            $('#dtDetalles').append('<tfoot><tr> <td></td> <td></td> <td></td> <td><b> Importe Total </b> </td> <td>' + parseFloat(Acum).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td> </tr><tfoot>');
        }


    })

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
