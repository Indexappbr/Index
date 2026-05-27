#set document(title: "INDEX Mobile — Relatório de Progresso", author: "Equipe INDEX")
#set page(
  paper: "a4",
  margin: (x: 2cm, y: 2cm),
  numbering: "1",
  footer: context [
    #set text(size: 8pt, fill: rgb("#888"))
    INDEX Mobile · Relatório de Progresso · 26/05/2026
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

#let ok = box(fill: rgb("#dcfce7"), inset: (x: 5pt, y: 2pt), radius: 3pt)[#text(fill: rgb("#15803d"), weight: "bold", size: 8.5pt)[CONCLUÍDO]]
#let doing = box(fill: rgb("#fef9c3"), inset: (x: 5pt, y: 2pt), radius: 3pt)[#text(fill: rgb("#a16207"), weight: "bold", size: 8.5pt)[EM ANDAMENTO]]
#let blocked = box(fill: rgb("#fee2e2"), inset: (x: 5pt, y: 2pt), radius: 3pt)[#text(fill: rgb("#b91c1c"), weight: "bold", size: 8.5pt)[BLOQUEADO]]
#let pend = box(fill: rgb("#f1f5f9"), inset: (x: 5pt, y: 2pt), radius: 3pt)[#text(fill: rgb("#475569"), weight: "bold", size: 8.5pt)[PENDENTE]]

#align(center)[
  #text(size: 22pt, fill: brand, weight: "bold")[INDEX Mobile]
  #linebreak()
  #text(size: 14pt)[Relatório de Progresso da Construção]
  #linebreak()
  #v(0.3em)
  #text(size: 10pt, fill: rgb("#666"))[App nativo (iOS/Android) · Migração do app web · 26 de maio de 2026]
]

#line(length: 100%, stroke: 0.5pt + rgb("#ddd"))

= Sumário executivo

Estamos construindo o aplicativo *mobile nativo* da INDEX (plataforma de audiolivros católicos), migrando o app web atual para *React Native*, com o objetivo de publicar na *App Store* (e, em seguida, na Google Play). O backend (Supabase + Cloudflare R2) é o *mesmo* do app web — nenhuma reescrita de servidor é necessária.

Até o momento, *6,5 dos 16 marcos* do roadmap estão concluídos. O app já tem, em código e validado por verificação de tipos e empacotamento: login completo, navegação do catálogo, player de áudio com reprodução em segundo plano e tela de bloqueio, e busca. O único impedimento ativo é externo: a *conta Apple Developer está com status pendente* (em processamento pela Apple), o que trava temporariamente a geração do build de iOS.

= Onde está tudo

#table(
  columns: (auto, 1fr),
  stroke: 0.5pt + rgb("#e5e7eb"),
  inset: 7pt,
  [*Projeto mobile*], [`C:\dev\index-mobile` (fora do OneDrive, de propósito)],
  [*GitHub*], [`github.com/Indexappbr/Index` (branch `main`)],
  [*App web (referência)*], [`C:\dev\index-app-v2-main`],
  [*Backend Supabase*], [projeto `abjtbqgdjrfejodfhway` (mesmo do web)],
  [*Conta Expo (EAS)*], [`ferramentas@indexappbr.com` · org `index.app`],
)

= Stack técnica escolhida

#table(
  columns: (auto, 1fr),
  stroke: 0.5pt + rgb("#e5e7eb"),
  inset: 7pt,
  [*Framework*], [Expo SDK 56 + Dev Client (React Native 0.85, React 19.2)],
  [*Navegação*], [Expo Router v6 (file-based, rotas com guarda de sessão)],
  [*Linguagem*], [TypeScript 6 (modo estrito)],
  [*UI*], [NativeWind v4 (Tailwind no React Native) + componentes próprios],
  [*Estado*], [TanStack Query (servidor) · Zustand (player) · MMKV (local)],
  [*Áudio*], [`expo-audio` (background + lock screen)],
  [*Backend*], [Supabase (Auth + DB + Edge Functions) · Cloudflare R2 (áudio)],
)

#block(fill: rgb("#f8fafc"), inset: 9pt, radius: 4pt, width: 100%)[
  *Decisão de engenharia (áudio):* o plano original previa `react-native-track-player` (RNTP), mas a versão gratuita (v4) não é compatível com a Nova Arquitetura do React Native — que o nosso stack usa e que o MMKV v4 exige. A v5 do RNTP virou paga (licença comercial). Optamos por `expo-audio` (oficial do Expo, gratuito, compatível com a Nova Arquitetura), que atende o requisito-chave: *reprodução em segundo plano e controles na tela de bloqueio*.
]

= Roadmap até a App Store

#table(
  columns: (auto, 1fr, auto),
  stroke: 0.5pt + rgb("#e5e7eb"),
  inset: (x: 7pt, y: 5pt),
  align: (center + horizon, left + horizon, center + horizon),
  [*Nº*], [*Marco*], [*Status*],
  [1], [Apple Developer Program (pago)], ok,
  [2], [Repositório + stack mobile montada], ok,
  [3], [Autenticação (Supabase + Google + 2 fatores)], ok,
  [4], [Conexão com o Supabase real (.env)], ok,
  [5], [Tipos do banco de dados (TypeScript)], ok,
  [6], [Primeiro build no iPhone (EAS)], blocked,
  [7], [Player de áudio nativo], ok,
  [8], [Telas (Home, Biblioteca, Livro, Estante, Conta…)], doing,
  [9], [Tela de verificação em 2 fatores], pend,
  [10], [Notificações push (iOS/Android)], pend,
  [11], [Compras no app (IAP / RevenueCat)], pend,
  [12], [Modo offline (downloads criptografados)], pend,
  [13], [Reforço de segurança + Privacy Manifest], pend,
  [14], [Monitoramento (Sentry + analytics)], pend,
  [15], [Automação de build e publicação (CI/CD)], pend,
  [16], [Publicação na App Store (até aprovação)], pend,
)

= O que já foi construído

== Autenticação #ok
Login e cadastro por e-mail/senha, recuperação de senha e *login com Google*. Sessão guardada de forma rápida e segura (MMKV + armazenamento seguro do sistema). As rotas têm uma *guarda*: quem não está logado vê só as telas de login; quem está logado vai direto para o app.

== Catálogo de conteúdo #ok
A *Home* lista os livros reais vindos do backend (com capas), e a tela de *detalhe do livro* mostra a descrição e a lista de capítulos. Listas de alto desempenho (FlashList) e carregamento de imagens otimizado.

== Player de áudio #ok
Toca os capítulos a partir de URLs assinadas (seguras, com renovação automática antes de expirar). Inclui: tocar/pausar, avançar/retroceder, próximo/anterior, *avanço automático* ao fim do capítulo, *retomar de onde parou* (salva a posição a cada 30 segundos), *reprodução em segundo plano* e *controles na tela de bloqueio* do celular.

== Biblioteca e busca #doing
Aba *Biblioteca* com campo de busca que consulta a função de busca do backend (mesma do web), com resultados em tempo real.

#block(fill: rgb("#fff7ed"), inset: 9pt, radius: 4pt, width: 100%)[
  *Importante:* tudo acima passa na verificação de tipos e no empacotamento, mas *ainda não foi testado em um aparelho real*, pois isso depende do build de iOS — que está bloqueado pela pendência da conta Apple. A validação definitiva acontece quando rodarmos o app no iPhone.
]

= Impedimento atual: conta Apple Developer pendente #blocked

O login na Apple e a verificação em 2 fatores funcionam, mas a Apple ainda *não ativou* a associação de "time de desenvolvedor" na conta `ferramentas@indexappbr.com` — o status está *pendente / em processamento*. Sem isso, não é possível gerar as credenciais nem o build de iOS.

*Ação necessária (do lado da Apple, sem precisar de Mac):* aguardar o e-mail "Welcome to the Apple Developer Program". Acompanhar o status em `developer.apple.com/account`. Assim que ativar, o restante do build (registrar o iPhone e gerar o app) é rápido — já está tudo preparado no projeto.

= Como retomar e evoluir a construção

Para continuar de onde paramos, use a skill `/index-mobile` (criada junto com este relatório). Ela orienta o assistente a carregar o contexto completo e seguir o próximo passo do roadmap.

*Convenções do projeto:*
- A cada mudança concluída: verificação de tipos (`npx tsc --noEmit`) e empacotamento (`npx expo export --platform web`), depois um commit local e push para o GitHub.
- Build e publicação rodam na nuvem (EAS) — *não é necessário Mac*.
- Comandos interativos do EAS (login Apple, registro de aparelho) devem ser rodados num *terminal de verdade* (PowerShell), não dentro do chat.

*Próximos passos sugeridos (sem depender da Apple):* concluir as telas restantes (Estante/favoritos, Bíblia, Conta), tela de 2 fatores e notificações. Os passos que dependem de contas externas (compras no app, publicação) entram quando a conta Apple ativar.
