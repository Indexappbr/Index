#set document(title: "INDEX — KPIs do Dia 26/05/2026", author: "Equipe INDEX")
#set page(
  paper: "a4",
  margin: (x: 1.7cm, y: 1.7cm),
  numbering: "1",
  footer: context [
    #set text(size: 8pt, fill: rgb("#888"))
    INDEX · KPIs do Dia · 26/05/2026
    #h(1fr)
    #counter(page).display()
  ],
)
#set text(font: ("Segoe UI", "Arial"), size: 10pt, lang: "pt")
#set par(leading: 0.6em)

#let brand = rgb("#208AEF")
#show heading.where(level: 1): set text(fill: brand, size: 13pt)

// Card de KPI: valor grande + rótulo + sublinha
#let kpi(valor, rotulo, sub, cor: rgb("#eff6ff"), tcor: brand) = block(
  fill: cor, inset: 11pt, radius: 6pt, width: 100%, height: 78pt,
)[
  #text(size: 22pt, weight: "bold", fill: tcor)[#valor]
  #linebreak()
  #text(size: 9.5pt, weight: "bold")[#rotulo]
  #linebreak()
  #text(size: 8pt, fill: rgb("#666"))[#sub]
]

#align(center)[
  #text(size: 20pt, fill: brand, weight: "bold")[INDEX — KPIs do Dia]
  #linebreak()
  #text(size: 12.5pt)[Terça-feira, 26 de maio de 2026]
  #linebreak()
  #v(0.15em)
  #text(size: 9pt, fill: rgb("#666"))[Operador: Guilherme · Frentes: App Mobile (React Native) + Bíblia]
]
#line(length: 100%, stroke: 0.5pt + rgb("#ddd"))

= Frente 1 — App Mobile · KPIs de entrega

#grid(columns: (1fr, 1fr, 1fr), gutter: 8pt,
  kpi("41%", "Roadmap concluído", "6,5 de 16 passos"),
  kpi("13", "Commits no GitHub", "todos em Indexappbr/Index (main)"),
  kpi("6", "Telas construídas", "login, registro, reset, Home, Livro, Biblioteca"),
)
#v(8pt)
#grid(columns: (1fr, 1fr, 1fr), gutter: 8pt,
  kpi("3.447", "Linhas de código (src)", "em 52 arquivos .ts/.tsx"),
  kpi("4", "Módulos de feature", "auth · library · player · search"),
  kpi("36", "Dependências instaladas", "stack mobile (+2 de dev)"),
)
#v(8pt)
#grid(columns: (1fr, 1fr, 1fr), gutter: 8pt,
  kpi("0", "Erros de TypeScript", "strict mode, validado a cada commit", cor: rgb("#dcfce7"), tcor: rgb("#15803d")),
  kpi("14", "Edge functions reaproveitadas", "backend Supabase (sem reescrita)"),
  kpi("~40 GB", "Disco liberado", "ambiente estava 100% cheio", cor: rgb("#fef9c3"), tcor: rgb("#a16207")),
)

= KPIs de qualidade e processo

#table(
  columns: (1fr, auto, 1fr),
  stroke: 0.5pt + rgb("#e5e7eb"),
  inset: (x: 7pt, y: 5pt),
  align: (left + horizon, center + horizon, left + horizon),
  table.header([*Indicador*], [*Valor*], [*Observação*]),
  [Verificação de tipos (tsc)], [0 erros], [Rodada a cada mudança],
  [Empacotamento (expo export web)], [OK], [Bundle gerado sem erros (1.500 módulos)],
  [Commits enviados ao remoto], [100%], [Push a cada entrega concluída],
  [Cobertura de testes automatizados], [0%], [Planejado p/ a fase de polimento (passo 16)],
  [Itens do checklist de produção], [~5 / 22], [Fundamentos verdes; resto nos passos finais],
)

= KPIs do roadmap por bloco

#table(
  columns: (1.2fr, auto, 1.6fr),
  stroke: 0.5pt + rgb("#e5e7eb"),
  inset: (x: 7pt, y: 5pt),
  align: (left + horizon, center + horizon, left + horizon),
  table.header([*Bloco*], [*Progresso*], [*Conteúdo*]),
  [Fundamentos (passos 2–5, 7)], [#text(fill: rgb("#15803d"), weight: "bold")[100%]], [stack, auth, .env, tipos, player],
  [Produto (passos 8–10)], [#text(fill: rgb("#a16207"), weight: "bold")[~40%]], [telas (feito Home/Livro/Biblioteca), 2FA, push],
  [Loja (passos 11–16)], [#text(fill: rgb("#b91c1c"), weight: "bold")[0%]], [IAP, offline, hardening, obs, CI/CD, publicação],
)

= Frente 2 — Bíblia · KPIs de produção

#grid(columns: (1fr, 1fr, 1fr), gutter: 8pt,
  kpi("523", "Páginas concluídas", "no novo PDF da Bíblia", cor: rgb("#f0fdf4"), tcor: rgb("#15803d")),
  kpi("490 → 1013", "Faixa processada", "de Rute em diante", cor: rgb("#f0fdf4"), tcor: rgb("#15803d")),
  kpi("Reis → Salmos", "Trecho coberto", "Reis, Paralipômenos, Esdras… Salmos", cor: rgb("#f0fdf4"), tcor: rgb("#15803d")),
)

= Linha do tempo dos commits (app)

#table(
  columns: (auto, 1fr),
  stroke: 0.5pt + rgb("#e5e7eb"),
  inset: (x: 7pt, y: 4pt),
  align: (left + horizon, left + horizon),
  table.header([*Hash*], [*Entrega*]),
  [`cfc39fd`], [Setup: NativeWind, TS strict, estrutura enterprise, app.config],
  [`99910f5`], [Auth: Supabase + MMKV + Google + rotas com guarda + telas],
  [`dad6e14`], [Tipos do schema Supabase (queries tipadas)],
  [`4c42eb6`], [Catálogo: Home + detalhe do livro],
  [`ad016e0`], [Player de áudio (expo-audio): background + lock screen],
  [`6f25c67`], [expo-dev-client (preparação do build)],
  [`e4cb06e`], [Vinculação do projeto EAS],
  [`0285ab6`], [Biblioteca com busca (edge function)],
  [`549f3ee` … `7e1b1bb`], [Documentação: 4 PDFs + skill /index-mobile],
)
