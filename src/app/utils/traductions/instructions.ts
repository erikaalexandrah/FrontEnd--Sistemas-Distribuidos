export const INSTRUCTIONS_TRANSLATIONS = {
  // 🇪🇸 Español
  es: {
    title: "INSTRUCCIONES",
    exit: "Salir",
    backHome: "Volver al inicio",
    encrypted: "Canal cifrado",
    play: "Jugar",
    secureNode: "nodo seguro: canal cifrado ∎",
    fullText: [
      `<h1 class='text-2xl md:text-3xl font-title uppercase font-bold tracking-[0.08em] text-transparent bg-clip-text bg-gradient-to-r from-[#25b6f8] via-[#55d9fb] to-[#bbfafe] mb-2'>Instrucciones de Uso y Reglas del Juego</h1>`,
      `<p><strong>Empire of Wagers</strong> es un juego de cartas inspirado en el blackjack clásico, diseñado para partidas cortas y dinámicas donde la estrategia y el azar se combinan.</p>`,
      `<p><strong>Objetivo principal:</strong> acercarte lo más posible al valor de <strong>21</strong> sin superarlo. Si te pasas, pierdes la ronda automáticamente. El oponente también intentará acercarse a 21.</p>`,
      `<p><strong>Sistema de vida:</strong> cada jugador comienza con <strong>60 puntos de vida (HP)</strong>. Cada vez que pierdes una ronda, pierdes una cantidad de vida igual al valor total de tu mano. Por ejemplo: si terminas con 24 puntos, pierdes 24 de vida. Si terminas con 18 y el oponente tiene 20, pierdes 18. En caso de empate, nadie pierde vida.</p>`,
      `<p><strong>Duración estimada:</strong> una partida típica dura entre 3 y 4 rondas, dependiendo de las decisiones del jugador y del uso de las cartas especiales.</p>`,
      `<p><strong>Derrota:</strong> si tu vida llega a 0, pierdes inmediatamente. <strong>Victoria:</strong> ganas cuando todos los oponentes llegan a 0 HP.</p>`,
      `<h2 class='text-lg md:text-xl font-title text-[#9edfff] font-bold mt-2'>Reglas básicas del turno</h2>
      <ol class='list-decimal list-inside space-y-1 text-sm'>
        <li>Cada jugador comienza con dos cartas visibles solo para sí mismo.</li>
        <li>Durante tu turno puedes elegir entre <strong>Pedir</strong> (draw) o <strong>Plantarte</strong> (stand).</li>
        <li>Las decisiones se mantienen en secreto hasta que ambos hayan actuado.</li>
        <li>Una vez que ambos confirman su decisión, se revelan los totales.</li>
        <li>En caso de empate, ninguno pierde vida.</li>
      </ol>`,
      `<h2 class='text-lg md:text-xl font-title text-[#9edfff] font-bold mt-2'>Cartas especiales / Modificadores (6 en total)</h2>
      <ol class='list-decimal list-inside space-y-1 text-sm'>
        <li><strong>Sello de Coronación (SC):</strong> carta de victoria absoluta. Al activarse su efecto, ganas inmediatamente la partida, sin importar los puntos de vida restantes.</li>
        <li><strong>Velo Neutralizador (VN):</strong> crea un bloqueo táctico. Impide que el rival utilice cartas especiales o modificadores durante la siguiente ronda.</li>
        <li><strong>Núcleo de Reposición (NR):</strong> efecto defensivo. Si pierdes una ronda por una diferencia de ≤ 5 puntos, recuperas <strong>5 HP</strong> al final de esa ronda.</li>
        <li><strong>Espejo Letal (EL):</strong> efecto de riesgo compartido. El daño que infliges al rival se duplica, pero si eres tú quien pierde esa ronda, el daño que recibes también se duplica.</li>
        <li><strong>Pulso Crítico (PC):</strong> carta orientada al “21 perfecto”. Si tu total es exactamente <strong>21</strong>, infliges <strong>8 puntos de daño adicional</strong> al oponente.</li>
        <li><strong>Relé de Tolerancia (RT):</strong> red de seguridad contra el exceso. Si tu total supera 21, se ajusta automáticamente a <strong>20</strong> cuando este efecto está activo.</li>
      </ol>`,
      `<h2 class='text-lg md:text-xl font-title text-[#8bb3ff] font-bold mt-2'>Consejos estratégicos</h2>
      <ul class='list-disc list-inside space-y-1 text-sm'>
        <li>Plantarte a tiempo es más valioso que buscar siempre el 21.</li>
        <li>Usa tus cartas especiales en momentos clave: cambiar una sola ronda puede decidir toda la partida.</li>
        <li>Observa los patrones de tus oponentes antes de arriesgarte con modificadores de alto riesgo como Espejo Letal.</li>
      </ul>`,
      `<h2 class='text-lg md:text-xl font-title text-[#9edfff] font-bold mt-2'>Resumen general</h2>
      <ul class='list-inside space-y-1 text-sm'>
        <li>Límite de puntos: 21</li>
        <li>Vida inicial: 60 HP</li>
        <li>Pierdes vida igual al valor de tu mano si pierdes.</li>
        <li>Duración media: 3–4 rondas.</li>
        <li>No se gana vida por victoria directa (solo mediante efectos de cartas como Núcleo de Reposición).</li>
      </ul>
      <p class='mt-2 italic text-sm'>*Empire of Wagers* combina probabilidad, riesgo y cálculo rápido.</p>`
    ]
  },

  // 🇺🇸 English
  en: {
    title: "INSTRUCTIONS",
    exit: "Exit",
    backHome: "Back to Home",
    encrypted: "Encrypted Channel",
    play: "Play",
    secureNode: "secure node: encrypted channel ∎",
    fullText: [
      `<h1 class='text-2xl md:text-3xl font-title uppercase font-bold tracking-[0.08em] text-transparent bg-clip-text bg-gradient-to-r from-[#25b6f8] via-[#55d9fb] to-[#bbfafe] mb-2'>Usage Instructions and Game Rules</h1>`,
      `<p><strong>Empire of Wagers</strong> is a card game inspired by classic blackjack, designed for short, dynamic matches where strategy and luck intertwine.</p>`,
      `<p><strong>Main objective:</strong> get as close as possible to <strong>21</strong> without going over. If you exceed 21, you automatically lose the round. Your opponent is trying to do the same.</p>`,
      `<p><strong>Life system:</strong> each player starts with <strong>60 health points (HP)</strong>. Every time you lose a round, you lose HP equal to the total value of your hand. For example: if you end with 24 points, you lose 24 HP. If you end with 18 and your opponent has 20, you lose 18 HP. In case of a tie, no HP is lost.</p>`,
      `<p><strong>Estimated duration:</strong> a typical match lasts between 3 and 4 rounds, depending on decisions and the use of special cards.</p>`,
      `<p><strong>Defeat:</strong> if your HP reaches 0, you lose immediately. <strong>Victory:</strong> you win when all opponents reach 0 HP.</p>`,
      `<h2 class='text-lg md:text-xl font-title text-[#9edfff] font-bold mt-2'>Basic Turn Rules</h2>
      <ol class='list-decimal list-inside space-y-1 text-sm'>
        <li>Each player starts with two cards visible only to themselves.</li>
        <li>On your turn, you choose to <strong>Hit</strong> (draw) or <strong>Stand</strong>.</li>
        <li>Decisions remain secret until both players have acted.</li>
        <li>Once confirmed, totals are revealed and compared.</li>
        <li>In case of a tie, no HP is lost.</li>
      </ol>`,
      `<h2 class='text-lg md:text-xl font-title text-[#9edfff] font-bold mt-2'>Special Cards / Modifiers (6 total)</h2>
      <ol class='list-decimal list-inside space-y-1 text-sm'>
        <li><strong>Coronation Seal (SC):</strong> an absolute victory card. When its effect is triggered, you immediately win the entire match, regardless of remaining HP.</li>
        <li><strong>Neutralizing Veil (VN):</strong> a tactical lock. Prevents your opponent from using special cards or modifiers in the next round.</li>
        <li><strong>Reposition Core (NR):</strong> defensive support. If you lose a round by ≤ 5 points, you recover <strong>5 HP</strong> at the end of that round.</li>
        <li><strong>Lethal Mirror (EL):</strong> high-risk, high-reward. The damage you deal to your opponent is doubled, but if you lose that round, the damage you receive is also doubled.</li>
        <li><strong>Critical Pulse (PC):</strong> focused on the perfect 21. If your total is exactly <strong>21</strong>, you deal an additional <strong>8 damage</strong> to your opponent.</li>
        <li><strong>Tolerance Relay (RT):</strong> a safety net against going over. If your total exceeds 21, it is automatically adjusted to <strong>20</strong> while this effect is active.</li>
      </ol>`,
      `<h2 class='text-lg md:text-xl font-title text-[#8bb3ff] font-bold mt-2'>Strategic Tips</h2>
      <ul class='list-disc list-inside space-y-1 text-sm'>
        <li>Standing at the right moment is often better than always chasing 21.</li>
        <li>Use your special cards at key turning points; a single round can decide the whole match.</li>
        <li>Pay attention to your opponent’s patterns before using high-risk effects like Lethal Mirror.</li>
      </ul>`,
      `<h2 class='text-lg md:text-xl font-title text-[#9edfff] font-bold mt-2'>General Summary</h2>
      <ul class='list-inside space-y-1 text-sm'>
        <li>Point limit: 21</li>
        <li>Starting HP: 60</li>
        <li>You lose HP equal to your hand’s value if you lose.</li>
        <li>Average match: 3–4 rounds.</li>
        <li>No HP is gained from winning directly (only via card effects such as Reposition Core).</li>
      </ul>
      <p class='mt-2 italic text-sm'>*Empire of Wagers* blends probability, risk, and quick calculation.</p>`
    ]
  },

  // 🇧🇷 Português
  pt: {
    title: "INSTRUÇÕES",
    exit: "Sair",
    backHome: "Voltar ao início",
    encrypted: "Canal criptografado",
    play: "Jogar",
    secureNode: "nó seguro: canal criptografado ∎",
    fullText: [
      `<h1 class='text-2xl md:text-3xl font-title uppercase font-bold tracking-[0.08em] text-transparent bg-clip-text bg-gradient-to-r from-[#25b6f8] via-[#55d9fb] to-[#bbfafe] mb-2'>Instruções de Uso e Regras do Jogo</h1>`,
      `<p><strong>Empire of Wagers</strong> é um jogo de cartas inspirado no blackjack clássico, criado para partidas curtas e dinâmicas onde estratégia e sorte se combinam.</p>`,
      `<p><strong>Objetivo principal:</strong> chegar o mais próximo possível de <strong>21</strong> sem ultrapassar. Se ultrapassar, você perde a rodada automaticamente. O oponente também tentará chegar a 21.</p>`,
      `<p><strong>Sistema de vida:</strong> cada jogador começa com <strong>60 pontos de vida (HP)</strong>. Sempre que você perde uma rodada, perde uma quantidade de HP igual ao valor total da sua mão. Exemplo: se terminar com 24 pontos, perde 24 HP. Se terminar com 18 e o oponente tiver 20, você perde 18 HP. Em caso de empate, ninguém perde HP.</p>`,
      `<p><strong>Duração estimada:</strong> uma partida típica dura entre 3 e 4 rodadas, dependendo das decisões e do uso das cartas especiais.</p>`,
      `<p><strong>Derrota:</strong> se seu HP chegar a 0, você perde imediatamente. <strong>Vitória:</strong> vence quando todos os oponentes chegam a 0 HP.</p>`,
      `<h2 class='text-lg md:text-xl font-title text-[#9edfff] font-bold mt-2'>Regras básicas do turno</h2>
      <ol class='list-decimal list-inside space-y-1 text-sm'>
        <li>Cada jogador começa com duas cartas visíveis apenas para si.</li>
        <li>Durante o turno, escolha entre <strong>Pedir</strong> (draw) ou <strong>Parar</strong> (stand).</li>
        <li>As decisões permanecem secretas até que ambos ajam.</li>
        <li>Depois, os totais são revelados e comparados.</li>
        <li>Em caso de empate, ninguém perde HP.</li>
      </ol>`,
      `<h2 class='text-lg md:text-xl font-title text-[#9edfff] font-bold mt-2'>Cartas especiais / Modificadores (6 no total)</h2>
      <ol class='list-decimal list-inside space-y-1 text-sm'>
        <li><strong>Selo de Coroação (SC):</strong> carta de vitória absoluta. Quando seu efeito é ativado, você vence a partida imediatamente, independentemente do HP restante.</li>
        <li><strong>Véu Neutralizador (VN):</strong> bloqueio tático. Impede que o oponente use cartas especiais ou modificadores na próxima rodada.</li>
        <li><strong>Núcleo de Reposição (NR):</strong> efeito defensivo. Se você perder uma rodada por uma diferença de ≤ 5 pontos, recupera <strong>5 HP</strong> ao final dessa rodada.</li>
        <li><strong>Espelho Letal (EL):</strong> alto risco, alta recompensa. O dano que você causa ao oponente é dobrado, mas se perder a rodada, o dano que você recebe também é dobrado.</li>
        <li><strong>Pulso Crítico (PC):</strong> focado no 21 perfeito. Se o seu total for exatamente <strong>21</strong>, você causa <strong>8 pontos de dano extra</strong> ao oponente.</li>
        <li><strong>Relé de Tolerância (RT):</strong> rede de segurança contra o excesso. Se o seu total passar de 21, ele é ajustado automaticamente para <strong>20</strong> enquanto este efeito estiver ativo.</li>
      </ol>`,
      `<h2 class='text-lg md:text-xl font-title text-[#8bb3ff] font-bold mt-2'>Dicas Estratégicas</h2>
      <ul class='list-disc list-inside space-y-1 text-sm'>
        <li>Parar no momento certo é melhor do que buscar 21 a qualquer custo.</li>
        <li>Use suas cartas especiais em momentos decisivos; uma única rodada pode definir a partida.</li>
        <li>Observe o padrão de jogo dos oponentes antes de arriscar efeitos de alto risco como Espelho Letal.</li>
      </ul>`,
      `<h2 class='text-lg md:text-xl font-title text-[#9edfff] font-bold mt-2'>Resumo geral</h2>
      <ul class='list-inside space-y-1 text-sm'>
        <li>Limite de pontos: 21</li>
        <li>Vida inicial: 60 HP</li>
        <li>Perde HP igual ao valor da mão se perder.</li>
        <li>Duração média: 3–4 rodadas.</li>
        <li>Não ganha HP por vitória direta (apenas por efeitos de cartas como Núcleo de Reposição).</li>
      </ul>
      <p class='mt-2 italic text-sm'>*Empire of Wagers* combina probabilidade, risco e cálculo rápido.</p>`
    ]
  }
};
