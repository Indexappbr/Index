#set document(title: "INDEX — Métricas do Dia 26/05/2026", author: "INDEX")
#set page(
  paper: "a4",
  flipped: true,
  margin: (x: 1.5cm, y: 0.7cm),
  fill: rgb("#0c0c0e"),
)
#set text(font: ("Segoe UI", "Arial"), size: 9pt, fill: rgb("#e6e6e6"), lang: "pt")
#set par(leading: 0.5em)

#let laranja = rgb("#f59e0b")
#let laranjaClaro = rgb("#fb923c")
#let verde = rgb("#22c55e")
#let cinza = rgb("#8a8a90")
#let cardBg = rgb("#161619")
#let cardBorda = rgb("#27272b")
#let trilho = rgb("#2a2a2e")
#let accentOrange = gradient.linear(laranjaClaro, laranja)
#let accentGreen = gradient.linear(rgb("#4ade80"), verde)

#let kcard(accent, rotulo, valor, sub, vcor) = block(
  fill: cardBg, radius: 9pt, stroke: 0.6pt + cardBorda, inset: 10pt, width: 100%,
)[
  #box(width: 38pt, height: 3pt, radius: 1.5pt, fill: accent)
  #v(5pt)
  #text(size: 7.5pt, fill: cinza, tracking: 1.2pt)[#upper(rotulo)]
  #v(3pt)
  #text(size: 16pt, weight: "bold", fill: vcor)[#valor]
  #v(3pt)
  #text(size: 7.5pt, fill: rgb("#6f6f76"))[#sub]
]

#let tag(t) = box(fill: rgb("#3a2710"), inset: (x: 6pt, y: 2.5pt), radius: 4pt)[
  #text(size: 7.5pt, fill: laranja)[#t]
]

#let barra(p) = box(width: 100%, height: 5pt, radius: 2.5pt, fill: trilho)[
  #box(width: p, height: 5pt, radius: 2.5pt, fill: accentOrange)
]

#let stat(rotulo, valor) = [
  #text(size: 7pt, fill: cinza, tracking: 1pt)[#upper(rotulo)] #linebreak()
  #text(size: 10pt, weight: "bold", fill: white)[#valor]
]

#let frente(titulo, destaque, larguraBarra, l1, v1, l2, v2, l3, v3, l4, v4, tags) = block(
  fill: cardBg, radius: 9pt, stroke: 0.6pt + cardBorda, inset: 11pt, width: 100%,
)[
  #grid(columns: (1fr, auto), align: (left + horizon, right + horizon),
    text(size: 11pt, weight: "bold", fill: laranja)[#titulo],
    text(size: 13pt, weight: "bold", fill: laranja)[#destaque],
  )
  #v(5pt)
  #barra(larguraBarra)
  #v(7pt)
  #grid(columns: (1fr, 1fr), row-gutter: 6pt,
    stat(l1, v1), stat(l2, v2),
    stat(l3, v3), stat(l4, v4),
  )
  #v(7pt)
  #box(tags)
]

// ===== Cabeçalho =====
#align(center)[
  #text(size: 8.5pt, fill: laranja, tracking: 3pt)[#upper("Index — Produção Diária")]
  #v(4pt)
  #text(size: 20pt, weight: "bold", fill: white)[Métricas do Dia]
  #v(3pt)
  #text(size: 8.5pt, fill: cinza)[26 de maio de 2026 · App Mobile (React Native) + Bíblia / Áudio]
  #v(5pt)
  #box(width: 80pt, height: 2.5pt, radius: 1.5pt, fill: accentOrange)
]

#v(9pt)

// ===== Linha 1: entrega do app =====
#grid(columns: (1fr, 1fr, 1fr, 1fr), gutter: 10pt,
  kcard(accentOrange, "Roadmap Mobile", "41%", "6,5 de 16 passos", laranja),
  kcard(accentOrange, "Commits", "13", "enviados ao GitHub", laranja),
  kcard(accentOrange, "Linhas de Código", "3.447", "em 52 arquivos", laranja),
  kcard(accentOrange, "Telas Construídas", "6", "login … Biblioteca", laranja),
)

#v(7pt)

// ===== Linha 2: qualidade e infra =====
#grid(columns: (1fr, 1fr, 1fr, 1fr), gutter: 10pt,
  kcard(accentOrange, "Módulos de Feature", "4", "auth · library · player · search", laranja),
  kcard(accentOrange, "Dependências", "36", "stack instalada (+2 dev)", laranja),
  kcard(accentGreen, "Erros de TypeScript", "0", "strict mode, a cada commit", verde),
  kcard(accentOrange, "Disco Liberado", "~40 GB", "ambiente destravado", laranja),
)

#v(9pt)

// ===== Seção frentes =====
#text(size: 11.5pt, weight: "bold", fill: white)[#text(fill: laranja)[●] #h(4pt) Produção por Frente]
#v(6pt)

#grid(columns: (1fr, 1fr, 1fr), gutter: 10pt,
  frente("App Mobile", "41%", 41%,
    "Passos", "6,5/16", "Commits", "13",
    "Telas", "6", "Módulos", "4",
    [#tag("Expo SDK 56") #h(4pt) #tag("TypeScript")]),
  frente("Bíblia (novo PDF)", "523 pág", 66%,
    "Faixa", "490 → 1013", "Trecho", "Reis → Salmos",
    "Status", "Em produção", "Frente", "Texto",
    [#tag("novo PDF") #h(4pt) #tag("p/ narração")]),
  frente("Áudio / Narração", "2 vozes", 100%,
    "Voz 1", "Bento", "Voz 2", "Matias",
    "Plano", "Business", "Uso", "Comercial",
    [#tag("Business") #h(4pt) #tag("vozes pro")]),
)
