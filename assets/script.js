let lunaIndex = 0;
let solIndex = 0;
const lunaEmojis = ["🌜", "🌙", "🌑", "🌘"];
const solEmojis = ["🌞", "🌅", "🌄", "🌤"];

function toggleTheme() {
  document.body.classList.toggle("dark");
  const btnAlterar = document.querySelector('.btn-alterar');
  if (!btnAlterar) return;

  if (document.body.classList.contains('dark')) {
    btnAlterar.innerHTML = `
      <picture>
        <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f31c/512.webp" type="image/webp">
        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f31c/512.gif" alt="🌜" width="32" height="32">
      </picture>`;
    localStorage.setItem('lunaIndex', lunaIndex);
    lunaIndex = (lunaIndex + 1) % lunaEmojis.length;
  } else {
    btnAlterar.innerHTML = `
      <picture>
        <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f31e/512.webp" type="image/webp">
        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f31e/512.gif" alt="🌞" width="40" height="40">
      </picture>`;
    solIndex = (solIndex + 1) % solEmojis.length;
  }

  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

function carregarTema() {
  const theme = localStorage.getItem('theme');
  const btnAlterar = document.querySelector('.btn-alterar');
  const savedLunaIndex = parseInt(localStorage.getItem('lunaIndex'), 10);

  if (!btnAlterar) return;

  if (theme === 'dark') {
    document.body.classList.add('dark');
    lunaIndex = isNaN(savedLunaIndex) ? 0 : savedLunaIndex;
    btnAlterar.innerHTML = `
      <picture>
        <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f31c/512.webp" type="image/webp">
        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f31c/512.gif" alt="🌜" width="32" height="32">
      </picture>`;
    lunaIndex = (lunaIndex + 1) % lunaEmojis.length;
  } else {
    btnAlterar.innerHTML = `
      <picture>
        <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f31e/512.webp" type="image/webp">
        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f31e/512.gif" alt="🌞" width="40" height="40">
      </picture>`;
    solIndex = (solIndex + 1) % solEmojis.length;
  }
}

function salvarDados() {
  localStorage.setItem('coluna1', document.getElementById("coluna1").value);
  localStorage.setItem('coluna2', document.getElementById("coluna2").value);
  localStorage.setItem('coluna3', document.getElementById("coluna3").value);
  localStorage.setItem('coluna4', document.getElementById("coluna4").value);
}

function carregarDados() {
  document.getElementById("coluna1").value = localStorage.getItem('coluna1') || '';
  document.getElementById("coluna2").value = localStorage.getItem('coluna2') || '';
  document.getElementById("coluna3").value = localStorage.getItem('coluna3') || '';
  document.getElementById("coluna4").value = localStorage.getItem('coluna4') || '';
}

function gerar() {
  const col1 = document.getElementById("coluna1").value.split('\n').map(x => x.trim()).filter(Boolean);
  const col3 = document.getElementById("coluna3").value.split('\n').map(x => x.trim()).filter(Boolean);
  const col3Set = new Set(col3);

  const quantidadeNumeros = col1.length;
  const encontrados = col1.filter(num => col3Set.has(num));
  const naoEncontrados = col1.filter(num => !col3Set.has(num));
  const duplicados = verificarDuplicados(col1);

  const mensagens = document.getElementById("mensagens");
  mensagens.innerHTML = `<p>Há ${quantidadeNumeros} número(s) de série.</p>`;

  if (duplicados.length > 0) {
    mensagens.innerHTML += `<p>Foram encontrados ${duplicados.length} números duplicados:</p><ul>${duplicados.map(num => `<li class="duplicado">${num}</li>`).join('')}</ul><button onclick="deletarDuplicados()">Deletar Duplicados</button>`;
  }

  if (quantidadeNumeros > 5000) {
    alert("⚠️ Você inseriu mais de 5.000 números de série. O limite máximo recomendado foi excedido.");
    return;
  }

  const blocos = dividirEmBlocos(col1, 800, '🔹 Bloco');
  document.getElementById("coluna2").value = blocos.join('\n\n');

  const resultadoFinalSet = new Set([...col3, ...encontrados]);
  const blocosCol4 = dividirEmBlocos(Array.from(resultadoFinalSet), 800, '🔸 Bloco');
  const resultadoFinal = blocosCol4.join('\n\n');

  const leituraEsperada = quantidadeNumeros - naoEncontrados.length;
  const resultadoTexto =
    `❌ Não encontrados no sistema:\n${naoEncontrados.join('\n') || '(nenhum)'}\n\n` +
    `✅ Encontrados no sistema:\n${resultadoFinal}\n\n` +
    `📊 Leitura esperada: ${leituraEsperada} número(s) de série.`;

  document.getElementById("coluna4").value = resultadoTexto;
  mensagens.innerHTML += `<p>${naoEncontrados.length} não encontrado(s).</p>`;

  salvarDados();
}

function dividirEmBlocos(array, blocoSize, label) {
  const blocos = [];
  for (let i = 0; i < array.length; i += blocoSize) {
    const bloco = array.slice(i, i + blocoSize);
    blocos.push(`${label} ${Math.floor(i / blocoSize) + 1}\n${bloco.join(';')}`);
  }
  return blocos;
}

function verificarDuplicados(array) {
  const counts = {};
  const duplicados = [];
  array.forEach(num => {
    counts[num] = (counts[num] || 0) + 1;
    if (counts[num] === 2) duplicados.push(num);
  });
  return duplicados;
}

function deletarDuplicados() {
  let col1 = document.getElementById("coluna1").value.split('\n').map(x => x.trim()).filter(Boolean);
  col1 = [...new Set(col1)];
  document.getElementById("coluna1").value = col1.join('\n');
  gerar();
}

function limparCampos() {
  ["coluna1", "coluna2", "coluna3", "coluna4"].forEach(id => {
    document.getElementById(id).value = '';
    localStorage.removeItem(id);
  });
  document.getElementById("mensagens").innerHTML = '';
  localStorage.removeItem('theme');
  localStorage.removeItem('lunaIndex');
}

document.addEventListener("DOMContentLoaded", () => {
  carregarTema();
  carregarDados();

  document.querySelectorAll("textarea").forEach(textarea => {
    textarea.addEventListener("focus", () => {
      console.log("Foco ativo");
    });

    textarea.addEventListener("input", () => {
      console.log("Está editando");
    });

    textarea.addEventListener("paste", async (e) => {
       e.preventDefault();

      let text = "";

      // Tenta pegar do evento clipboardData (navegador)
      if (e.clipboardData) {
        text = e.clipboardData.getData("text/plain");
      }

      // Se falhar, tenta usar o clipboard do Electron
      if (!text && window.require) {
        try {
          const { clipboard } = require("electron");
          text = clipboard.readText();
        } catch (err) {
          console.error("Erro ao acessar clipboard no Electron:", err);
        }
      }

      if (text) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.setRangeText(text, start, end, "end");
      }
    });
  });
});

