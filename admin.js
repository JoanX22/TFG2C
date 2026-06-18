```js
const API_URL = "/api";

function escaparHtml(valor) {
    return String(valor || "").replace(
        /[&<>"']/g,
        function (caracter) {
            const equivalencias = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return equivalencias[caracter];
        }
    );
}

function cargarEstado() {
    const zona =
        document.getElementById("estadoSistema");

    zona.innerHTML =
        "<p>Consultando estado...</p>";

    peticionAutenticada(
        API_URL + "/admin/estado"
    )
        .then(function (respuesta) {
            return respuesta
                .json()
                .then(function (datos) {
                    if (!respuesta.ok) {
                        throw new Error(
                            datos.error ||
                            "No se pudo consultar el estado."
                        );
                    }

                    return datos;
                });
        })
        .then(function (datos) {
            zona.innerHTML =
                '<div class="resultado">' +
                    "<h3>Estado técnico</h3>" +

                    "<p><strong>API:</strong> " +
                        escaparHtml(datos.api) +
                    "</p>" +

                    "<p><strong>Base de datos:</strong> " +
                        escaparHtml(datos.base_datos) +
                    "</p>" +

                    "<p><strong>Fecha del servidor:</strong> " +
                        escaparHtml(datos.fecha_servidor) +
                    "</p>" +

                    "<p><strong>Tiempo activo:</strong> " +
                        escaparHtml(
                            datos.tiempo_activo_segundos
                        ) +
                        " segundos</p>" +
                "</div>";
        })
        .catch(function (error) {
            zona.innerHTML =
                '<div class="resultado error">' +
                    escaparHtml(error.message) +
                "</div>";
        });
}

document.addEventListener(
    "DOMContentLoaded",
    function () {
        const accesoPermitido =
            protegerPagina(["administrador"]);

        if (!accesoPermitido) {
            return;
        }

        configurarNavegacion();

        const boton =
            document.getElementById(
                "btnActualizarEstado"
            );

        boton.addEventListener(
            "click",
            cargarEstado
        );
    }
);
```
