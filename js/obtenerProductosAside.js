$(document).ready(function () {

    $("#previewImage").hide();
    LlenarTabla();
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


async function LlenarTabla() {

    await ObtenerDatos();

    $('#dtProductos').empty();

    console.table(list);

    list.forEach(function (elemento, indice, array) {

        if (indice == 0) {

            $('#dtProductos').append('<thead> <tr> <th>Código </th> <th>Descripión</th> <th>Precio</th> <th>Imagen</th> </tr> </thead>' +
                ' <tbody><tr> <td>' + elemento.productoId + '</td> <td>' + elemento.descripcion + '</td> <td>' + parseFloat(elemento.costoUnit).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td> <td> <center><img src=' + elemento.imagen + ' width=100/></center> </td></tr></tbody>');

        }
        else {

            $('#dtProductos').append('<tr> <td>' + elemento.productoId + '</td> <td>' + elemento.descripcion + '</td> <td>' + parseFloat(elemento.costoUnit).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td> <td> <center><img src=' + elemento.imagen + ' width=100/></center> </td></tr>');

        }

    })

}