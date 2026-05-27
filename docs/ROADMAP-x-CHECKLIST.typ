#set document(title: "INDEX Mobile — Roadmap × Checklist", author: "Equipe INDEX")
#set page(
  paper: "a4",
  margin: (x: 1.8cm, y: 1.8cm),
  numbering: "1",
  footer: context [
    #set text(size: 8pt, fill: rgb("#888"))
    INDEX Mobile · Roadmap × Checklist · 26/05/2026
    #h(1fr)
    #counter(page).display()
  ],
)
#set text(font: ("Segoe UI", "Arial"), size: 10pt, lang: "pt")
#set par(leading: 0.6em)

#let brand = rgb("#208AEF")
#show heading.where(level: 1): set text(fill: brand)
#show heading.where(level: 2): set text(fill: rgb("#1f3a5f"), size: 12pt)

#let ok = box(fill: rgb("#dcfce7"), inset: (x: 4pt, y: 1.5pt), radius: 3pt)[#text(fill: rgb("#15803d"), weight: "bold", size: 8pt)[FEITO]]
#let doing = box(fill: rgb("#fef9c3"), inset: (x: 4pt, y: 1.5pt), radius: 3pt)[#text(fill: rgb("#a16207"), weight: "bold", size: 8pt)[ANDAMENTO]]
#let blocked = box(fill: rgb("#fee2e2"), inset: (x: 4pt, y: 1.5pt), radius: 3pt)[#text(fill: rgb("#b91c1c"), weight: "bold", size: 8pt)[BLOQ. APPLE]]
#let pend = box(fill: rgb("#f1f5f9"), inset: (x: 4pt, y: 1.5pt), radius: 3pt)[#text(fill: rgb("#475569"), weight: "bold", size: 8pt)[A FAZER]]

#align(center)[
  #text(size: 19pt, fill: brand, weight: "bold")[INDEX Mobile]
  #linebreak()
  #text(size: 13pt)[Roadmap × Checklist de Produção — Visão Unificada]
  #linebreak()
  #v(0.2em)
  #text(size: 9.5pt, fill: rgb("#666"))[26 de maio de 2026 · 6,5 de 16 passos · ~5 de 22 itens]
]
#line(length: 100%, stroke: 0.5pt + rgb("#ddd"))

#block(fill: rgb("#f8fafc"), inset: 9pt, radius: 4pt, width: 100%)[
  #text(size: 9.5pt)[*A ideia:* os *16 passos* são o caminho (o "como"); o *checklist de 22 itens* é o critério de aceitação (o "está pronto?"). Cada item do checklist é satisfeito dentro de um passo. Quando os 16 passos fecharem, os 22 itens ficam verdes.]
]

= Os 16 passos → o que cada um fecha do checklist

#table(
  columns: (auto, 1.1fr, auto, 1.4fr),
  stroke: 0.5pt + rgb("#e5e7eb"),
  inset: (x: 6pt, y: 4.5pt),
  align: (center + horizon, left + horizon, center + horizon, left + horizon),
  table.header([*Nº*], [*Passo*], [*Status*], [*Itens do checklist que satisfaz*]),
  [1], [Apple Developer (pago)], ok, [pré-requisito],
  [2], [Repo + stack], ok, [Hermes · TS strict · TanStack SWR (base)],
  [3], [Autenticação], ok, [base p/ testes de auth (16)],
  [4], [Conexão .env Supabase], ok, [Nenhuma chave secreta no bundle],
  [5], [Tipos do banco], ok, [reforça TS strict],
  [6], [Dev build iPhone], blocked, [Bundle < 5MB (1ª medição) · destrava testar no device],
  [7], [Player de áudio], ok, [base de áudio p/ cripto e testes],
  [8], [Feature parity (telas)], doing, [FlashList em todas as listas · blurhash · acessibilidade (parcial)],
  [9], [2FA — tela nativa], pend, [reforça segurança de login],
  [10], [Push notifications], pend, [pode acionar ATT (se analytics)],
  [11], [IAP (RevenueCat)], pend, [IAP p/ upgrade (obrigatório Apple) · Restore Purchases],
  [12], [Offline], pend, [Áudios criptografados em disco],
  [13], [Hardening + Privacy Manifest], pend, [Tokens no secure-store · SSL pinning · Jailbreak/root · Screenshot prevention · Privacy Manifest],
  [14], [Observabilidade], pend, [ATT prompt (se analytics cross-app)],
  [15], [CI/CD], pend, [onde os testes passam a rodar automático],
  [16], [Publicação App Store], pend, [Data Safety · Termos/Privacidade · Testes unit · E2E (Maestro) · Acessibilidade final · Profiling · Bundle < 5MB (final)],
)

= O checklist ao contrário — onde cada grupo "nasce"

#table(
  columns: (auto, 1fr),
  stroke: 0.5pt + rgb("#e5e7eb"),
  inset: (x: 7pt, y: 5pt),
  align: (left + horizon, left + horizon),
  table.header([*Grupo (feitos/total)*], [*Onde se materializa*]),
  [Performance (2,5/6)], [Hermes e SWR já no passo 2; FlashList e blurhash no 8; profiling, re-renders e bundle no polimento (16)],
  [Segurança (1,5/6)], ["Sem segredos" já no passo 4; cripto de áudio no 12; secure-store, SSL, jailbreak e screenshot concentram no passo 13],
  [Compliance (0/6)], [IAP + Restore no passo 11; Privacy Manifest no 13/16; Data Safety, Termos e ATT no 16/14],
  [Qualidade (1/4)], [TS strict já feito (passo 2); testes e acessibilidade no fechamento (16), apoiados pelo CI (15)],
)

= Onde estamos

#grid(
  columns: (1fr, 1fr, 1fr),
  gutter: 8pt,
  block(fill: rgb("#dcfce7"), inset: 9pt, radius: 4pt)[
    #text(weight: "bold")[Fundamentos] #linebreak()
    Passos 2–5 e 7 — #text(fill: rgb("#15803d"))[feitos]. Já acenderam 5 itens do checklist.
  ],
  block(fill: rgb("#fef9c3"), inset: 9pt, radius: 4pt)[
    #text(weight: "bold")[Bloco de produto] #linebreak()
    Passos 8–10 — #text(fill: rgb("#a16207"))[em andamento]. Funcionalidade + performance/acessibilidade.
  ],
  block(fill: rgb("#f1f5f9"), inset: 9pt, radius: 4pt)[
    #text(weight: "bold")[Bloco de loja] #linebreak()
    Passos 11–16 — #text(fill: rgb("#475569"))[a fazer]. Fecha a maior parte do checklist; depende da Apple ativar.
  ],
)

#v(0.5em)
#block(fill: rgb("#fff7ed"), inset: 9pt, radius: 4pt, width: 100%)[
  #text(size: 9.5pt)[*Em uma frase:* fundamentos prontos, no meio do bloco de produto; o checklist vai acendendo conforme entrarmos no bloco de loja — que destrava de vez quando a conta Apple Developer sair de "pendente".]
]
