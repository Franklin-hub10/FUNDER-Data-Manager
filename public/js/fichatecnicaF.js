// URL base de la API de Ficha Técnica
const API_FICHA_TECNICA = "http://localhost:3000/fichaTecnica";

// --- Funciones existentes para el formulario ---
function toggleVisaAmparo() {
  const select = document.getElementById("documento_identidad");
  const visaAmparoRow = document.getElementById("fila_visa_amparo");
  visaAmparoRow.style.display = (select.value === "visa_amparo") ? "table-row" : "none";
}

function toggleExtranjeroFields() {
  const nacionalidad = document.getElementById("nacionalidad").value;
  const rowTiempoResidencia = document.getElementById("row_tiempo_residencia");
  const rowEstatus = document.getElementById("row_estatus");
  if (nacionalidad === "extranjero") {
    rowTiempoResidencia.style.display = "table-row";
    rowEstatus.style.display = "table-row";
    document.getElementById("años_residencia").required = true;
    document.getElementById("meses_residencia").required = true;
    document.getElementById("estatus").required = true;
  } else {
    rowTiempoResidencia.style.display = "none";
    rowEstatus.style.display = "none";
    document.getElementById("años_residencia").required = false;
    document.getElementById("meses_residencia").required = false;
    document.getElementById("estatus").required = false;
  }
}

function toggleOtroNegocio() {
  const tipoNegocio = document.getElementById("tipo_negocio").value;
  const otroNegocioRow = document.getElementById("fila_otro_negocio");
  otroNegocioRow.style.display = (tipoNegocio === "otro") ? "table-row" : "none";
}

function calcularUtilidad() {
  const ingresos = parseFloat(document.getElementById("ingresos_mensuales").value) || 0;
  const gastos = parseFloat(document.getElementById("gastos_mensuales").value) || 0;
  document.getElementById("utilidad_mensual").value = (ingresos - gastos).toFixed(2);
}

// --- Funcionalidad de envío del formulario ---
document.getElementById("formulario").addEventListener("submit", async function (event) {
  event.preventDefault();
  const data = {
    nombres: document.getElementById("nombres_apellidos").value.split(" ")[0],
    apellidos: document.getElementById("nombres_apellidos").value.split(" ").slice(1).join(" "),
    edad: parseInt(document.getElementById("edad").value),
    idSede: 1,
    generoIdentidad: document.getElementById("genero").value,
    estadoCivil: document.getElementById("estado_civil").value,
    numeroCargas: 0,
    rolFamiliar: document.getElementById("rol_familiar").value,
    etnia: "N/A",
    discapacidad: "Ninguna",
    Nacionalidad: document.getElementById("nacionalidad").value,
    pais: "Ecuador",
    estatusMigratorio: document.getElementById("estatus") ? document.getElementById("estatus").value : null,
    tiempoDeResidenciaPais: (document.getElementById("nacionalidad").value === "extranjero") ?
                            new Date().toISOString().slice(0,10) : null,
    direccion: document.getElementById("direccion_negocio").value,
    telefono1: document.getElementById("telefono_celular").value,
    telefono2: document.getElementById("telefono_convencional").value,
    correo: document.getElementById("email").value,
    servicioDeInternet: document.getElementById("servicioDeInternet").checked,
    celular: document.getElementById("celular").checked,
    computadora: document.getElementById("computadora").checked,
    tablet: document.getElementById("tablet").checked,
    nivelInstitucional: document.getElementById("instruccion").value,
    tipoNegocio: document.getElementById("tipo_negocio").value,
    actividadEconomica: document.getElementById("actividad_economica").value,
    promMensualIngreso: parseFloat(document.getElementById("ingresos_mensuales").value),
    promMensualGastos: parseFloat(document.getElementById("gastos_mensuales").value),
    promMensualUtilidad: parseFloat(document.getElementById("utilidad_mensual").value),
    caracteristicaDelNegocio: document.getElementById("caracteristicas_negocio").value,
    camposAsistenciaTecnica: document.getElementById("asistencia_tecnica").value,
    temaCapacitacion: document.getElementById("temas_capacitacion").value,
    idColaborador: null
  };

  try {
    const response = await fetch(API_FICHA_TECNICA + "/createFicha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Error al guardar ficha técnica");
    alert("Ficha guardada correctamente");
    // Redirigir a la página de Ficha Diagnóstico
    window.location.href = "/public/screens/fichaDiagnostico.html";
  } catch (error) {
    console.error("Error al guardar ficha:", error);
  }
});

// --- Funcionalidad del menú lateral y cierre de sesión ---
document.addEventListener("DOMContentLoaded", function () {
  const dropdownBtns = document.querySelectorAll('.dropdown-btn');
  dropdownBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      const container = this.nextElementSibling;
      if (container) container.classList.toggle('show');
    });
  });
  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', function (event) {
      event.preventDefault();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = './index.html';
    });
  }
});

// --- Funcionalidad de Progreso (Progress Steps) ---
// Esta funcionalidad se encarga de pintar los círculos y permitir la navegación entre páginas
document.addEventListener("DOMContentLoaded", function () {
  const steps = document.querySelectorAll('.progress-steps .step');
  const line = document.querySelector('.progress-steps .line');

  function updateProgress(currentStep) {
    steps.forEach((step, index) => {
      if (index < currentStep) {
        step.classList.add('completed');
        step.classList.remove('active');
      } else if (index === currentStep) {
        step.classList.add('active');
        step.classList.remove('completed');
      } else {
        step.classList.remove('active', 'completed');
      }
    });
    line.style.width = `${(currentStep / (steps.length - 1)) * 100}%`;
  }

  // En la página de Ficha Técnica, queremos que el primer paso (índice 0) esté activo.
  updateProgress(0);

  // Al hacer clic en un paso, redirigir a la página correspondiente
  steps.forEach((step, index) => {
    step.addEventListener('click', () => {
      updateProgress(index);
      // Define las rutas de las páginas en orden (ajusta según tus rutas reales)
      const pages = [
        '/public/screens/fichaTecnica.html',
        '/public/screens/fichaDiagnostico.html',
        '/public/screens/gestionOrganizacional.html',
        '/public/screens/gestionProductiva.html',
        '/public/screens/gestionComercial.html',
        '/public/screens/gestionFinanciera.html'
      ];
      if (pages[index]) window.location.href = pages[index];
    });
  });
});
