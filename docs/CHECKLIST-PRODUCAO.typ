#set document(title: "INDEX Mobile — Checklist de Produção", author: "Equipe INDEX")
#set page(
  paper: "a4",
  margin: (x: 2cm, y: 2cm),
  numbering: "1",
  footer: context [
    #set text(size: 8pt, fill: rgb("#888"))
    INDEX Mobile · Checklist de Produção · 26/05/2026
    #h(1fr)
    #counter(page).display()
  ],
)
#set text(font: ("Segoe UI", "Arial"), size: 10.5pt, lang: "pt")
#set par(leading: 0.6em)

#let brand = rgb("#208AEF")
#show heading.where(level: 1): set text(fill: brand)
#show heading.where(level: 2): set text(fill: rgb("#1f3a5f"), size: 12pt)

#let feito = box(fill: rgb("#dcfce7"), inset: (x: 5pt, y: 2pt), radius: 3pt)[#text(fill: rgb("#15803d"), weight: "bold", size: 8pt)[FEITO]]
#let parcial = box(fill: rgb("#fef9c3"), inset: (x: 5pt, y: 2pt), radius: 3pt)[#text(fill: rgb("#a16207"), weight: "bold", size: 8pt)[PARCIAL]]
#let pend = box(fill: rgb("#fee2e2"), inset: (x: 5pt, y: 2pt), radius: 3pt)[#text(fill: rgb("#b91c1c"), weight: "bold", size: 8pt)[PENDENTE]]
#let nm = box(fill: rgb("#f1f5f9"), inset: (x: 5pt, y: 2pt), radius: 3pt)[#text(fill: rgb("#475569"), weight: "bold", size: 8pt)[A MEDIR]]

#let secao(titulo, feitos, total) = [
  == #titulo #h(1fr) #text(size: 9pt, fill: rgb("#888"))[#feitos de #total]
]

#let row(status, item, nota) = (status, [*#item*], text(size: 9pt, fill: rgb("#555"))[#nota])

#align(center)[
  #text(size: 20pt, fill: brand, weight: "bold")[INDEX Mobile]
  #linebreak()
  #text(size: 13pt)[Checklist de Produção — Status Atual]
  #linebreak()
  #v(0.2em)
  #text(size: 9.5pt, fill: rgb("#666"))[26 de maio de 2026 · ~5 de 22 itens concluídos]
]
#line(length: 100%, stroke: 0.5pt + rgb("#ddd"))

#block(fill: rgb("#f8fafc"), inset: 9pt, radius: 4pt, width: 100%)[
  #text(size: 9.5pt)[Este é o *portão de pré-lançamento*. A maioria dos itens pertence aos passos finais do roadmap (hardening, compras no app, testes, publicação), que ainda não foram iniciados — por isso estão pendentes. Os itens já "verdes" são os fundamentos plantados cedo de propósito. Legenda: #feito feito · #parcial parcial · #pend a fazer · #nm a medir.]
]

#let tbl(..rows) = table(
  columns: (auto, 1fr, 1.3fr),
  stroke: 0.5pt + rgb("#e5e7eb"),
  inset: (x: 7pt, y: 5pt),
  align: (center + horizon, left + horizon, left + horizon),
  ..rows.pos().flatten(),
)

#secao([Performance], 2.5, 6)
#tbl(
  row(feito, "Hermes habilitado", "Padrão do Expo SDK 56 (React Compiler ligado)"),
  row(parcial, "FlashList nas listas longas", "Home, Biblioteca e capítulos usam; Estante/Bíblia ainda não existem"),
  row(pend, "Imagens com blurhash", "Backend não envia hash; hoje só cor de fundo"),
  row(feito, "TanStack: stale-while-revalidate", "staleTime de 60s configurado"),
  row(parcial, "Sem re-renders desnecessários", "useCallback e seletores Zustand, mas sem profiling ainda"),
  row(nm, "Bundle < 5MB (sem áudio)", "Só medível no build nativo"),
)

#secao([Segurança], 1.5, 6)
#tbl(
  row(feito, "Nenhuma chave secreta no bundle", "Só a anon key (pública por design)"),
  row(parcial, "Tokens no expo-secure-store", "Wrapper pronto; sessão hoje no MMKV (hardening = passo 13)"),
  row(pend, "Áudios criptografados em disco", "Depende do modo offline (passo 12)"),
  row(pend, "SSL pinning", "Passo 13"),
  row(pend, "Jailbreak/root detection", "Passo 13"),
  row(pend, "Screenshot prevention", "Passo 13 (telas sensíveis)"),
)

#secao([Compliance], 0, 6)
#tbl(
  row(pend, "Privacy Manifest (iOS)", "Passo 16 (publicação)"),
  row(pend, "Data Safety Form (Android)", "Passo 16"),
  row(pend, "IAP para upgrade de plano", "Passo 11 (obrigatório Apple) — travado pela Apple pendente"),
  row(pend, "Restore Purchases", "Passo 11"),
  row(pend, "Termos de uso + privacidade no app", "Passo 16"),
  row(pend, "ATT prompt (se analytics cross-app)", "Passo 14/16, se aplicável"),
)

#secao([Qualidade], 1, 4)
#tbl(
  row(feito, "TypeScript strict sem erros", "strict: true; tsc --noEmit zera a cada commit"),
  row(pend, "Testes unitários (billing/áudio/auth)", "Fase de polimento"),
  row(pend, "Testes E2E (Maestro): login + play", "Fase de polimento (passo 16)"),
  row(pend, "Acessibilidade (accessibilityLabel)", "A adicionar nos componentes interativos"),
)

#v(0.6em)
#block(fill: rgb("#fff7ed"), inset: 9pt, radius: 4pt, width: 100%)[
  #text(size: 9.5pt)[*Mapa para os passos do roadmap:* Hardening (tokens, SSL, jailbreak, screenshot, cripto) → passo 13 · IAP + Restore → passo 11 · Privacy Manifest / Data Safety / ATT / Termos → passos 13 e 16 · Testes + acessibilidade → polimento (passo 16) · blurhash, profiling, bundle size → otimização de performance.]
]
