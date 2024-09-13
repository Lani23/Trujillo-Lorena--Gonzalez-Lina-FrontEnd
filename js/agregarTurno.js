const apiURL = "http://localhost:8080";

// Obtener la referencia a la tabla y al modal
const tableBody = document.querySelector("#pacienteTable tbody");
const addTurnoModal = new bootstrap.Modal(
  document.getElementById("addTurnoModal")
);
const addTurnoForm = document.getElementById("addTurnoForm");
const odontologoSelect = document.getElementById("odontologoSelect");
const turnoFechaInput = document.getElementById("turnoFecha");

let currentPacienteId;
let currentOdontologoId;
let currentTurnoFecha;

// Función para obtener y mostrar los odontólogos
function fetchPacientes() {
  // listar los pacientes
  fetch(`${apiURL}/paciente/buscartodos`)
    .then((response) => response.json())
    .then((data) => {
      // Limpiar el contenido actual de la tabla
      tableBody.innerHTML = "";

      // Insertar los datos en la tabla
      data.forEach((paciente, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
                  <td>${paciente.id}</td>
                  <td>${paciente.apellido}</td>
                  <td>${paciente.nombre}</td>
                  <td>${paciente.dni}</td>
                  <td>${paciente.fechaIngreso}</td>
                  <td>${paciente.domicilio.calle}</td>
                  <td>${paciente.domicilio.numero}</td>
                  <td>${paciente.domicilio.localidad}</td>
                  <td>${paciente.domicilio.provincia}</td>
                  <td>
                      <button class="btn btn-primary btn-sm" onclick="onAddTurno(${paciente.id}, '${paciente.apellido}','${paciente.nombre}', '${paciente.dni}')">Agregar Turno</button>
                  </td>
                  `;

        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Función para obtener y mostrar los odontólogos en un select
function fetchOdontologo() {
    // listar los odontólogos
    fetch(`${apiURL}/odontologo/buscartodos`)
      .then((response) => response.json())
      .then((data) => {
        // Limpiar el contenido actual del select
        const odontologoSelect = document.getElementById("odontologoSelect");
        odontologoSelect.innerHTML = ""; // Limpiar el select actual

        if (data && data.length > 0) currentOdontologoId = data[0].id

        // Insertar los datos en el select
        data.forEach((odontologo) => {
          const option = document.createElement("option");
          option.value = odontologo.id;
          option.textContent = `${odontologo.nombre} ${odontologo.apellido} - Matrícula: ${odontologo.numeromatricula}`;
          odontologoSelect.appendChild(option);
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
}


onAddTurno = (
    id,
    apellido,
    nombre,
    dni) => {
    currentPacienteId = id;
    document.getElementById("editApellido").value = apellido;
    document.getElementById("editNombre").value = nombre;
    document.getElementById("editDni").value = dni;
    addTurnoModal.show();
}



odontologoSelect.addEventListener("change", (event) => {
    currentOdontologoId = event.target.value;
});

turnoFechaInput.addEventListener("change", (event) => {
    currentTurnoFecha = event.target.value;
});

addTurnoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const datosFormulario = {
        paciente_id: currentPacienteId,
        odontologo_id: currentOdontologoId,
        fecha: currentTurnoFecha
    };

    fetch(`${apiURL}/turnos/guardar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosFormulario),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error(`Error ${response.status}: ${errorData.errors[0]}`);
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          alert("Turno agregado con éxito");
          addTurnoModal.hide();
          addTurnoForm.reset();
        })
        .catch((error) => {
          alert(`Error agregando turno: ${error.message}`);
          console.error("Error agregando turno:", error);
        });
})

fetchPacientes();
fetchOdontologo();