const form = document.getElementById("agregarForm");
const apiURL = "http://localhost:8080";

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const numeromatricula = document.getElementById("numeromatricula").value;
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;

  // llamando al endpoint de agregar
  const datosFormulario = {
    numeromatricula,
    nombre,
    apellido,
  };

  fetch(`${apiURL}/odontologo/guardar`, {
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
      alert("Odontólogo agregado con éxito");
      form.reset(); // Resetear el formulario
    })
    .catch((error) => {
      alert(`Error agregando odontólogo: ${error.message}`);
      console.error("Error agregando odontólogo:", error);
    });
});
