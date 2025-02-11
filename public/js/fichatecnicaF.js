const API_FICHA_TECNICA = "http://localhost:3000/fichaTecnica";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formulario");
  const steps = document.querySelectorAll('.progress-steps .step');
  const line = document.querySelector('.progress-steps .line');

  // Función para actualizar la barra de progreso
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
    const progressWidth = (currentStep / (steps.length - 1)) * 100;
    line.style.width = `${progressWidth}%`;
  }

  // Inicializar (ajusta el paso activo según la página)
  updateProgress(0);

  // Redirección de los pasos (lógica de navegación)
  steps.forEach((step, index) => {
    step.addEventListener('click', () => {
      updateProgress(index);
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

  // Función de validación de cédula (módulo 10)
  function validateCedula(cedula) {
    if (!/^\d{10}$/.test(cedula)) return false;
    let total = 0;
    for (let i = 0; i < 9; i++) {
      let digit = parseInt(cedula[i]);
      if (i % 2 === 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      total += digit;
    }
    let verifier = (10 - (total % 10)) % 10;
    return verifier === parseInt(cedula[9]);
  }

  // Validación en tiempo real del número de identificación (solo para CI/DNI)
  document.getElementById("numeroIdentificacion").addEventListener("input", function() {
    const docType = document.getElementById("documento_identidad").value;
    const cedula = this.value;
    const errorSpan = document.getElementById("numeroIdentificacionError");

    if (docType === "ci_dni") {
      if (cedula.length === 10) {
        if (!validateCedula(cedula)) {
          errorSpan.style.display = "inline";
          errorSpan.textContent = "Cédula inválida";
        } else {
          errorSpan.style.display = "none";
        }
      } else {
        errorSpan.style.display = "inline";
        errorSpan.textContent = "Debe tener 10 dígitos";
      }
    } else {
      errorSpan.style.display = "none";
    }
  });

  // Funciones para mostrar/ocultar campos condicionales
  window.toggleVisaAmparo = function() {
    const select = document.getElementById("documento_identidad");
    const visaAmparoRow = document.getElementById("fila_visa_amparo");
    visaAmparoRow.style.display = (select.value === "visa_amparo") ? "table-row" : "none";
  };

  window.toggleExtranjeroFields = function() {
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
  };

  window.toggleOtroNegocio = function() {
    const tipoNegocio = document.getElementById("tipo_negocio").value;
    const otroNegocioRow = document.getElementById("fila_otro_negocio");
    otroNegocioRow.style.display = (tipoNegocio === "otro") ? "table-row" : "none";
  };

  window.calcularUtilidad = function() {
    const ingresos = parseFloat(document.getElementById("ingresos_mensuales").value) || 0;
    const gastos = parseFloat(document.getElementById("gastos_mensuales").value) || 0;
    document.getElementById("utilidad_mensual").value = (ingresos - gastos).toFixed(2);
  };

  // Envío del formulario
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const docType = document.getElementById("documento_identidad").value;
    const cedula = document.getElementById("numeroIdentificacion").value;
    if (docType === "ci_dni" && !validateCedula(cedula)) {
      alert("El número de identificación (cédula) es inválido. Corrija el valor antes de continuar.");
      return;
    }

    // Extraer nombres y apellidos
    const nombresApellidos = document.getElementById("nombres_apellidos").value.trim();
    const nombresArray = nombresApellidos.split(" ");
    const nombres = nombresArray[0] || "";
    const apellidos = nombresArray.slice(1).join(" ") || "";

    // Obtener nacionalidad y determinar el país a enviar
    const nacionalidad = document.getElementById("nacionalidad").value;
    const pais = (nacionalidad === "ecuatoriana")
                 ? "Ecuador"
                 : document.getElementById("pais").value;

    const data = {
      nombres: nombres,
      apellidos: apellidos,
      numeroIdentificacion: cedula,
      edad: parseInt(document.getElementById("edad").value),
      idSede: document.getElementById("sede_funder").value,
      generoIdentidad: document.getElementById("genero").value,
      estadoCivil: document.getElementById("estado_civil").value,
      numeroCargas: document.getElementById("numeroCargas").value,
      rolFamiliar: document.getElementById("rol_familiar").value,
      etnia: "N/A",
      discapacidad: "Ninguna",
      Nacionalidad: nacionalidad,
      pais: pais,
      estatusMigratorio: document.getElementById("estatus") ? document.getElementById("estatus").value : null,
      tiempoDeResidenciaPais: (nacionalidad === "extranjero")
                              ? new Date().toISOString().slice(0,10)
                              : null,
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
      temaCapacitacion: document.getElementById("temas_capacitacion").value
    };

    console.log("Datos a enviar:", data);

    try {
      const response = await fetch(API_FICHA_TECNICA + "/createFicha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Error al guardar ficha técnica");
      alert("Ficha guardada correctamente");
      window.location.href = "/public/screens/fichaDiagnostico.html";
    } catch (error) {
      console.error("Error al guardar ficha:", error);
    }
  });
});

// Funcionalidad del menú lateral y cierre de sesión
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

// Funcionalidad de Progreso (Progress Steps)
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

  // Establece el paso activo (ajusta según la página actual)
  updateProgress(0);

  steps.forEach((step, index) => {
    step.addEventListener('click', () => {
      updateProgress(index);
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
