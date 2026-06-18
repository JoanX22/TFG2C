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

function obtenerJsonProtegido(
    url,
    mensajeError
) {
    return peticionAutenticada(url)
        .then(function (respuesta) {
            return respuesta
                .json()
                .then(function (datos) {
                    if (!respuesta.ok) {
                        throw new Error(
                            datos.error ||
                            mensajeError
                        );
                    }

                    return datos;
                });
        });
}

function cargarBacterias() {
    const zona =
        document.getElementById(
            "tablaBacterias"
        );

    zona.innerHTML =
        "<p>Cargando información...</p>";

    Promise.all([
        obtenerJsonProtegido(
            API_URL + "/bacterias",
            "No se pudieron consultar las bacterias."
        ),

        obtenerJsonProtegido(
            API_URL + "/resistencias",
            "No se pudieron consultar las resistencias."
        )
    ])
        .then(function (resultados) {
            const bacterias = resultados[0];
            const resistencias = resultados[1];

            if (bacterias.length === 0) {
                zona.innerHTML =
                    '<div class="resultado">' +
                    "No hay bacterias registradas." +
                    "</div>";

                return;
            }

            let html =
                '<div class="tabla-contenedor">' +
                    "<table>" +
                        "<thead>" +
                            "<tr>" +
                                "<th>Bacteria</th>" +
                                "<th>Familia</th>" +
                                "<th>Descripción</th>" +
                                "<th>Antibiótico</th>" +
                                "<th>Nivel</th>" +
                            "</tr>" +
                        "</thead>" +
                        "<tbody>";

            bacterias.forEach(
                function (bacteria) {
                    const resistenciasBacteria =
                        resistencias.filter(
                            function (resistencia) {
                                return (
                                    resistencia.bacteria ===
                                    bacteria.nombre
                                );
                            }
                        );

                    if (
                        resistenciasBacteria.length === 0
                    ) {
                        html +=
                            "<tr>" +
                                "<td>" +
                                    escaparHtml(
                                        bacteria.nombre
                                    ) +
                                "</td>" +

                                "<td>" +
                                    escaparHtml(
                                        bacteria.familia
                                    ) +
                                "</td>" +

                                "<td>" +
                                    escaparHtml(
                                        bacteria.descripcion
                                    ) +
                                "</td>" +

                                "<td>Sin información</td>" +
                                "<td>Sin información</td>" +
                            "</tr>";

                        return;
                    }

                    resistenciasBacteria.forEach(
                        function (resistencia) {
                            html +=
                                "<tr>" +
                                    "<td>" +
                                        escaparHtml(
                                            bacteria.nombre
                                        ) +
                                    "</td>" +

                                    "<td>" +
                                        escaparHtml(
                                            bacteria.familia
                                        ) +
                                    "</td>" +

                                    "<td>" +
                                        escaparHtml(
                                            bacteria.descripcion
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
                "btnBacterias"
            );

        boton.addEventListener(
            "click",
            cargarBacterias
        );
    }
);
