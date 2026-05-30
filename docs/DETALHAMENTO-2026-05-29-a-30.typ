#set document(title: "INDEX Mobile — Detalhamento (29–30/05/2026)", author: "Equipe INDEX")
#set page(
  paper: "a4",
  margin: (x: 2cm, y: 2cm),
  numbering: "1",
  footer: context [
    #set text(size: 8pt, fill: rgb("#888"))
    INDEX Mobile · Detalhamento · 29–30/05/2026
    #h(1fr)
    #counter(page).display()
  ],
)
#set text(font: ("Segoe UI", "Arial"), size: 10.5pt, lang: "pt")
#set par(justify: true, leading: 0.65em)
#show heading: set block(above: 1.2em, below: 0.6em)

#let brand = rgb("#208AEF")
#show heading.where(level: 1): set text(fill: brand)
#show heading.where(level: 2): set text(fill: rgb("#1f3a5f"))

#let ok = box(fill: rgb("#dcfce7"), inset: (x: 5pt, y: 2pt), radius: 3pt)[#text(fill: rgb("#15803d"), weight: "bold", size: 8pt)[CONCLUÍDO]]
#let stub = box(fill: rgb("#e0f2fe"), inset: (x: 5pt, y: 2pt), radius: 3pt)[#text(fill: rgb("#0369a1"), weight: "bold", size: 8pt)[PRONTO P/ PLUGAR]]
#let blocked = box(fill: rgb("#fee2e2"), inset: (x: 5pt, y: 2pt), radius: 3pt)[#text(fill: rgb("#b91c1c"), weight: "bold", size: 8pt)[DEPENDE DA APPLE]]
#let defer = box(fill: rgb("#fef9c3"), inset: (x: 5pt, y: 2pt), radius: 3pt)[#text(fill: rgb("#a16207"), weight: "bold", size: 8pt)[ADIADO]]

#let check = text(fill: rgb("#15803d"), weight: "bold")[✓]

#align(center)[
  #text(size: 22pt, fill: brand, weight: "bold")[INDEX Mobile]
  #linebreak()
  #text(size: 14pt)[Detalhamento — O que foi construído]
  #linebreak()
  #v(0.3em)
  #text(size: 10pt, fill: rgb("#666"))[App nativo iOS/Android · Migração do app web · 29 e 30 de maio de 2026]
]

#line(length: 100%, stroke: 0.5pt + rgb("#ddd"))

= Sumário executivo

Ao longo de *29 e 30 de maio*, o app *mobile nativo da INDEX* (audiolivros católicos, React Native) avançou da metade do roadmap para um estado *pronto para publicação* — faltando apenas o que depende da ativação da conta Apple Developer.

Foram concluídos: (1) *toda a Fase 2* do plano de migração (paridade de funcionalidades com o app web); (2) *praticamente todo o checklist de produção* de performance, segurança, compliance e qualidade; (3) *infraestrutura de CI/CD, testes e observabilidade*; e (4) a *estrutura de pagamentos no app (IAP)* pronta para ser ativada.

Tudo foi validado a cada passo por *4 verificações automáticas* — checagem de tipos, lint, testes unitários e empacotamento — e versionado no GitHub (12 commits). O app *ainda não foi testado em aparelho físico* (o ambiente é Windows, sem simulador iOS), o que ocorrerá no primeiro build de dispositivo.

#block(fill: rgb("#f0f9ff"), inset: 10pt, radius: 5pt, width: 100%)[
  *Resultado do período:* Fase 2 completa · 14 itens do checklist de produção fechados · CI/CD ativo · 22 testes automatizados · billing pronto para plugar. O único impedimento é externo: a conta *Apple Developer* segue em processamento.
]

= 1. Funcionalidades novas (Fase 2 — paridade com o web)

Estas são as telas e recursos que o usuário final passa a ter no app.

#table(
  columns: (auto, 1fr, auto),
  stroke: 0.5pt + rgb("#e5e7eb"),
  inset: 7pt,
  fill: (_, row) => if row == 0 { rgb("#f8fafc") } else { white },
  [*Recurso*], [*O que faz*], [*Status*],
  [Estante / Favoritos], [Aba própria com os livros favoritados; botão de coração na tela do livro. Sincroniza com o servidor no login e funciona offline (cache local).], ok,
  [Tela de Conta], [Perfil (nome, e-mail, foto), selo de Membro Fundador, status da assinatura e logout — requisito da App Store.], ok,
  [Mini-player global], [Barra de player fixa que acompanha o usuário entre as abas; tocar nela abre o livro atual.], ok,
  [Deep links], [Links de conteúdo (`indexapp://livro/...`) e links web abrem a tela certa; retornos de login são tratados com segurança.], ok,
  [Bíblia], [Aba com Antigo e Novo Testamento, organizada por seções (Pentateuco, Evangelhos…) em carrosséis de capas.], ok,
  [Notificações (push)], [Permissão, registro do dispositivo e abertura por toque (deep link). Tela de preferências na Conta.], ok,
  [2FA — duas etapas], [Ativar/desativar verificação em duas etapas (TOTP), integrando o app autenticador do próprio aparelho.], ok,
  [Foto de perfil], [Selecionar, recortar e enviar a foto do avatar (redimensionada automaticamente).], ok,
)

#text(size: 9pt, fill: rgb("#666"))[Com isso, o app mobile alcança *paridade de funcionalidades* com o app web: além do que já existia (login, catálogo, player com reprodução em segundo plano e busca), agora tem favoritos, conta, Bíblia, push e segurança.]

= 2. Segurança e privacidade

#table(
  columns: (auto, 1fr, auto),
  stroke: 0.5pt + rgb("#e5e7eb"),
  inset: 7pt,
  fill: (_, row) => if row == 0 { rgb("#f8fafc") } else { white },
  [*Item*], [*O que foi feito*], [*Status*],
  [Sessão criptografada], [Os tokens de login agora ficam *cifrados em repouso*: a chave de criptografia vive no cofre do aparelho (Keychain/Keystore) e a sessão cifrada na memória rápida. Padrão recomendado pelo Supabase.], ok,
  [Prevenção de captura], [Bloqueio de print/gravação de tela enquanto a chave do 2FA está visível.], ok,
  [Detecção de jailbreak], [Aviso (não-bloqueante) quando o aparelho aparenta estar comprometido — sem módulo nativo, zero risco de quebrar o build.], ok,
  [Sem segredos no app], [Apenas a chave pública do Supabase (pública por design) é embarcada; nenhum segredo real no pacote.], ok,
  [Privacy Manifest iOS], [Declaração das APIs sensíveis usadas (armazenamento, arquivos, disco) — obrigatório pela Apple desde 2024.], ok,
  [SSL pinning], [Deixado deliberadamente para a fase de hardening com aparelho físico (um pin errado derruba a rede do app sem recuperação).], defer,
)

= 3. Qualidade, testes e processo

#table(
  columns: (auto, 1fr, auto),
  stroke: 0.5pt + rgb("#e5e7eb"),
  inset: 7pt,
  fill: (_, row) => if row == 0 { rgb("#f8fafc") } else { white },
  [*Item*], [*O que foi feito*], [*Status*],
  [Testes automatizados], [22 testes unitários cobrindo a lógica crítica (catálogo, deep links, 2FA, push, billing). Rodam em segundos.], ok,
  [ESLint], [Padronização de código configurada e *obrigatória* no CI.], ok,
  [Observabilidade (Sentry)], [Captura automática de erros/crashes, ligada ao logger do app. Ativa sozinha quando a chave for configurada.], ok,
  [CI/CD (GitHub Actions)], [A cada envio de código: lint + checagem de tipos + testes rodam automaticamente. Build na nuvem (EAS) com disparo manual.], ok,
  [Testes E2E (Maestro)], [Roteiros de ponta-a-ponta escritos (login e reprodução); rodam assim que houver um build de dispositivo.], ok,
  [Acessibilidade], [Rótulos de acessibilidade em todos os elementos interativos (leitor de tela).], ok,
)

= 4. Pagamentos no app (IAP) — pronto para plugar

A Apple *exige* que upgrades de assinatura dentro do app usem o pagamento nativo (não é permitido enviar o usuário para um checkout externo). Por isso:

#list(
  [Foi criada uma *tela de assinatura (paywall)* completa: benefícios, planos Mensal (R\$ 24,90) e Anual (R\$ 197), e botão de *Restaurar compras* (obrigatório).],
  [A lógica de compra está por trás de uma *interface trocável*. Hoje roda em *modo demonstração*; a integração real (RevenueCat) está escrita e documentada — ativá-la é *uma única troca de código* + instalar a biblioteca.],
  [*Quem assinou pelo site não fica de fora:* basta entrar com a mesma conta que o acesso é liberado. O app respeita a regra da Apple e *não* mostra link para o checkout do site.],
)

#align(center)[#stub #h(6pt) #text(size: 9pt, fill: rgb("#666"))[Estrutura completa; falta apenas conectar as chaves quando a conta Apple estiver ativa.]]

= 5. Checklist de produção — placar final

#grid(
  columns: (1fr, 1fr),
  gutter: 10pt,
  block(fill: rgb("#f8fafc"), inset: 9pt, radius: 4pt, width: 100%)[
    *Performance*
    #list(spacing: 0.4em,
      [#check Hermes habilitado],
      [#check Listas otimizadas (FlashList)],
      [#check Placeholder (blurhash) nas capas],
      [#check Cache stale-while-revalidate],
    )
  ],
  block(fill: rgb("#f8fafc"), inset: 9pt, radius: 4pt, width: 100%)[
    *Segurança*
    #list(spacing: 0.4em,
      [#check Tokens criptografados no cofre],
      [#check Sem segredos no pacote],
      [#check Prevenção de captura de tela],
      [#check Detecção de jailbreak/root],
    )
  ],
  block(fill: rgb("#f8fafc"), inset: 9pt, radius: 4pt, width: 100%)[
    *Compliance*
    #list(spacing: 0.4em,
      [#check Privacy Manifest (iOS)],
      [#check Termos + Privacidade no app],
      [#check Restaurar compras (estrutura)],
      [#check Sem checkout externo no app],
    )
  ],
  block(fill: rgb("#f8fafc"), inset: 9pt, radius: 4pt, width: 100%)[
    *Qualidade*
    #list(spacing: 0.4em,
      [#check TypeScript estrito, 0 erros],
      [#check Testes unitários (22)],
      [#check Testes E2E escritos (Maestro)],
      [#check Acessibilidade (rótulos)],
    )
  ],
)

#v(0.4em)
#text(size: 9pt, fill: rgb("#666"))[*Tudo o que não depende da Apple está fechado.* Itens ainda em aberto: SSL pinning (adiado para a fase com aparelho) e os que precisam da conta Apple ativa (abaixo).]

= 6. O que falta — e depende só da Apple

O único impedimento é externo: a *conta Apple Developer está em processamento*. Quando chegar o e-mail _"Welcome to the Apple Developer Program"_, estes passos destravam — e estão todos preparados para serem rápidos:

#table(
  columns: (auto, 1fr, auto),
  stroke: 0.5pt + rgb("#e5e7eb"),
  inset: 7pt,
  fill: (_, row) => if row == 0 { rgb("#f8fafc") } else { white },
  [*Passo*], [*Descrição*], [*Status*],
  [Build no iPhone], [Primeiro build de dispositivo (dev client) — já configurado, falta só a credencial Apple.], blocked,
  [Ativar IAP real], [Conectar o RevenueCat e as chaves — uma troca de código pontual.], blocked,
  [TestFlight], [Distribuição do beta interno para testes.], blocked,
  [Publicação], [Envio para revisão e lançamento na App Store (depois Google Play).], blocked,
)

= 7. Como o trabalho foi validado e registrado

Cada mudança passou por *4 verificações automáticas* antes de ser registrada: checagem de tipos (0 erros), lint (0 erros), 22 testes unitários e empacotamento web. Ao longo de 29 e 30 de maio foram *12 commits* enviados ao GitHub (`github.com/Indexappbr/Index`, branch `main`), do favoritos ao billing.

#text(size: 9pt, fill: rgb("#666"))[Projeto: `C:\dev\index-mobile` · Backend Supabase compartilhado com o app web · Conta Expo/EAS `ferramentas@indexappbr.com`.]

#v(0.6em)
#line(length: 100%, stroke: 0.5pt + rgb("#ddd"))
#align(center)[#text(size: 9pt, fill: rgb("#888"))[Período: 29–30 de maio de 2026 · INDEX Mobile · Migração web → nativo rumo à App Store]]
