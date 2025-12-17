document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault();

  Email.send({
    SecureToken: "TON_SECURE_TOKEN",
    To: "abdourahmana82@gmail.com",
    From: "abdourahmana82@gmail.com",
    Subject: document.getElementById("subject").value,
    Body: `
      Nom: ${document.getElementById("name").value}<br>
      Email: ${document.getElementById("email").value}<br><br>
      Message:<br>
      ${document.getElementById("message").value}
    `
  }).then(
    message => alert("Message envoyé avec succès ✅")
  ).catch(
    error => alert("Erreur lors de l'envoi ❌")
  );
});
