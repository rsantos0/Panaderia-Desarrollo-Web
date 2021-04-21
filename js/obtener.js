

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

            $('#dtProductos').append('<thead> <tr> <th>Código </th> <th>Descripión</th> <th>Precio Unitario</th> <th>Imagen</th> <th>Existencia</th> </tr> </thead>' +
                ' <tbody><tr> <td>' + elemento.productoId + '</td> <td>' + elemento.descripcion + '</br></br><label for="CodCantidad" >' + "Cantidad:" +'</label><input type="number" class="input"  id="Cantidad"></td> <td>' + parseFloat(elemento.costoUnit).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</br>  <button type="button" class="btn btn-success" id="btnsave">Agregar al carrito</button></td> <td> <center><img src=' + elemento.imagen + ' width=100/></center> </td> <td>' + elemento.existecia + '</td>   </tr></tbody>');

        }
        else {

            $('#dtProductos').append('<tr> <td>' + elemento.productoId + '</td> <td>' + elemento.descripcion + '</br></br><label for="CodCantidad" >' + "Cantidad:" +'</label><input type="number" class="input"  id="Cantidad"></td> <td>' + parseFloat(elemento.costoUnit).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</br>  <button type="button" class="btn btn-success" id="btnsave">Agregar al carrito</button> </td> <td> <center><img src=' + elemento.imagen + ' width=100/></center> </td> <td>' + elemento.existecia + '</td>   </tr>');

        }

    })

}

