(() => {
  fetch("http://a41d.k.time4vps.cloud:3001/henkilot")
    .then((res) => res.json())
    .then((data) => {
      naytaHenkilot(data);
      naytetaanRivit(data);
      haePuhelinnumero(data);
    });
})();

function naytaHenkilot(data) {
  $(".table").append(` 
      <thead>
        <tr>
          <th>Nimi</th>
          <th>Puhelin</th>
        </tr>
      </thead>
      <tbody></tbody>
    `);
}

function naytetaanRivit(data) {
  $.each(data, function (index, user) {
    $(".table tbody").append(`
        <tr>
          <td>${user.nimi}</td>
          <td>${user.puhelin}</td>
        </tr>
      `);
  });
}

// Elementit #id perusteella
function haePuhelinnumero(data) {
  $("#haeNro").click(function () {
    let nimi = $("#haettavanimi").val(); // Haetaan syötetty nimi
    let puhelinInput = $("#puhelinnro");

    if (nimi) {
      // Jos nimi on syötetty
      let personfound = data.find((henkilo) => henkilo.nimi === nimi);
      puhelinInput.val(
        personfound ? personfound.puhelin : "Henkilöä ei löytynyt."
      );
    } else {
      puhelinInput.val("Syötä nimi ennen hakua.");
    }
  });
}
