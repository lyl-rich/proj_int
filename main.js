// ---------- FUNÇÕES DE APOIO (LocalStorage) ----------

function carregarFavoritos() {
  try {
    return JSON.parse(localStorage.getItem("favoritos")) || [];
  } catch (e) {
    return [];
  }
}

function salvarFavoritos(lista) {
  localStorage.setItem("favoritos", JSON.stringify(lista));
}

//  Registra ação no histórico
function registrarNoHistorico(titulo) {
  let historico = JSON.parse(localStorage.getItem("historico")) || [];
  const dataAtual = new Date().toLocaleDateString("pt-BR");

  // Evita duplicar o mesmo imóvel seguido no histórico
  if (historico.length > 0 && historico[0].titulo === titulo) return;

  // Adiciona ao topo da lista
  historico.unshift({ titulo: titulo, data: dataAtual });

  // Mantém apenas os 10 últimos registros
  if (historico.length > 10) historico.pop();

  localStorage.setItem("historico", JSON.stringify(historico));
}

// ---------- EVENTOS DE CLIQUE (home) ----------

document.addEventListener("click", function (e) {
  const card = e.target.closest(".property-card");
  
  if (card) {
    const titulo = card.querySelector("h3").innerText;
    const detalhes = card.querySelector("p").innerText;

    // Favoritar
    if (e.target.classList.contains("btn-add-fav")) {
      const novosFavs = carregarFavoritos();
      const jaExiste = novosFavs.some((fav) => fav.titulo === titulo);

      if (jaExiste) {
        alert("Este imóvel já está nos seus favoritos!");
      } else {
        novosFavs.push({ titulo, detalhes });
        salvarFavoritos(novosFavs);
        registrarNoHistorico(titulo); // Salva no histórico
        alert("Imóvel adicionado com sucesso!");
      }
    }

    //Clique no WhatsApp
    if (e.target.classList.contains("btn-whatsapp")) {
      registrarNoHistorico(titulo); // Salva no histórico
    }
  }
});

// ---------- EXIBIÇÃO HISTÓRICO ----------

if (location.pathname.includes("historico.html")) {
  const container = document.querySelector(".container");
  const historico = JSON.parse(localStorage.getItem("historico")) || [];

  container.innerHTML = "<h2>Seu Histórico de Interesse</h2>";

  if (historico.length === 0) {
    container.innerHTML += "<p>Você ainda não visualizou ou demonstrou interesse em nenhum imóvel.</p>";
  } else {
    historico.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
                <h3>${item.titulo}</h3>
                <p>Interesse registrado em: ${item.data}</p>
            `;
      container.appendChild(card);
    });
  }
}

// ---------- EXIBIÇÃO FAVORITOS ----------

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

if (location.pathname.includes("cadastrar.html")) {
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

// ---------- SISTEMA DE LEILÃO ----------

if (location.pathname.includes("leiloes.html")) {
  const carregarLancesIniciais = () => {
    const cards = document.querySelectorAll(".auction-card");
    cards.forEach((card) => {
      const id = card.getAttribute("data-id");
      const lanceSalvo = localStorage.getItem(id);
      if (lanceSalvo) {
        document.getElementById(`valor-${id}`).innerText = `R$ ${parseFloat(
          lanceSalvo
        ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
      }
    });
  };

  carregarLancesIniciais();

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-lance")) {
      const card = e.target.closest(".auction-card");
      const id = card.getAttribute("data-id");
      const inputLance = document.getElementById(`input-${id}`);
      const valorInformado = parseFloat(inputLance.value);

      const elementoValorAtual = document.getElementById(`valor-${id}`);
      const valorAtualTexto = elementoValorAtual.innerText
        .replace("R$", "")
        .replace(/\./g, "")
        .replace(",", ".");
      const valorAtual = parseFloat(valorAtualTexto);

      if (isNaN(valorInformado) || valorInformado <= valorAtual) {
        alert("O seu lance deve ser MAIOR que o lance atual!");
      } else {
        localStorage.setItem(id, valorInformado);
        elementoValorAtual.innerText = `R$ ${valorInformado.toLocaleString(
          "pt-BR",
          { minimumFractionDigits: 2 }
        )}`;
        inputLance.value = "";
        alert("Parabéns! Seu lance foi registrado.");
      }
    }
  });
}
