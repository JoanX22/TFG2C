const API_URL = "/api";

function escaparHtml(valor) {
    if (valor === null || valor === undefined) {
        return "";
    }

    return String(valor).replace(
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

function cargarResistencias() {
    const zona =
        document.getElementById(
            "tablaResistencias"
        );

    zona.innerHTML =
        "<p>Cargando resistencias...</p>";

    peticionAutenticada(
        API_URL + "/resistencias"
    )
        .then(function (respuesta) {
            return respuesta
                .json()
                .then(function (datos) {
                    if (!respuesta.ok) {
                        throw new Error(
                            datos.error ||
                            "No se pudieron consultar las resistencias."
                        );
                    }

                    return datos;
                });
        })
        .then(function (resistencias) {
            if (resistencias.length === 0) {
                zona.innerHTML =
                    '<div class="resultado">' +
                    "No hay resistencias registradas." +
                    "</div>";

                return;
            }

            let html =
                '<div class="tabla-contenedor">' +
                    "<table>" +
                        "<thead>" +
                            "<tr>" +
                                "<th>Bacteria</th>" +
                                "<th>Antibiótico</th>" +
                                "<th>Nivel</th>" +
                            "</tr>" +
                        "</thead>" +
                        "<tbody>";

            resistencias.forEach(
                function (resistencia) {
                    html +=
                        "<tr>" +
                            "<td>" +
                                escaparHtml(
                                    resistencia.bacteria
                                ) +
                            "</td>" +

                            "<td>" +
                                escaparHtml(
                                    resistencia.antibiotico
                                ) +
                            "</td>" +

                            "<td>" +
                                escaparHtml(
                                    resistencia.nivel
                                ) +
                            "</td>" +
                        "</tr>";
                }
            );

            html +=
                        "</tbody>" +
                    "</table>" +
                "</div>";

            zona.innerHTML = html;
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
            protegerPagina([
                "medico",
                "investigador"
            ]);

        if (!accesoPermitido) {
            return;
        }

        configurarNavegacion();

        const boton =
            document.getElementById(
                "btnResistencias"
            );

        boton.addEventListener(
            "click",
            cargarResistencias
        );
    }
);
