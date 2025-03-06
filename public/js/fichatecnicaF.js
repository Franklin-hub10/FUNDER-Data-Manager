const API_FICHA_TECNICA = "http://localhost:3000/fichaTecnica/createFicha";

document.addEventListener("DOMContentLoaded", async function () {
  const form = document.getElementById("formulario");
  const steps = document.querySelectorAll('.progress-steps .step');
  const line = document.querySelector('.progress-steps .line');
  const downloadBtn1 = document.getElementById("downloadBtn1");

  // Obtener el id del colaborador logueado desde el localStorage
  const idColaborador = localStorage.getItem("idColaborador");

  if (!idColaborador) {
      console.warn("⚠️ No se encontró idColaborador en localStorage. Asegúrate de estar logueado.");
      return;
  }

  console.log("✅ idColaborador del usuario logueado:", idColaborador);

  // Asignar el idColaborador a un campo oculto si existe en el formulario
  const idColaboradorField = document.getElementById("idColaborador");
  if (idColaboradorField) {
      idColaboradorField.value = idColaborador;
  }

  // Obtener la sede del colaborador logueado desde el localStorage
  const sedeFunder = localStorage.getItem("sedeFunder");

  if (sedeFunder) {
    document.getElementById("sede_funder_display").innerText = sedeFunder; // Muestra la sede en el campo correspondiente
  } else {
    console.warn("⚠️ No se encontró sedeFunder en localStorage.");
  }

  // Configurar el botón de descarga
  if (downloadBtn1) {
    downloadBtn1.addEventListener("click", function (event) {
      event.preventDefault(); // Evita la redirección inmediata
      const confirmacion = confirm("¿Estás seguro de que deseas descargar este archivo?");
      if (confirmacion) {
        window.location.href = "http://localhost:3000/fichaTecnica/download-csv";
      }
    });
  }

  // ✅ Función para actualizar la barra de progreso
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

  // ✅ Inicializar barra de progreso
  updateProgress(0);

  // ✅ Redirección entre pasos
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

  // ✅ Validación de cédula ecuatoriana (módulo 10)
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

  // ✅ Validación en tiempo real del número de cédula
  document.getElementById("numeroIdentificacion").addEventListener("input", function () {
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

  // ✅ Mostrar/ocultar campo Visa Amparo
  window.toggleVisaAmparo = function () {
    const select = document.getElementById("documento_identidad");
    const visaAmparoRow = document.getElementById("fila_visa_amparo");
    visaAmparoRow.style.display = (select.value === "visa_amparo") ? "table-row" : "none";
  };

  // ✅ Mostrar/ocultar campos para extranjeros
  window.toggleExtranjeroFields = function () {
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

  // ✅ Mostrar/ocultar campo Otro Negocio
  window.toggleOtroNegocio = function () {
    const tipoNegocio = document.getElementById("tipo_negocio").value;
    const otroNegocioRow = document.getElementById("fila_otro_negocio");
    otroNegocioRow.style.display = (tipoNegocio === "otro") ? "table-row" : "none";
  };

  // ✅ Envío del formulario
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const idColaborador = localStorage.getItem("idColaborador");
    console.log("idColaborador obtenido:", idColaborador);

    const docType = document.getElementById("documento_identidad").value;
    const cedula = document.getElementById("numeroIdentificacion").value;
    const errorSpan = document.getElementById("numeroIdentificacionError");

    if (docType === "ci_dni" && !validateCedula(cedula)) {
      errorSpan.style.display = "inline";
      errorSpan.textContent = "Cédula inválida";
      return;
    } else {
      errorSpan.style.display = "none";
    }

    // ✅ Construcción de datos del formulario
    const nombresApellidos = document.getElementById("nombres_apellidos").value.trim();
    const nacionalidad = document.getElementById("nacionalidad").value;
    const pais = (nacionalidad === "ecuatoriana") ? "Ecuador" : document.getElementById("pais").value;

    const aniosResidencia = nacionalidad === "extranjero" ? parseInt(document.getElementById("años_residencia").value) : null;
    const mesesResidencia = nacionalidad === "extranjero" ? parseInt(document.getElementById("meses_residencia").value) : null;

    const data = {
      idColaborador: document.getElementById("idColaborador").value,
      nombresApellidos: nombresApellidos,
      documentoIdentidad: docType,
      numeroIdentificacion: cedula,
      visaAmparo: document.getElementById("visa_amparo")?.value || null,
      lugarNacimiento: document.getElementById("lugar_nacimiento").value,
      edad: parseInt(document.getElementById("edad").value),
      fechaNacimiento: document.getElementById("fecha_nacimiento").value,
      instruccion: document.getElementById("instruccion").value,
      nacionalidad: nacionalidad,
      pais: pais,
      estatusMigratorio: document.getElementById("estatus")?.value || null,
      aniosResidencia: aniosResidencia,
      mesesResidencia: mesesResidencia,
      generoIdentidad: document.getElementById("genero").value,
      estadoCivil: document.getElementById("estado_civil").value,
      etnia: document.getElementById("etnia").value,
      rolFamiliar: document.getElementById("rol_familiar").value,
      numeroCargas: parseInt(document.getElementById("numeroCargas").value),
      direccionNegocio: document.getElementById("direccion_negocio").value,
      telefonoConvencional: document.getElementById("telefono_convencional").value,
      telefonoCelular: document.getElementById("telefono_celular").value,
      correo: document.getElementById("email").value,
      servicioDeInternet: document.getElementById("servicioDeInternet").checked,
      celular: document.getElementById("celular").checked,
      computadora: document.getElementById("computadora").checked,
      tablet: document.getElementById("tablet").checked,
      tipoNegocio: document.getElementById("tipo_negocio").value,
      otroNegocio: document.getElementById("otro_negocio")?.value || null,
      actividadEconomica: document.getElementById("actividad_economica").value,
      caracteristicasNegocio: document.getElementById("caracteristicas_negocio").value,
      asistenciaTecnica: document.getElementById("asistencia_tecnica").value,
      temasCapacitacion: document.getElementById("temas_capacitacion").value
    };

    console.log("Datos a enviar:", data); // <-- Aquí verificamos los datos antes de enviar

    // ✅ Realizar la solicitud POST
    try {
      const response = await fetch(API_FICHA_TECNICA, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      console.log("Respuesta del servidor:", response); // <-- Aquí verificamos la respuesta del servidor

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Error en la respuesta:", errorMessage); // <-- Aquí capturamos errores del servidor
        throw new Error(`Error: ${errorMessage}`);
      }

      const responseData = await response.json();
      console.log("Respuesta exitosa:", responseData); // <-- Aquí verificamos la respuesta exitosa

      alert("✅ Ficha guardada correctamente");
      window.location.href = "/public/screens/fichaDiagnostico.html";
    } catch (error) {
      console.error("Error al guardar ficha:", error); // <-- Aquí capturamos errores de red o del servidor
    }
  });
});

// Manejo del botón de descarga general
document.addEventListener("DOMContentLoaded", function () {
  const downloadBtn = document.getElementById("downloadAllBtn");

  if (downloadBtn) {
    downloadBtn.addEventListener("click", function () {
      window.location.href = "http://localhost:3000/export/download-all";
    });
  }
});
