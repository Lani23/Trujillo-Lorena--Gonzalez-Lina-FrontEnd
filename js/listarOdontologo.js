const apiURL = "http://localhost:8080";

// Obtener la referencia a la tabla y al modal
const tableBody = document.querySelector("#odontologoTable tbody");
const editModal = new bootstrap.Modal(document.getElementById("editModal"));
const editForm = document.getElementById("editForm");
let currentOdontologoId;

// Función para obtener y mostrar los odontólogos
function fetchOdontologo() {
  // listar los odontólogos
  fetch(`${apiURL}/odontologo/buscartodos`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Limpiar el contenido actual de la tabla
      tableBody.innerHTML = "";

      // Insertar los datos en la tabla
      data.forEach((odontologo, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
                <td>${odontologo.id}</td>
                <td>${odontologo.numeromatricula}</td>
                <td>${odontologo.nombre}</td>
                <td>${odontologo.apellido}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editOdontologo(${odontologo.id}, '${odontologo.numeromatricula}','${odontologo.nombre}', '${odontologo.apellido}')">Modificar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteOdontologo(${odontologo.id})">Eliminar</button>
                </td>
                `;

        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Función para abrir el modal y cargar los datos del odontólogo
editOdontologo = function (id, numeromatricula, nombre, apellido) {
  currentOdontologoId = id;
  document.getElementById("editNumeroMatricula").value = numeromatricula;
  document.getElementById("editNombre").value = nombre;
  document.getElementById("editApellido").value = apellido;
  editModal.show();
};

// Función para editar un odontólogo
editForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const numeromatricula = document.getElementById("editNumeroMatricula").value;
  const nombre = document.getElementById("editNombre").value;
  const apellido = document.getElementById("editApellido").value;

  //modificar un odontólogo
  fetch(`${apiURL}/odontologo/modificar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: currentOdontologoId,
      numeromatricula,
      nombre,
      apellido,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      alert("Odontólogo modificado con éxito");
      fetchOdontologo();
      editModal.hide();
    })
    .catch((error) => {
      console.error("Error editando odontólogo:", error);
    });
});

// Función para eliminar un odontólogo
deleteOdontologo = function (id) {
  if (confirm("¿Está seguro de que desea eliminar este odontólogo?")) {
    // eliminar el odontólogo
    fetch(`${apiURL}/odontologo/eliminar/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("Odontólogo eliminado con éxito");
        fetchOdontologo();
      })
      .catch((error) => {
        console.error("Error borrando odontólogo:", error);
      });
  }
};

// Llamar a la función para obtener y mostrar los odontólogos
fetchOdontologo();
