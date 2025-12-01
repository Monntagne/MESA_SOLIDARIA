// ================= NAVBAR / FOOTER =================
document.addEventListener("DOMContentLoaded", function () {
    fetch("../Navegacao/Navbar/navbar.html")
        .then((resposta) => resposta.text())
        .then((html) => {
            const areaNavbar = document.getElementById("area-navbar");
            if (areaNavbar) {
                areaNavbar.innerHTML = html;
            }
        })
        .catch((erro) => {
            console.error("Erro ao carregar o navbar:", erro);
        });

    fetch("../Navegacao/Footer/footer.html")
        .then((resposta) => resposta.text())
        .then((html) => {
            const areaFooter = document.getElementById("area-footer");
            if (areaFooter) {
                areaFooter.innerHTML = html;
            }
        })
        .catch((erro) => {
            console.error("Erro ao carregar o footer:", erro);
        });

    // ================= ANIMAÇÃO ENTRADA CARDS =================
    const elementosAnimados = document.querySelectorAll(
        ".cartao-motivo-empresa, .cartao-passo-empresa, .cartao-beneficio-empresa"
    );

    if (elementosAnimados.length) {
        const observador = new IntersectionObserver(
            (entradas) => {
                entradas.forEach((entrada) => {
                    if (entrada.isIntersecting) {
                        entrada.target.classList.add("visivel");
                        observador.unobserve(entrada.target);
                    }
                });
            },
            {
                threshold: 0.2,
            }
        );

        elementosAnimados.forEach((el) => observador.observe(el));
    }

    // ================= SCROLL SUAVE LINKS INTERNOS =================
    const linksInternos = document.querySelectorAll('a[href^="#"]');

    linksInternos.forEach((link) => {
        link.addEventListener("click", (evento) => {
            const destinoId = link.getAttribute("href");
            const destinoElemento = document.querySelector(destinoId);

            if (destinoId !== "#" && destinoElemento) {
                evento.preventDefault();

                const topo =
                    destinoElemento.getBoundingClientRect().top +
                    window.scrollY - 80;

                window.scrollTo({
                    top: topo,
                    behavior: "smooth",
                });
            }
        });
    });
});
