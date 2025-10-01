 const incidencias = {
      "2025-09-02": "falta",
      "2025-09-05": "tarde",
      "2025-09-09": "sancion",
      "2025-09-12": "falta"
    };

    function generarCalendario() {
      const calendario = document.getElementById("calendar");
      calendario.innerHTML = "";

      const hoy = new Date();
      const year = hoy.getFullYear();
      const month = hoy.getMonth();

      const primerDia = new Date(year, month, 1);
      const ultimoDia = new Date(year, month + 1, 0);
      const totalDias = ultimoDia.getDate();

      const inicioSemana = primerDia.getDay();

      for (let i = 0; i < inicioSemana; i++) {
        const empty = document.createElement("div");
        calendario.appendChild(empty);
      }

      for (let d = 1; d <= totalDias; d++) {
        const fecha = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");

        if (incidencias[fecha]) {
          dayDiv.classList.add(incidencias[fecha]);
        }

        dayDiv.textContent = d;
        calendario.appendChild(dayDiv);
      }
    }

    function toggleDropdown() {
      const dropdown = document.getElementById("dropdown");
      dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";
    }

    // Cierra el dropdown si haces clic fuera
    window.onclick = function(event) {
      if (!event.target.closest(".user-info")) {
        document.getElementById("dropdown").style.display = "none";
      }
    }

    // Animación de entrada para las cards
    document.addEventListener("DOMContentLoaded", function() {
      generarCalendario();
      
      const cards = document.querySelectorAll('.card');
      cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 150);
      });
    });