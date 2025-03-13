(loadPage = () => {
  fetch("http://localhost:3000/items")
    .then((res) => res.json())
    .then((data) => {
      displayUser(data);
    });
})();



const userDisplay = document.querySelector(".table");


displayUser = (data) => {
  userDisplay.innerHTML = `
    <thead>
    <tr>
      <th>Id</th>
      <th>Nimi</th>
      <th>Puhelin</th>
      <th>Poista</th>
      <th>Muokkaa</th>
    </tr>
    </thead>
     
    `;
  displayRow(data);
};

displayRow = (data) => {
  data.forEach((user) => {
    userDisplay.innerHTML += `
      <tbody>
      <tr>
  
          <td>${user.id}</td>
          <td>${user.nimi}</td>
          <td>${user.puhelin}</td>
          <td><input type="button" onClick="removeRow(${user.id})" value="x"/></td>
          <td><input type="button" onClick="ShowEditForm(${user.id})" value="Valitse"/></td>
      </tr>
      </tbody>
   
  `;
  });
};

//--------------------------------------------------------------------------------------------------
// Näytä valitun käyttäjän tiedot id:n perusteella
ShowEditForm = async (id) => {
  let polku = "http://localhost:3000/items/" + id;

  try {
    let response = await fetch(polku);
    let user = await response.json();

    // Tiedot input kenttiin (id kenttä lisätty)
    document.getElementById("id").value = user.id;
    document.getElementById("nimi").value = user.nimi;
    document.getElementById("puhelin").value = user.puhelin;
  } catch (error) {
    console.error("Virhe haettaessa käyttäjää:", error);
  }
};

// Puhelinnumeron päivitys
UpdatePhone = async (id) => {
  let polku = "http://localhost:3000/items/" + id;
  let data = { puhelin: puhelin }; // data bodyyn
  try {
    const response = await fetch(polku, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Lähetetään data JSON-muodossa
    });

    if (!response.ok) {
      throw new Error("Päivitys epäonnistui");
    }

    console.log("Muokkaus onnistui");
    window.location.reload(); // Ladataan sivu uudelleen
  } catch (error) {
    console.error("Virhe päivittäessä puhelinnumeroa:", error);
  }
};

// Lähetetään PUT pyyntö palvelimelle JSON muodossa
async function putFormDataAsJson(url, formData) {
  const plainFormData = Object.fromEntries(formData.entries()); // Muutetaan FormData-olio tavalliseksi JavaScript-olioksi
  const formDataJsonString = JSON.stringify(plainFormData); // Muutetaan JavaScript-olio JSON-muotoon, jotta se voidaan lähettää palvelimelle

  // Määritetään HTTP-pyynnön asetukset
  const fetchOptions = {
    method: "PUT", // Käytetään HTTP POST -metodia
    headers: {
      "Content-Type": "application/json", // Määritetään sisällön tyyppi JSON-muotoiseksi
      Accept: "application/json", // Ilmoitetaan, että haluamme vastauksen myös JSON-muodossa
    },
    body: formDataJsonString, // Lähetetään JSON-muodossa oleva lomakedata
  };
  console.log("PLAINDATA " + plainFormData);
  console.log("Body data " + formDataJsonString);
  const response = await fetch(url, fetchOptions); // Lähetetään pyyntö annetulle URL-osoitteelle

  // Tarkistetaan, onnistuiko pyyntö (statuskoodi 200-299)
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
  return response.json();
}

async function handleFormSubmitUpdate(event) {
  event.preventDefault(); // Estää lomakkeen lähettämisen eli oletus tapahtuman

  const form = event.currentTarget; // Tapahtuman kohde eli lomake
  const id = document.getElementById("id").value; // Haetaan id lomakkeelta
  const url = "http://localhost:3000/items/" + id;
  console.log("PUT URL:", url); // Tarkistetaan, että URL on oikein
  try {
    const formData = new FormData(form); // Luodaan uusi FormData olio ja annetaan sille lomake
    const responseData = await putFormDataAsJson(url, formData);
    await loadPage();
    console.log(responseData);
  } catch (err) {
    console.error("PUT-pyyntö epäonnistui:", err);
  }
}
//--------------------------------------------------------------------------------------------------

// Poisto
removeRow = async (id) => {
  console.log(id);
  // Simple DELETE request with fetch
  let polku = "http://localhost:3000/items/" + id;
  await fetch(polku, { method: "DELETE" }).then(() =>
    console.log("Poisto onnistui")
  );
  window.location.reload(); //ladataan ikkuna uudelleen
};

/**
 * Helper function for POSTing data as JSON with fetch.
 *
 * @param {Object} options
 * @param {string} options.url - URL to POST data to
 * @param {FormData} options.formData - `FormData` instance
 * @return {Object} - Response body from URL that was POSTed to
 */
async function postFormDataAsJson({ url, formData }) {
  const plainFormData = Object.fromEntries(formData.entries());
  const formDataJsonString = JSON.stringify(plainFormData);

  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: formDataJsonString,
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Event handler for a form submit event.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event
 *
 * @param {SubmitEvent} event
 */
async function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const url = form.action;
  const formData = new FormData(form);
  try {
    

    const responseData = await postFormDataAsJson({ url, formData });
    console.log("Uusi alkio lisätty:", responseData);
    await loadPage(); //päivitetään sivu
  } catch (error) {
    console.error(error);
  }
}

const exampleForm = document.getElementById("puhelintieto_lomake"); // Hakee lomakkeen elementit erittelyä varten




exampleForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Estetään oletustoiminto

  const submitter = event.submitter; // Selvitetään, mikä painike lähetti lomakkeen

  if (submitter && submitter.id === "UpdateBtn") {
    handleFormSubmitUpdate(event); // Kutsutaan päivitysfunktiota
  } else {
    handleFormSubmit(event); // Kutsutaan lisäysfunktiota
  }
});

