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

function mostrarMensaje(
    zona,
    mensaje,
    esError
) {
    zona.innerHTML =
        '<div class="resultado' +
        (esError ? " error" : "") +
        '">' +
        escaparHtml(mensaje) +
        "</div>";
}

function obtenerRespuestaJson(
    respuesta,
    mensajeError
) {
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
}

function cargarNombresBacterias() {
    return peticionAutenticada(
        API_URL + "/bacterias"
    )
        .then(function (respuesta) {
            return obtenerRespuestaJson(
                respuesta,
                "No se pudieron cargar las bacterias."
            );
        })
        .then(function (bacterias) {
            const lista =
                document.getElementById(
                    "listaBacterias"
                );

            lista.innerHTML = "";

            bacterias.forEach(
                function (bacteria) {
                    const opcion =
                        document.createElement(
                            "option"
                        );

                    opcion.value =
                        bacteria.nombre;

                    lista.appendChild(opcion);
                }
            );
        });
}

function registrarBacteria(evento) {
    evento.preventDefault();

    const mensaje =
        document.getElementById(
            "mensajeBacteria"
        );

    const datos = {
        nombre:
            document
                .getElementById(
                    "nombreBacteria"
                )
                .value
                .trim(),

        familia:
            document
                .getElementById(
                    "familiaBacteria"
                )
                .value
                .trim(),

        descripcion:
            document
                .getElementById(
                    "descripcionBacteria"
                )
                .value
                .trim()
    };

    mostrarMensaje(
        mensaje,
        "Guardando bacteria...",
        false
    );

    peticionAutenticada(
        API_URL + "/bacterias",
        {
            method: "POST",
            body: JSON.stringify(datos)
        }
    )
        .then(function (respuesta) {
            return obtenerRespuestaJson(
                respuesta,
                "No se pudo registrar la bacteria."
            );
        })
        .then(function (resultado) {
            mostrarMensaje(
                mensaje,
                resultado.mensaje,
                false
            );

            document
                .getElementById(
                    "formBacteria"
                )
                .reset();

            return cargarNombresBacterias();
        })
        .catch(function (error) {
            mostrarMensaje(
                mensaje,
                error.message,
                true
            );
        });
}

function registrarResistencia(evento) {
    evento.preventDefault();

    const mensaje =
        document.getElementById(
            "mensajeResistencia"
        );

    const datos = {
        bacteria:
            document
                .getElementById(
                    "bacteriaResistencia"
                )
                .value
                .trim(),

        antibiotico:
            document
                .getElementById(
                    "antibioticoResistencia"
                )
                .value
                .trim(),

        nivel:
            document
                .getElementById(
                    "nivelResistencia"
                )
                .value
    };

    mostrarMensaje(
        mensaje,
        "Guardando resistencia...",
        false
    );

    peticionAutenticada(
        API_URL + "/resistencias",
        {
            method: "POST",
            body: JSON.stringify(datos)
        }
    )
        .then(function (respuesta) {
            return obtenerRespuestaJson(
                respuesta,
                "No se pudo registrar la resistencia."
            );
        })
        .then(function (resultado) {
            mostrarMensaje(
                mensaje,
                resultado.mensaje,
                false
            );

            document
                .getElementById(
                    "formResistencia"
                )
                .reset();
        })
        .catch(function (error) {
            mostrarMensaje(
                mensaje,
                error.message,
                true
            );
        });
}

document.addEventListener(
    "DOMContentLoaded",
    function () {
        const accesoPermitido =
            protegerPagina([
                "investigador"
            ]);

        if (!accesoPermitido) {
            return;
        }

        configurarNavegacion();

        cargarNombresBacterias()
            .catch(function (error) {
                const mensaje =
                    document.getElementById(
                        "mensajeResistencia"
                    );

                mostrarMensaje(
                    mensaje,
                    error.message,
                    true
                );
            });

        document
            .getElementById(
                "formBacteria"
            )
            .addEventListener(
                "submit",
                registrarBacteria
            );

        document
            .getElementById(
                "formResistencia"
            )
            .addEventListener(
                "submit",
                registrarResistencia
            );
    }
);
```
