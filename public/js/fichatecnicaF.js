const API_FICHA_TECNICA = "http://localhost:3000/fichaTecnica/createFicha";
 
document.addEventListener("DOMContentLoaded", async function () {
  const form = document.getElementById("formulario");
  const steps = document.querySelectorAll('.progress-steps .step');
  const line = document.querySelector('.progress-steps .line');
  const downloadBtn = document.getElementById("downloadBtn");
 
  // Llamada al endpoint para obtener el último idColaborador desde la tabla colaborador
  try {
    const response = await fetch("http://localhost:3000/usuarios/ultimo-colaborador");
    if (response.ok) {
        const data = await response.json();
        const idColaboradorField = document.getElementById("idColaborador");
        if (idColaboradorField) {
            idColaboradorField.value = data.idColaborador;
            console.log("Campo oculto idColaborador actualizado:", data.idColaborador);
        } else {
            console.warn("El campo oculto 'idColaborador' no se encontró en el DOM.");
        }
    } else {
        console.error("Error al obtener idColaborador:", response.statusText);
    }
} catch (error) {
    console.error("Error al obtener idColaborador:", error);
}
 
if (downloadBtn) {
  downloadBtn.addEventListener("click", function () {
    window.location.href = "http://localhost:3000/fichaTecnica/download-csv";
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
<<<<<<< HEAD
});
=======
  });
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

// Función que se ejecuta al hacer clic en el botón de guardar
document.getElementById("guardarBtn").addEventListener("click", function(event) {
  // Evita que el formulario se envíe inmediatamente
  event.preventDefault();
 
  // Obtener todos los campos del formulario
  const formulario = document.getElementById("formulario");
  const inputs = formulario.querySelectorAll("input[required], select[required], textarea[required]");
 
  let allFilled = true;
 
  // Recorremos los campos para verificar si están vacíos
  inputs.forEach(input => {
      if (input.value.trim() === "") {
          allFilled = false;
          // Añadir mensaje de advertencia (si se desea)
          input.style.borderColor = "red";  // Cambio de color para indicar error
      } else {
          input.style.borderColor = ""; // Restablecer color si ya está lleno
      }
  });
 
  // Si todos los campos están llenos, se puede enviar el formulario
  if (allFilled) {
      // Aquí puedes agregar la lógica para guardar los datos
      alert("Formulario guardado exitosamente.");
      formulario.submit();  // Enviar el formulario si todo está correcto
  } else {
      // Si falta algún campo, mostrar un mensaje de advertencia
      alert("Por favor, complete todos los campos obligatorios.");
  }
  

>>>>>>> 21a19bdfa8f3139b34a46359e44f18a00d9122b6
});

