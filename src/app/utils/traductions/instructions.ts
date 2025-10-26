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
      `<p><strong>Duración estimada:</strong> una partida típica dura entre 3 y 4 rondas, dependiendo de las decisiones del jugador y del uso de los modificadores.</p>`,
      `<p><strong>Derrota:</strong> si tu vida llega a 0, pierdes inmediatamente. <strong>Victoria:</strong> ganas cuando todos los oponentes llegan a 0 HP.</p>`,
      `<h2 class='text-lg md:text-xl font-title text-[#9edfff] font-bold mt-2'>Reglas básicas del turno</h2>
      <ol class='list-decimal list-inside space-y-1 text-sm'>
        <li>Cada jugador comienza con dos cartas visibles solo para sí mismo.</li>
        <li>Durante tu turno puedes elegir entre <strong>Pedir</strong> (draw) o <strong>Plantarte</strong> (stand).</li>
        <li>Las decisiones se mantienen en secreto hasta que ambos hayan actuado.</li>
        <li>Una vez que ambos confirman su decisión, se revelan los totales.</li>
        <li>En caso de empate, ninguno pierde vida.</li>
      </ol>`,
      `<h2 class='text-lg md:text-xl font-title text-[#9edfff] font-bold mt-2'>Modificadores del juego (10 en total)</h2>
      <ol class='list-decimal list-inside space-y-1 text-sm'>
        <li><strong>Suerte del Novato:</strong> una vez por partida, si tu total supera 21, se ajusta automáticamente a 20.</li>
        <li><strong>Robo Preciso:</strong> la siguiente carta tendrá valor fijo entre 2 y 6.</li>
        <li><strong>Escudo de Hierro:</strong> reduce el daño recibido en un 50% la próxima derrota.</li>
        <li><strong>Doble Riesgo:</strong> duplica tu daño potencial, pero si pierdes también se duplica.</li>
        <li><strong>Golpe Crítico:</strong> si logras exactamente 21, infliges 8 de daño adicional.</li>
        <li><strong>Reinicio de Mano:</strong> puedes cambiar todas tus cartas una vez por partida.</li>
        <li><strong>Vista Parcial:</strong> permite ver una carta aleatoria del oponente una vez por ronda.</li>
        <li><strong>Recuperación:</strong> si pierdes por ≤5 puntos, recuperas 5 HP.</li>
        <li><strong>Bloqueo de Efecto:</strong> impide que el oponente use su modificador siguiente ronda.</li>
        <li><strong>Última Apuesta:</strong> si tienes ≤15 HP, inicias cada mano con un As extra.</li>
      </ol>`,
      `<h2 class='text-lg md:text-xl font-title text-[#8bb3ff] font-bold mt-2'>Consejos estratégicos</h2>
      <ul class='list-disc list-inside space-y-1 text-sm'>
        <li>Plantarte a tiempo es más valioso que buscar siempre el 21.</li>
        <li>Usa tus modificadores estratégicamente.</li>
        <li>Observa los patrones de tus oponentes antes de arriesgarte.</li>
      </ul>`,
      `<h2 class='text-lg md:text-xl font-title text-[#9edfff] font-bold mt-2'>Resumen general</h2>
      <ul class='list-inside space-y-1 text-sm'>
        <li>Límite de puntos: 21</li>
        <li>Vida inicial: 60 HP</li>
        <li>Pierdes vida igual al valor de tu mano si pierdes.</li>
        <li>Duración media: 3–4 rondas.</li>
        <li>No se gana vida por victoria directa (solo modificadores).</li>
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
      `<p><strong>Empire of Wagers</strong> is a card game inspired by classic blackjack, designed for short and dynamic matches where strategy and luck intertwine.</p>`,
      `<p><strong>Main objective:</strong> get as close as possible to <strong>21</strong> without going over. If you exceed it, you lose the round automatically. The opponent will also try to reach 21.</p>`,
      `<p><strong>Life system:</strong> each player starts with <strong>60 health points (HP)</strong>. Every time you lose a round, you lose life equal to the total value of your hand. For example: if you end with 24 points, you lose 24 HP. If you end with 18 and the opponent has 20, you lose 18 HP. In case of a tie, no one loses life.</p>`,
      `<p><strong>Estimated duration:</strong> a typical match lasts between 3 and 4 rounds, depending on decisions and modifier usage.</p>`,
      `<p><strong>Defeat:</strong> if your HP reaches 0, you lose immediately. <strong>Victory:</strong> you win when all opponents reach 0 HP.</p>`,
      `<h2 class='text-lg md:text-xl font-title text-[#9edfff] font-bold mt-2'>Basic Turn Rules</h2>
      <ol class='list-decimal list-inside space-y-1 text-sm'>
        <li>Each player starts with two cards visible only to themselves.</li>
        <li>During your turn, choose to <strong>Hit</strong> (draw) or <strong>Stand</strong>.</li>
        <li>Decisions remain secret until both players have acted.</li>
        <li>Once confirmed, totals are revealed and compared.</li>
        <li>In case of a tie, no HP is lost.</li>
      </ol>`,
      `<h2 class='text-lg md:text-xl font-title text-[#9edfff] font-bold mt-2'>Game Modifiers (10 total)</h2>
      <ol class='list-decimal list-inside space-y-1 text-sm'>
        <li><strong>Beginner’s Luck:</strong> once per match, if your total exceeds 21, it automatically adjusts to 20.</li>
        <li><strong>Precise Draw:</strong> the next card you draw will have a fixed value between 2 and 6.</li>
        <li><strong>Iron Shield:</strong> reduces incoming damage by 50% on your next defeat.</li>
        <li><strong>Double Risk:</strong> doubles potential damage; if you lose, the damage is also doubled.</li>
        <li><strong>Critical Hit:</strong> if you reach exactly 21, you deal 8 extra damage to your opponent.</li>
        <li><strong>Hand Reset:</strong> discard all your cards and draw a new hand once per match.</li>
        <li><strong>Partial Vision:</strong> view one random opponent card once per round.</li>
        <li><strong>Recovery:</strong> if you lose by 5 points or less, recover 5 HP at the end of the round.</li>
        <li><strong>Effect Block:</strong> prevents the opponent from using a modifier in the next round.</li>
        <li><strong>Last Bet:</strong> when your HP ≤ 15, start each hand with an extra Ace.</li>
      </ol>`,
      `<h2 class='text-lg md:text-xl font-title text-[#8bb3ff] font-bold mt-2'>Strategic Tips</h2>
      <ul class='list-disc list-inside space-y-1 text-sm'>
        <li>Standing at the right moment is better than always chasing 21.</li>
        <li>Use modifiers strategically to change the outcome.</li>
        <li>Observe opponent patterns before taking risks.</li>
      </ul>`,
      `<h2 class='text-lg md:text-xl font-title text-[#9edfff] font-bold mt-2'>General Summary</h2>
      <ul class='list-inside space-y-1 text-sm'>
        <li>Point limit: 21</li>
        <li>Starting HP: 60</li>
        <li>You lose HP equal to your hand’s value if you lose.</li>
        <li>Average match: 3–4 rounds.</li>
        <li>No HP gained by winning directly (only via modifiers).</li>
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
      `<p><strong>Sistema de vida:</strong> cada jogador começa com <strong>60 pontos de vida (HP)</strong>. Sempre que você perde uma rodada, perde uma quantidade de HP igual ao valor total da sua mão. Exemplo: se terminar com 24 pontos, perde 24 HP. Se terminar com 18 e o oponente tiver 20, perde 18. Em caso de empate, ninguém perde HP.</p>`,
      `<p><strong>Duração estimada:</strong> uma partida típica dura entre 3 e 4 rodadas, dependendo das decisões e do uso dos modificadores.</p>`,
      `<p><strong>Derrota:</strong> se seu HP chegar a 0, você perde imediatamente. <strong>Vitória:</strong> vence quando todos os oponentes chegam a 0 HP.</p>`,
      `<h2 class='text-lg md:text-xl font-title text-[#9edfff] font-bold mt-2'>Regras básicas do turno</h2>
      <ol class='list-decimal list-inside space-y-1 text-sm'>
        <li>Cada jogador começa com duas cartas visíveis apenas para si.</li>
        <li>Durante o turno, escolha entre <strong>Pedir</strong> (draw) ou <strong>Parar</strong> (stand).</li>
        <li>As decisões permanecem secretas até que ambos ajam.</li>
        <li>Depois, os totais são revelados e comparados.</li>
        <li>Em caso de empate, ninguém perde HP.</li>
      </ol>`,
      `<h2 class='text-lg md:text-xl font-title text-[#9edfff] font-bold mt-2'>Modificadores do jogo (10 no total)</h2>
      <ol class='list-decimal list-inside space-y-1 text-sm'>
        <li><strong>Sorte do Novato:</strong> uma vez por partida, se ultrapassar 21, ajusta-se automaticamente para 20.</li>
        <li><strong>Roubo Preciso:</strong> a próxima carta terá valor fixo entre 2 e 6.</li>
        <li><strong>Escudo de Ferro:</strong> reduz o dano recebido em 50% na próxima derrota.</li>
        <li><strong>Risco Duplo:</strong> dobra o dano potencial; se perder, o dano também é dobrado.</li>
        <li><strong>Golpe Crítico:</strong> se alcançar exatamente 21, causa 8 de dano extra.</li>
        <li><strong>Reinício de Mão:</strong> pode trocar todas as cartas uma vez por partida.</li>
        <li><strong>Visão Parcial:</strong> veja uma carta aleatória do oponente uma vez por rodada.</li>
        <li><strong>Recuperação:</strong> se perder por até 5 pontos, recupere 5 HP no final da rodada.</li>
        <li><strong>Bloqueio de Efeito:</strong> impede o oponente de usar um modificador na próxima rodada.</li>
        <li><strong>Última Aposta:</strong> se tiver ≤15 HP, começa cada mão com um Ás extra.</li>
      </ol>`,
      `<h2 class='text-lg md:text-xl font-title text-[#8bb3ff] font-bold mt-2'>Dicas Estratégicas</h2>
      <ul class='list-disc list-inside space-y-1 text-sm'>
        <li>Parar no momento certo é melhor do que sempre buscar 21.</li>
        <li>Use modificadores com inteligência.</li>
        <li>Observe o padrão de seus oponentes antes de arriscar.</li>
      </ul>`,
      `<h2 class='text-lg md:text-xl font-title text-[#9edfff] font-bold mt-2'>Resumo geral</h2>
      <ul class='list-inside space-y-1 text-sm'>
        <li>Limite de pontos: 21</li>
        <li>Vida inicial: 60 HP</li>
        <li>Perde HP igual ao valor da mão se perder.</li>
        <li>Duração média: 3–4 rodadas.</li>
        <li>Não ganha HP por vitória direta (apenas com modificadores).</li>
      </ul>
      <p class='mt-2 italic text-sm'>*Empire of Wagers* combina probabilidade, risco e cálculo rápido.</p>`
    ]
  }
};
