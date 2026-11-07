// =====================================================================
//  CATÁLOGO DE JOGOS — este é o único arquivo que você precisa editar.
// =====================================================================
//
//  Para adicionar um jogo, copie um bloco { ... } e altere os campos:
//
//   id          identificador único, sem espaços nem acentos (vira o link do jogo)
//   titulo      nome do jogo
//   autores     lista com o nome dos alunos
//   turma       turma / período (opcional)
//   plataforma  "scratch" | "construct" | "gdevelop" | "kodu"
//   temas       lista de temas (ex.: "Halloween", "Espaço", "Meio Ambiente")
//   descricao   texto curto sobre o jogo
//   controles   como jogar (opcional)
//   link        endereço do jogo (Scratch, gd.games, itch.io, Construct Arcade...)
//   capa        imagem de capa (opcional): URL ou arquivo em /capas, ex.: "capas/meu-jogo.png"
//   destaque    true para aparecer no banner da página inicial (opcional)
//   data        data de publicação, formato "AAAA-MM-DD"
//
//  Construct / GDevelop: exporte como HTML5 (Web), descompacte numa pasta
//  dentro de /jogos e use em "link" o caminho dela, ex.: "jogos/oceano-limpo/".
//  Assim o jogo também abre direto dentro do site.
//
//  Jogos do Scratch abrem direto dentro do site. Para outras plataformas,
//  se o jogo puder ser incorporado, preencha também o campo "embed" com o
//  endereço do player; senão o botão "Jogar" abre o link em outra aba.
//  Para Kodu, use em "link" o endereço de download do arquivo .kodu2.

const SITE = {
  nome: "Biblioteca de Jogos",
  subtitulo: "Jogos criados pelos alunos",
};

const JOGOS = [
  {
    id: "amendoim-survival",
    titulo: "Amendoim Survival",
    autores: ["Lucas Costa"],
    turma: "Turma Sexta 10:30",
    plataforma: "scratch",
    temas: ["ação"],
    descricao: "Sobreviva o maximo de tempo de amendoins",
    controles: "Setas para mover",
    link: "https://scratch.mit.edu/projects/1392709256/",
    capa: "capas/Amendozombi_ Sobrevivencia_Contra_o_Caos.png",
    destaque: false,
    data: "2026-10-30",
  },
  {
    id: "CyberPong",
    titulo: "Cyber Pong",
    autores: ["Lucas"],
    turma: "Turma Sexta 10:30",
    plataforma: "scrath",
    temas: ["ação", "casual"],
    descricao: "Derrote a inteligência Artificial nesse jogo frenético de ping pong",
    controles: "Teclas W e S",
    link: "https://scratch.mit.edu/projects/1387630654",
    capa: "capas/CyberPong_ Arena_Neon_Retro_futurista.png",
    destaque: true,
    data: "2026-10-30",
  },
  {
    id: "gato-clicker",
    titulo: "GatoClicker",
    autores: ["Isabelle Rockenbach"],
    turma: "Turma Terça 14:00",
    plataforma: "scrath",
    temas: ["gato", "clicker"],
    descricao: "Consiga obter todas as versões de seus gatos favoritos",
    controles: "Utilize o botão do mouse para clicar",
    link: "https://scratch.mit.edu/projects/1397721644",
    capa: "capas/GatoClicker_ Toque_Ganhe_e_Ronrone.png",
    data: "2026-10-30",
    destaque: true,
  },
  {
    id: "martelo-caça-toupeira",
    titulo: "Martelo Caça Toupeira",
    autores: ["Marco Antônio B Santos"],
    turma: "Turma Quinta 16:00",
    plataforma: "scrath",
    temas: ["clicker", "casual"],
    descricao: "Acerte as toupeiras com um martelo e consiga o máximo de pontos",
    controles: "clique nas toupeiras que sairem de suas tocas",
    link: "https://scratch.mit.edu/projects/1190711790",
    capa: "capas/Martelo_Caca_Toupeira_em_Acao.png",
    data: "2026-10-30",
    destaque: false,
  },
  {
    id: "universal-pong",
    titulo: "Universal Pong",
    autores: ["Marco Antônio B Santos"],
    turma: "Turma Quinta 16:00",
    plataforma: "scrath",
    temas: ["ação", "casual"],
    descricao: "Jogue com um amigo e vejam quem marca mais pontos no ping pong",
    controles: "use as teclas W S  e arrow Up Down",
    link: "https://scratch.mit.edu/projects/1196380732",
    capa: "capas/Duelo_Cosmico _e_Pingue_Pongue.png",
    data: "2026-10-30",
    destaque: false,
  },
  // {
  //   id: "NaveMeteor",
  //   titulo: "Nave Meteor",
  //   autores: ["Gustavo Passos"],
  //   turma: "Turma Sexta 16:00",
  //   plataforma: "scrath",
  //   temas: ["ação", "casual"],
  //   descricao: "Escape com sua nave de vários asteróides",
  //   controles: "use as teclas W S A D e atire com o botão esquerdo do Mouse",
  //   link: "https://scratch.mit.edu/projects/1196380732",
  //   capa: "capas/Duelo_Cosmico _e_Pingue_Pongue.png",
  //   data: "2026-10-30",
  //   destaque: false,
  // },
    {
    id: "infestacao",
    titulo: "Infestação",
    autores: ["SuperGeeks"],
    turma: "",
    plataforma: "scrath",
    temas: ["ação", "casual"],
    descricao: "Pare a bola que produz o som, e impeça a infestação delas",
    controles: "clique nas bolas para paralas",
    link: "https://scratch.mit.edu/projects/1433874451/",
    capa: "capas/Infestação_ Arena de Bolhas.png",
    data: "2026-10-30",
    destaque: false,
  },


];
