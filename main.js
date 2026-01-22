// ---------- SISTEMA DE FAVORITOS ----------
function carregarFavoritos() {
    return JSON.parse(localStorage.getItem("favoritos")) || [];
}

function salvarFavoritos(lista) {
    localStorage.setItem("favoritos", JSON.stringify(lista));
}

// Botão: "Adicionar aos Favoritos" (index.html)
document.addEventListener("click", function (e) {
    if (e.target.innerText === "Adicionar aos Favoritos") {
        const card = e.target.closest(".property-card");
        const titulo = card.querySelector("h3").innerText;
        const detalhes = card.querySelector("p").innerText;

        const novosFavs = carregarFavoritos();
        novosFavs.push({ titulo, detalhes });
        salvarFavoritos(novosFavs);

        alert("Imóvel adicionado aos favoritos!");
    }
});

// ---------- EXIBIR FAVORITOS NA PÁGINA favoritos.html ----------
if (location.pathname.includes("favoritos.html")) {
    const container = document.querySelector(".container");
    const favoritos = carregarFavoritos();

    container.innerHTML = "<h2>Favoritos</h2>";

    if (favoritos.length === 0) {
        container.innerHTML += "<p>Nenhum favorito ainda...</p>";
    }

    favoritos.forEach((item, index) => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <h3>${item.titulo}</h3>
            <p>${item.detalhes}</p>
            <button class="remove" data-id="${index}">Remover</button>
        `;

        container.appendChild(card);
    });

    // Remover card
    container.addEventListener("click", function (e) {
        if (e.target.classList.contains("remove")) {
            let id = e.target.getAttribute("data-id");
            let lista = carregarFavoritos();
            lista.splice(id, 1);
            salvarFavoritos(lista);
            location.reload();
        }
    });
}

// ---------- LOGIN ----------
if (location.pathname.includes("login.html")) {
    const btnEntrar = document.querySelector("button");

    btnEntrar.addEventListener("click", () => {
        const email = document.querySelector("input[type=email]").value.trim();
        const senha = document.querySelector("input[type=password]").value.trim();

        if (!email || !senha) {
            alert("Preencha email e senha!");
            return;
        }

        alert("Login realizado com sucesso!");
        location.href = "index.html";
    });
}

// ---------- CADASTRO DE CLIENTE ----------
if (location.pathname.includes("clientes.html")) {
    const btnCadastrar = document.querySelector("button");

    btnCadastrar.addEventListener("click", () => {
        const inputs = document.querySelectorAll("input");
        const nome = inputs[0].value.trim();
        const email = inputs[1].value.trim();
        const telefone = inputs[2].value.trim();

        if (!nome || !email || !telefone) {
            alert("Preencha todos os campos!");
            return;
        }

        const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
        clientes.push({ nome, email, telefone });

        localStorage.setItem("clientes", JSON.stringify(clientes));

        alert("Cliente cadastrado com sucesso!");
    });
}

// ---------- SISTEMA DE LEILÃO FUNCIONAL ----------
if (location.pathname.includes("leiloes.html")) {
    
    // Função para carregar lances salvos ao abrir a página
    const carregarLancesIniciais = () => {
        const cards = document.querySelectorAll('.auction-card');
        cards.forEach(card => {
            const id = card.getAttribute('data-id');
            const lanceSalvo = localStorage.getItem(id);
            if (lanceSalvo) {
                document.getElementById(`valor-${id}`).innerText = `R$ ${parseFloat(lanceSalvo).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
            }
        });
    };

    carregarLancesIniciais();

    // Evento de clique para dar lance
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("btn-lance")) {
            const card = e.target.closest(".auction-card");
            const id = card.getAttribute('data-id');
            const inputLance = document.getElementById(`input-${id}`);
            const valorInformado = parseFloat(inputLance.value);
            
            // Pega o valor atual do lance (remove o "R$" e pontos para comparar)
            const elementoValorAtual = document.getElementById(`valor-${id}`);
            const valorAtualTexto = elementoValorAtual.innerText.replace("R$", "").replace(/\./g, "").replace(",", ".");
            const valorAtual = parseFloat(valorAtualTexto);

            if (isNaN(valorInformado) || valorInformado <= valorAtual) {
                alert("O seu lance deve ser MAIOR que o lance atual!");
            } else {
                // Sucesso: Salva no localStorage e atualiza a tela
                localStorage.setItem(id, valorInformado);
                elementoValorAtual.innerText = `R$ ${valorInformado.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
                inputLance.value = ""; // Limpa o campo
                alert("Parabéns! Seu lance foi registrado como o maior até agora.");
            }
        }
    });
}
