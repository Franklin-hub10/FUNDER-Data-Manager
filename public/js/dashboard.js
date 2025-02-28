document.addEventListener("DOMContentLoaded", function () {
    const downloadBtn = document.getElementById("downloadBtn"); // Asegúrate de que el botón tenga este ID
 
    if (downloadBtn) {
        downloadBtn.addEventListener("click", function () {
            descargarTodo();
        });
    }
});
 
function descargarTodo() {
    const urls = [
        "http://localhost:3000/fichaDiagnostico/download-csv",
     //   "http://localhost:3000/fichaTecnica/download-csv",
    //   "http://localhost:3000/gestionComercial/download-csv",
    //   "http://localhost:3000/gestionOrganizacional/download-csv",
   //     "http://localhost:3000/gestionFinanciera/guardarRespuestasFinanciera"
    ];
 
    urls.forEach(url => {
        const link = document.createElement("a");
        link.href = url;
        link.download = ""; // Permite que el navegador maneje el nombre del archivo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
 
    alert("Las descargas han comenzado.");
}