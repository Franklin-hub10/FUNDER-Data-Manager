const downloadBtn1 = document.getElementById("downloadBtn1");
const downloadBtn2 = document.getElementById("downloadBtn2");


// Solo agregar eventos si el botón existe en el DOM
if (downloadBtn1) {
    downloadBtn1.addEventListener("click", function (event) {
        event.preventDefault(); // Evita la redirección inmediata
        const confirmacion = confirm("¿Estás seguro de que deseas descargar este archivo?");
        if (confirmacion) {
            window.location.href = "http://localhost:3000/fichaTecnica/download-csv";
        }
    });
}

if (downloadBtn2) {
    downloadBtn2.addEventListener("click", function () {
        window.location.href = "http://localhost:3000/fichaDiagnostico/download-csv";
    });
}
