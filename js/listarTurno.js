const apiURL = "http://localhost:8080";

// Obtener la referencia a la tabla y al modal
const tableBody = document.querySelector("#turnoTable tbody");
const editModal = new bootstrap.Modal(document.getElementById("editModal"));
const editForm = document.getElementById("editForm");
let currenctTurnosId;
let currentPacienteId;
let currentOdontologoId;

// Función para obtener y mostrar los odontólogos
function fetchTurnos() {
  // listar los pacientes
  fetch(`${apiURL}/turnos/buscartodos`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Limpiar el contenido actual de la tabla
      tableBody.innerHTML = "";

      // Insertar los datos en la tabla
      data.forEach((turnos, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
                <td>${turnos.id}</td>
                <td>${turnos.paciente.nombre}</td>
                <td>${turnos.paciente.apellido}</td>
                <td>${turnos.paciente.dni}</td>
                <td>${turnos.odontologo.nombre}</td>
                <td>${turnos.odontologo.apellido}</td>
                <td>${turnos.fecha}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editPaciente(${turnos.id}, '${turnos.paciente.nombre}','${turnos.paciente.apellido}', '${turnos.paciente.dni}', 
                    '${turnos.odontologo.nombre}', '${turnos.odontologo.apellido}', '${paciente.domicilio.calle}', '${urnos.fecha}')">Modificar</button>
                    <button class="btn btn-danger btn-sm" onclick="deletePaciente(${turnos.id})">Eliminar</button>
                </td>
                `;

        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Función para abrir el modal y cargar los datos del paciente
editPaciente = function (
  id,
  nombrePaciente,
  apellidoPaciente,
  dni,
  nombreOdontologo,
  apellidoOdontologo,
  fechaTurno
) {
  currenctTurnosId = id;
  currentPacienteId = idPaciente;
  currentOdontologoId = idOdontologo;
  document.getElementById("editNombrePaciente").value = nombrePaciente;
  document.getElementById("editApellidoPaciente").value = apellidoPaciente;
  document.getElementById("editDni").value = dni;
  document.getElementById("editNombreOdontologo").value = nombreOdontologo;
  document.getElementById("editApellidoOdontologo").value = apellidoOdontologo;
  document.getElementById("editFechaTurno").value = fechaTurno;
  editModal.show();
};

// Función para editar un paciente
editForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const nombrePaciente = document.getElementById("editNombrePaciente").value;
  const apellidoPaciente = document.getElementById(
    "editApellidoPaciente"
  ).value;
  const dni = document.getElementById("editDni").value;
  const nombreOdontologo = document.getElementById(
    "editNombreOdontologo"
  ).value;
  const apellidoOdontologo = document.getElementById(
    "editApellidoOdontologo"
  ).value;
  const fechaTurno = document.getElementById("editFechaTurno").value;

  //modificar un paciente
  fetch(`${apiURL}/turnos/modificar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: currenctTurnosId,
      paciente: {
        id: currentPacienteId,
        nombrePaciente,
        apellidoPaciente,
        dni,
      },
      odontologo: {
        id: currentOdontologoId,
        nombreOdontologo,
        apellidoOdontologo,
      },
      fechaTurno,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      alert("Turno modificado con éxito");
      fetchTurnos();
      editModal.hide();
    })
    .catch((error) => {
      console.error("Error editando turno:", error);
    });
});

// Función para eliminar un paciente
fetchTurnos = function (id) {
  if (confirm("¿Está seguro de que desea eliminar este turno?")) {
    // eliminar el paciente
    fetch(`${apiURL}/turnos/eliminar/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("Turno eliminado con éxito");
        fetchPacientes();
      })
      .catch((error) => {
        console.error("Error borrando turno:", error);
      });
  }
};

// Llamar a la función para obtener y mostrar los odontólogos
fetchPacientes();
