const downloadBtn1 = document.getElementById("downloadBtn1");
const downloadBtn2 = document.getElementById("downloadBtn2");
const downloadBtn3 = document.getElementById("downloadBtn3");
const downloadBtn4 = document.getElementById("downloadBtn4");
const downloadBtn5 = document.getElementById("downloadBtn5");
const downloadBtn6 = document.getElementById("downloadBtn6");
 
(downloadBtn1)
downloadBtn1.addEventListener("click", function (event) {
    event.preventDefault(); // Evita la redirección inmediata
    const confirmacion = confirm("¿Estás seguro de que deseas descargar este archivo?");
    if (confirmacion) {
        window.location.href = "http://localhost:3000/fichaTecnica/download-csv";
    }
});
 
 
(downloadBtn2)
downloadBtn2.addEventListener("click", function (event) {
    event.preventDefault(); // Evita la redirección inmediata
    const confirmacion = confirm("¿Estás seguro de que deseas descargar este archivo?");
    if (confirmacion) {
        window.location.href = "http://localhost:3000/fichaDiagnostico/download-csv";
    }
});
 
 
(downloadBtn3)
downloadBtn3.addEventListener("click", function (event) {
    event.preventDefault(); // Evita la redirección inmediata
    const confirmacion = confirm("¿Estás seguro de que deseas descargar este archivo?");
    if (confirmacion) {
        window.location.href = "http://localhost:3000/gestionComercial/download-csv";
    }
});
 
 
(downloadBtn4)
downloadBtn4.addEventListener("click", function (event) {
    event.preventDefault(); // Evita la redirección inmediata
    const confirmacion = confirm("¿Estás seguro de que deseas descargar este archivo?");
    if (confirmacion) {
        window.location.href = "http://localhost:3000/gestionFinanciera/download-csv";
    }
});
 
 
(downloadBtn5)
downloadBtn5.addEventListener("click", function (event) {
    event.preventDefault(); // Evita la redirección inmediata
    const confirmacion = confirm("¿Estás seguro de que deseas descargar este archivo?");
    if (confirmacion) {
        window.location.href = "http://localhost:3000/gestionOrganizacional/download-csv";
    }
});
 
 
(downloadBtn6)
downloadBtn6.addEventListener("click", function (event) {
    event.preventDefault(); // Evita la redirección inmediata
    const confirmacion = confirm("¿Estás seguro de que deseas descargar este archivo?");
    if (confirmacion) {
        window.location.href = "http://localhost:3000/gestionProductiva/download-csv";
    }
});
 
 


  document.addEventListener("DOMContentLoaded", () => {
    const idColaborador = localStorage.getItem("idColaborador");

    if (!idColaborador) {
      console.warn("⚠️ No se encontró idColaborador en localStorage.");
      return;
    }

    console.log("✅ idColaborador encontrado:", idColaborador);

    // Si necesitas asignarlo a un campo oculto en un formulario
    const idColaboradorField = document.getElementById("idColaborador");
    if (idColaboradorField) {
      idColaboradorField.value = idColaborador;
    }
  });

