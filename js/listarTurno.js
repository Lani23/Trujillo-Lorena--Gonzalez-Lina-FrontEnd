const apiURL = "http://localhost:8080";

// Obtener la referencia a la tabla y al modal
const tableBody = document.querySelector("#turnoTable tbody");
const editModal = new bootstrap.Modal(document.getElementById("editModal"));
const editForm = document.getElementById("editForm");
const odontologoSelect = document.getElementById("editOdontologoSelect"); // Asegúrate de que este ID sea correcto

// Variables para almacenar los datos del turno actual
let currentTurnoId;
let currentPacienteId;

// Función para obtener y mostrar los turnos
function fetchTurnos() {
  fetch(`${apiURL}/turnos/buscartodos`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Verificar la estructura de los datos
      tableBody.innerHTML = "";

      data.forEach((turno) => {
        const row = document.createElement("tr");

        row.innerHTML = `
                <td>${turno.pacienteResponseDto.nombre}</td>
                <td>${turno.pacienteResponseDto.apellido}</td>
                <td>${turno.pacienteResponseDto.dni}</td>
                <td>${turno.odontologoResponseDto.nombre}</td>
                <td>${turno.odontologoResponseDto.apellido}</td>
                <td>${turno.fecha}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editTurno(${turno.id}, ${turno.pacienteResponseDto.id}, '${turno.fecha}')">Modificar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTurno(${turno.id})">Eliminar</button>
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
function fetchOdontologos() {
  fetch(`${apiURL}/odontologo/buscartodos`)
    .then((response) => response.json())
    .then((data) => {
      // Verifica si `data` contiene datos
      console.log(data);

      odontologoSelect.innerHTML = ""; // Limpiar el select actual

      data.forEach((odontologo) => {
        const option = document.createElement("option");
        option.value = odontologo.id;
        option.textContent = `${odontologo.nombre} ${odontologo.apellido} - Matrícula: ${odontologo.numeromatricula}`;
        odontologoSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching odontologos:", error);
    });
}

// Función para abrir el modal y cargar los datos del turno (incluye la lista de odontólogos)
function editTurno(id, pacienteId, fecha) {
  currentTurnoId = id;
  currentPacienteId = pacienteId;
  document.getElementById("editFechaTurno").value = fecha;
  
  // Cargar los odontólogos antes de mostrar el modal
  fetchOdontologos();

  fetch(`${apiURL}/turnos/${id}`)
    .then((response) => response.json())
    .then((turno) => {
      // Seleccionar el odontólogo actual
      document.getElementById("editOdontologoSelect").value = turno.odontologo_id;
    })
    .catch((error) => {
      console.error("Error fetching turno data:", error);
    });

  editModal.show();
}

// Función para editar un turno
editForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const fechaTurno = document.getElementById("editFechaTurno").value;
  const odontologoId = document.getElementById("editOdontologoSelect").value;

  fetch(`${apiURL}/turnos/modificar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: currentTurnoId,
      paciente_id: currentPacienteId,
      odontologo_id: odontologoId,
      fecha: fechaTurno,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      alert("Fecha del turno modificada con éxito");
      fetchTurnos();
      editModal.hide();
    })
    .catch((error) => {
      console.error("Error modificando turno:", error);
    });
});

// Función para eliminar un turno
function deleteTurno(id) {
  if (confirm("¿Está seguro de que desea eliminar este turno?")) {
    fetch(`${apiURL}/turnos/eliminar/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error eliminando turno");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        alert("Turno eliminado con éxito");
        fetchTurnos();
      })
      .catch((error) => {
        console.error("Error eliminando turno:", error);
      });
  }
}

// Llamar a la función para obtener y mostrar los turnos y odontólogos al cargar la página
fetchTurnos();
fetchOdontologos();
