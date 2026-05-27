#set document(title: "INDEX App — Relatório de Conversão", author: "Stryker")
#set page(
  paper: "a4",
  flipped: true,
  margin: (x: 1.6cm, y: 1.3cm),
  fill: rgb("#0c0c0e"),
)
#set text(font: ("Segoe UI", "Arial"), size: 9.5pt, fill: rgb("#e6e6e6"), lang: "pt")
#set par(leading: 0.55em)

#let laranja = rgb("#f59e0b")
#let laranjaClaro = rgb("#fb923c")
#let vermelho = rgb("#ef4444")
#let cinza = rgb("#8a8a90")
#let cardBg = rgb("#161619")
#let cardBorda = rgb("#27272b")
#let trilho = rgb("#2a2a2e")
#let accentOrange = gradient.linear(laranjaClaro, laranja)
#let accentRed = gradient.linear(vermelho, laranjaClaro)

// Card de KPI com barra-acento no topo
#let kcard(accent, rotulo, valor, sub, vcor) = block(
  fill: cardBg, radius: 9pt, stroke: 0.6pt + cardBorda, inset: 13pt, width: 100%,
)[
  #box(width: 42pt, height: 3pt, radius: 1.5pt, fill: accent)
  #v(8pt)
  #text(size: 7.5pt, fill: cinza, tracking: 1.3pt)[#upper(rotulo)]
  #v(5pt)
  #text(size: 18pt, weight: "bold", fill: vcor)[#valor]
  #v(4pt)
  #text(size: 8pt, fill: rgb("#6f6f76"))[#sub]
]

#let tag(t) = box(fill: rgb("#3a2710"), inset: (x: 7pt, y: 3pt), radius: 4pt)[
  #text(size: 7.5pt, fill: laranja)[#t]
]

#let barra(p) = box(width: 100%, height: 5pt, radius: 2.5pt, fill: trilho)[
  #box(width: p, height: 5pt, radius: 2.5pt, fill: accentOrange)
]

#let stat(rotulo, valor, vcor) = [
  #text(size: 7pt, fill: cinza, tracking: 1pt)[#upper(rotulo)] #linebreak()
  #v(1pt)
  #text(size: 11pt, weight: "bold", fill: vcor)[#valor]
]

// Card de canal
#let canal(titulo, pct, larguraBarra, cliques, vendas, bruto, liquido, tags) = block(
  fill: cardBg, radius: 9pt, stroke: 0.6pt + cardBorda, inset: 13pt, width: 100%,
)[
  #grid(columns: (1fr, auto), align: (left + horizon, right + horizon),
    text(size: 11pt, weight: "bold", fill: laranja)[#titulo],
    text(size: 15pt, weight: "bold", fill: laranja)[#pct],
  )
  #v(8pt)
  #barra(larguraBarra)
  #v(10pt)
  #grid(columns: (1fr, 1fr), row-gutter: 9pt,
    stat("Cliques", cliques, white), stat("Vendas", vendas, white),
    stat("Bruto", bruto, white), stat("Líquido", liquido, laranja),
  )
  #v(10pt)
  #box(tags)
]

// ===== Cabeçalho =====
#align(center)[
  #text(size: 9pt, fill: laranja, tracking: 3pt)[#upper("Index App — Tracking Intelligence")]
  #v(6pt)
  #text(size: 26pt, weight: "bold", fill: white)[Relatório de Conversão]
  #v(5pt)
  #text(size: 9pt, fill: cinza)[26 de maio de 2026 · Gerado automaticamente via Stryker]
  #v(8pt)
  #box(width: 90pt, height: 2.5pt, radius: 1.5pt, fill: accentOrange)
]

#v(12pt)

// ===== Linha 1: KPIs principais =====
#grid(columns: (1fr, 1fr, 1fr, 1fr), gutter: 11pt,
  kcard(accentOrange, "Vendas Hoje", "30", "pedidos pagos", laranja),
  kcard(accentOrange, "Receita Bruta", "R$ 5.393,70", "27x R$197 + 3x R$24,90", laranja),
  kcard(accentOrange, "Receita Líquida", "R$ 3.104,87", "após taxas e coprodução", laranja),
  kcard(accentOrange, "Cliques Rastreados", "129", "humanos · 8 links ativos", laranja),
)

#v(10pt)

// ===== Linha 2: custos / margem =====
#grid(columns: (1fr, 1fr, 1fr), gutter: 11pt,
  kcard(accentRed, "Taxas da Plataforma", "– R$ 219,04", "4,1% da receita bruta", vermelho),
  kcard(accentRed, "Coprodução", "– R$ 2.069,79", "38,4% da receita bruta", vermelho),
  kcard(accentRed, "Margem Líquida", "57,6%", "R$ 3.104,87 de R$ 5.393,70", laranja),
)

#v(13pt)

// ===== Seção canais =====
#text(size: 12pt, weight: "bold", fill: white)[#text(fill: laranja)[●] #h(4pt) Conversão por Canal Rastreado]
#v(8pt)

#grid(columns: (1fr, 1fr, 1fr), gutter: 11pt,
  canal("WhatsApp Grupo", "11,8%", 94%, "34", "4", "R$ 788", "R$ 443", [#tag("fundadores-maio") #h(4pt) #tag("oferta-26-05")]),
  canal("ManyChat Reels", "12,5%", 100%, "8", "1", "R$ 197", "R$ 117", [#tag("fundadores-maio") #h(4pt) #tag("reels")]),
  canal("Instagram Story", "6,3%", 50%, "16", "1", "R$ 197", "R$ 117", [#tag("organico-instagram") #h(4pt) #tag("index")]),
)
