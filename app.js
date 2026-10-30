const PLATAFORMAS = {
  scratch:   { nome: "Scratch",   cor: "var(--scratch)" },
  construct: { nome: "Construct", cor: "var(--construct)" },
  gdevelop:  { nome: "GDevelop",  cor: "var(--gdevelop)" },
  kodu:      { nome: "Kodu",      cor: "var(--kodu)" },
};

const $ = (sel) => document.querySelector(sel);

const estado = {
  aba: "loja",
  busca: "",
  plataforma: "",
  tema: "",
  ordem: "recentes",
  destaqueAtual: 0,
};

// ---------- Armazenamento local (favoritos, recentes, contagem de jogadas) ----------

function ler(chave, padrao) {
  try { return JSON.parse(localStorage.getItem(chave)) ?? padrao; } catch { return padrao; }
}
function salvar(chave, valor) {
  try { localStorage.setItem(chave, JSON.stringify(valor)); } catch {}
}

let favoritos = new Set(ler("favoritos", []));
let recentes = ler("recentes", []);
let jogadas = ler("jogadas", {});

function alternarFavorito(id) {
  favoritos.has(id) ? favoritos.delete(id) : favoritos.add(id);
  salvar("favoritos", [...favoritos]);
  renderizarTudo();
}

function registrarJogada(id) {
  recentes = [id, ...recentes.filter((r) => r !== id)].slice(0, 10);
  jogadas[id] = (jogadas[id] || 0) + 1;
  salvar("recentes", recentes);
  salvar("jogadas", jogadas);
}

// ---------- Utilidades ----------

const porId = (id) => JOGOS.find((j) => j.id === id);

function esc(texto = "") {
  return String(texto).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function normalizar(texto = "") {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Gera uma cor estável a partir do título, para capas sem imagem.
function corDoTitulo(titulo) {
  let h = 0;
  for (const c of titulo) h = (h * 31 + c.charCodeAt(0)) % 360;
  return `linear-gradient(135deg, hsl(${h} 70% 45%), hsl(${(h + 60) % 360} 70% 30%))`;
}

function htmlCapa(jogo) {
  const fav = favoritos.has(jogo.id) ? `<span class="fav-marca">★</span>` : "";
  if (jogo.capa) {
    return `<div class="capa" style="background-image:url('${esc(jogo.capa)}')">${fav}</div>`;
  }
  const iniciais = jogo.titulo.split(/\s+/).filter((p) => p.length > 2).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  return `<div class="capa" style="background:${corDoTitulo(jogo.titulo)}"><span class="iniciais">${esc(iniciais)}</span>${fav}</div>`;
}

function htmlPlataforma(jogo) {
  const p = PLATAFORMAS[jogo.plataforma] || { nome: jogo.plataforma, cor: "#888" };
  return `<span class="plataforma" style="--cor:${p.cor}">${esc(p.nome)}</span>`;
}

function urlEmbed(jogo) {
  if (jogo.embed) return jogo.embed;
  const scratch = jogo.link.match(/scratch\.mit\.edu\/projects\/(\d+)/);
  if (scratch) return `https://scratch.mit.edu/projects/${scratch[1]}/embed`;
  // Jogos exportados em HTML5 e guardados no próprio site (ex.: "jogos/meu-jogo/").
  if (!/^https?:/.test(jogo.link) && jogo.plataforma !== "kodu") return jogo.link;
  return null;
}

// ---------- Renderização ----------

function htmlCard(jogo) {
  return `
    <button class="card" data-id="${esc(jogo.id)}">
      ${htmlCapa(jogo)}
      <div class="card-corpo">
        <h3>${esc(jogo.titulo)}</h3>
        <div class="autores">${esc(jogo.autores.join(", "))}</div>
        <div class="linha">
          ${htmlPlataforma(jogo)}
          <div class="temas">${jogo.temas.slice(0, 2).map((t) => `<span class="tema">${esc(t)}</span>`).join("")}</div>
        </div>
      </div>
    </button>`;
}

function renderizarDestaques() {
  const secao = $("#destaques");
  const lista = JOGOS.filter((j) => j.destaque);
  if (estado.aba !== "loja" || !lista.length) { secao.innerHTML = ""; return; }

  const jogo = lista[estado.destaqueAtual % lista.length];
  secao.innerHTML = `
    <div data-id="${esc(jogo.id)}" class="destaque-capa">${htmlCapa(jogo)}</div>
    <div class="destaque-info">
      <div>${htmlPlataforma(jogo)}</div>
      <h3>${esc(jogo.titulo)}</h3>
      <p>${esc(jogo.descricao)}</p>
      <p>por <strong>${esc(jogo.autores.join(", "))}</strong></p>
      <div class="temas">${jogo.temas.map((t) => `<span class="tema">${esc(t)}</span>`).join("")}</div>
      <div class="acoes"><button class="btn btn-jogar" data-id="${esc(jogo.id)}">▶ Ver jogo</button></div>
      ${lista.length > 1 ? `<div class="pontos">${lista.map((_, i) =>
        `<button data-destaque="${i}" class="${i === estado.destaqueAtual % lista.length ? "ativo" : ""}" aria-label="Destaque ${i + 1}"></button>`).join("")}</div>` : ""}
    </div>`;
}

function renderizarRecentes() {
  const ids = recentes.filter(porId);
  const mostrar = estado.aba === "loja" && ids.length > 0;
  $("#recentes-secao").hidden = !mostrar;
  if (mostrar) $("#recentes").innerHTML = ids.map((id) => htmlCard(porId(id))).join("");
}

function renderizarFiltros() {
  const usadas = [...new Set(JOGOS.map((j) => j.plataforma))];
  $("#filtro-plataformas").innerHTML = [
    `<button class="chip ${!estado.plataforma ? "ativo" : ""}" data-plataforma="">Todas</button>`,
    ...usadas.map((p) => `<button class="chip ${estado.plataforma === p ? "ativo" : ""}" data-plataforma="${p}"
        style="--cor:${PLATAFORMAS[p]?.cor || "#888"}">${esc(PLATAFORMAS[p]?.nome || p)}</button>`),
  ].join("");

  const temas = [...new Set(JOGOS.flatMap((j) => j.temas))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  $("#filtro-tema").innerHTML = `<option value="">Todos os temas</option>` +
    temas.map((t) => `<option ${estado.tema === t ? "selected" : ""}>${esc(t)}</option>`).join("");
}

function jogosFiltrados() {
  const termo = normalizar(estado.busca.trim());
  let lista = JOGOS.filter((j) =>
    (estado.aba !== "biblioteca" || favoritos.has(j.id)) &&
    (!estado.plataforma || j.plataforma === estado.plataforma) &&
    (!estado.tema || j.temas.includes(estado.tema)) &&
    (!termo || normalizar([j.titulo, ...j.autores, ...j.temas, j.turma || ""].join(" ")).includes(termo))
  );

  const ordens = {
    recentes: (a, b) => (b.data || "").localeCompare(a.data || ""),
    az: (a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"),
    jogados: (a, b) => (jogadas[b.id] || 0) - (jogadas[a.id] || 0),
  };
  return lista.sort(ordens[estado.ordem]);
}

function renderizarGrade() {
  const lista = jogosFiltrados();
  $("#titulo-lista").textContent = estado.aba === "biblioteca"
    ? `Minha biblioteca (${lista.length})`
    : `Todos os jogos (${lista.length})`;
  $("#grade").innerHTML = lista.map(htmlCard).join("");

  const vazio = $("#vazio");
  vazio.hidden = lista.length > 0;
  vazio.textContent = estado.aba === "biblioteca" && favoritos.size === 0
    ? "Você ainda não adicionou jogos. Abra um jogo e clique em “Adicionar à biblioteca”."
    : "Nenhum jogo encontrado com esses filtros.";
}

function renderizarTudo() {
  $("#cont-favoritos").textContent = favoritos.size || "";
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("ativo", t.dataset.aba === estado.aba));
  renderizarDestaques();
  renderizarRecentes();
  renderizarFiltros();
  renderizarGrade();
}

// ---------- Página do jogo ----------

function abrirJogo(id, jogando = false) {
  const jogo = porId(id);
  if (!jogo) return;
  const embed = urlEmbed(jogo);
  const kodu = jogo.plataforma === "kodu";

  const midia = jogando && embed
    ? `<iframe src="${esc(embed)}" allowfullscreen allow="autoplay; fullscreen; gamepad"></iframe>`
    : htmlCapa(jogo);

  const botaoJogar = embed
    ? `<button class="btn btn-jogar" data-jogar="${esc(jogo.id)}">▶ ${jogando ? "Reiniciar" : "Jogar aqui"}</button>`
    : `<a class="btn btn-jogar" href="${esc(jogo.link)}" target="_blank" rel="noopener" data-registrar="${esc(jogo.id)}">
         ${kodu ? "⬇ Baixar jogo" : "▶ Jogar"}</a>`;

  $("#detalhe-conteudo").innerHTML = `
    <div class="midia">${midia}</div>
    <div class="detalhe-corpo">
      <div>
        <h2>${esc(jogo.titulo)}</h2>
        <div class="temas">${jogo.temas.map((t) => `<span class="tema">${esc(t)}</span>`).join("")}</div>
        <div class="acoes">
          ${botaoJogar}
          ${jogando && embed ? `<button class="btn btn-sec" data-tela-cheia>⛶ Tela cheia</button>` : ""}
          ${embed ? `<a class="btn btn-sec" href="${esc(jogo.link)}" target="_blank" rel="noopener">Abrir em nova aba ↗</a>` : ""}
          <button class="btn btn-sec" data-favorito="${esc(jogo.id)}">
            ${favoritos.has(jogo.id) ? "★ Na sua biblioteca" : "☆ Adicionar à biblioteca"}</button>
        </div>
        <p>${esc(jogo.descricao)}</p>
        ${jogo.controles ? `<p><strong>Como jogar:</strong> ${esc(jogo.controles)}</p>` : ""}
        ${kodu ? `<p><small>Jogos do Kodu precisam do <a href="https://www.kodugamelab.com/" target="_blank" rel="noopener">Kodu Game Lab</a> instalado no computador.</small></p>` : ""}
      </div>
      <dl class="ficha">
        <div><dt>Criado por</dt><dd>${esc(jogo.autores.join(", "))}</dd></div>
        ${jogo.turma ? `<div><dt>Turma</dt><dd>${esc(jogo.turma)}</dd></div>` : ""}
        <div><dt>Plataforma</dt><dd>${htmlPlataforma(jogo)}</dd></div>
        ${jogo.data ? `<div><dt>Publicado em</dt><dd>${new Date(jogo.data + "T12:00").toLocaleDateString("pt-BR")}</dd></div>` : ""}
        <div><dt>Vezes jogado (neste PC)</dt><dd>${jogadas[jogo.id] || 0}</dd></div>
      </dl>
    </div>`;

  const dialogo = $("#detalhe");
  if (!dialogo.open) dialogo.showModal();
  if (location.hash !== `#jogo/${id}`) history.replaceState(null, "", `#jogo/${id}`);
}

function fecharJogo() {
  $("#detalhe-conteudo").innerHTML = ""; // para o jogo que estiver rodando
  history.replaceState(null, "", location.pathname + location.search);
}

// ---------- Eventos ----------

document.addEventListener("click", (e) => {
  const alvo = e.target.closest("[data-id], [data-jogar], [data-tela-cheia], [data-favorito], [data-registrar], [data-plataforma], [data-destaque], [data-aba]");
  if (!alvo) return;
  const d = alvo.dataset;

  if (d.telaCheia !== undefined) $("#detalhe .midia").requestFullscreen?.();
  else if (d.jogar) { registrarJogada(d.jogar); abrirJogo(d.jogar, true); renderizarTudo(); }
  else if (d.favorito) { alternarFavorito(d.favorito); abrirJogo(d.favorito, !!$("#detalhe iframe")); }
  else if (d.registrar) { registrarJogada(d.registrar); renderizarTudo(); }
  else if (d.plataforma !== undefined) { estado.plataforma = d.plataforma; renderizarTudo(); }
  else if (d.destaque !== undefined) { estado.destaqueAtual = Number(d.destaque); renderizarDestaques(); }
  else if (d.aba) { estado.aba = d.aba; renderizarTudo(); }
  else if (d.id) abrirJogo(d.id);
});

$("#busca").addEventListener("input", (e) => { estado.busca = e.target.value; renderizarGrade(); });
$("#filtro-tema").addEventListener("change", (e) => { estado.tema = e.target.value; renderizarGrade(); });
$("#ordenar").addEventListener("change", (e) => { estado.ordem = e.target.value; renderizarGrade(); });

const dialogo = $("#detalhe");
dialogo.querySelector(".fechar").addEventListener("click", () => dialogo.close());
dialogo.addEventListener("click", (e) => { if (e.target === dialogo) dialogo.close(); });
dialogo.addEventListener("close", fecharJogo);

// Troca o destaque automaticamente a cada 7 segundos.
setInterval(() => {
  if (dialogo.open || document.hidden) return;
  estado.destaqueAtual++;
  renderizarDestaques();
}, 7000);

// ---------- Início ----------

document.title = SITE.nome;
$("#site-nome").textContent = SITE.nome;
$("#site-subtitulo").textContent = SITE.subtitulo;
renderizarTudo();

const jogoNoLink = location.hash.match(/^#jogo\/(.+)$/);
if (jogoNoLink) abrirJogo(decodeURIComponent(jogoNoLink[1]));
