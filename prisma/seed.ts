import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const course = await prisma.course.create({
    data: {
      title: 'Movimento das peças',
      image: 'https://adrenaline.com.br/uploads/chamadas/chess_alphazero_chamada.jpg',
      description:
        'Bem-vindo ao curso de movimentos de peças de xadrez. Neste curso, você aprenderá como mover cada uma das seis peças do xadrez: peão, torre, bispo, cavalo, dama e rei. Ao final do curso, você terá uma compreensão completa dos movimentos possíveis de cada peça.',
      lessons: {
        create: [
          {
            title: 'Movimento da torre',
            order: 1,
            piece: 'Rook',
            position: { d4: 'wR' },
            description:
              'A torre é uma das peças mais poderosas no xadrez. Ela pode se mover para frente, para trás e para os lados, em linha reta, desde que não haja outra peça bloqueando o caminho. No tabuleiro, a torre pode se mover quantas casas quiser, em qualquer direção permitida, desde que siga em linha reta. Para se mover com a torre, selecione-a e clique em uma das casas possíveis para ela, ou arraste-a para a casa desejada. Passe o mouse sobre a torre para ver as casas possíveis que ela pode se mover.',
          },
          {
            title: 'Movimento do bispo',
            order: 2,
            piece: 'Bishop',
            position: { d4: 'wB' },
            description:
              'O bispo é outra peça poderosa no xadrez. Ele pode se mover na diagonal, quantas casas quiser, desde que não haja outra peça bloqueando o caminho. No tabuleiro, o bispo pode se mover apenas em sua cor original de partida, ou seja, se ele começou no quadrado preto, ele só pode se mover em diagonais pretas. Para se mover com o bispo, selecione-o e clique em uma das casas possíveis para ele, ou arraste-o para a casa desejada. Passe o mouse sobre o bispo para ver as casas possíveis que ele pode se mover.',
          },
          {
            title: 'Movimento da dama',
            order: 3,
            piece: 'Queen',
            position: { d4: 'bQ' },
            description:
              'A dama é a peça mais poderosa no xadrez. Ela pode se mover para frente, para trás, para os lados e na diagonal, quantas casas quiser, desde que não haja outra peça bloqueando o caminho. No tabuleiro, a dama pode se mover em qualquer direção permitida, seguindo em linha reta ou na diagonal. Para se mover com a dama, selecione-a e clique em uma das casas possíveis para ela, ou arraste-a para a casa desejada. Passe o mouse sobre a dama para ver as casas possíveis que ela pode se mover.',
          },
          {
            title: 'Movimento do cavalo',
            order: 4,
            piece: 'Knight',
            position: { d4: 'bN' },
            description:
              'O cavalo é uma peça única no xadrez, que se move em L. Ele pode pular outras peças e se mover duas casas em uma direção e uma casa perpendicular a ela, em qualquer direção. Por exemplo, ele pode se mover duas casas para frente e uma para o lado, ou duas casas para o lado e uma para frente. Para se mover com o cavalo, selecione-o e clique em uma das casas possíveis para ele, ou arraste-o para a casa desejada. Passe o mouse sobre o cavalo para ver as casas possíveis que ele pode se mover.',
          },
          {
            title: 'Movimento do rei',
            order: 5,
            piece: 'King',
            position: { d2: 'bK' },
            description:
              'O rei é a peça mais importante no xadrez, pois a partida é perdida se ele for capturado. Ele pode se mover apenas uma casa por vez, em qualquer direção permitida: para frente, para trás, para os lados ou na diagonal. No tabuleiro, o rei é uma peça fraca, mas essencial. Para se mover com o rei, selecione-o e clique em uma das casas possíveis para ele, ou arraste-o para a casa desejada. Passe o mouse sobre o rei para ver as casas possíveis que ele pode se mover.',
          },
          {
            title: 'Movimento do peão',
            order: 6,
            piece: 'Pawn',
            position: { d2: 'wP' },
            description:
              'O peão é uma peça única no xadrez, com um movimento um pouco diferente das outras. Ele se move apenas para frente, uma casa de cada vez, mas na primeira jogada de cada peão, ele pode se mover duas casas. Ele captura outras peças movendo-se diagonalmente, uma casa na diagonal em direção ao adversário. No entanto, ele não pode capturar peças na mesma fileira, apenas nas diagonais (veremos mais detalhes nos treinos de captura). Além disso, quando um peão alcança a última fileira do tabuleiro adversário, ele pode ser promovido a qualquer outra peça, exceto o rei. Para se mover com o peão, selecione-o e clique em uma das casas possíveis para ele, ou arraste-o para a casa desejada. Passe o mouse sobre o peão para ver as casas possíveis que ele pode se mover.',
          },
        ],
      },
    },
  });
  console.log(`Course created with ID: ${course.id}`);

  const course2 = await prisma.course.create({
    data: {
      title: 'Captura de peças',
      image: 'https://adrenaline.com.br/uploads/chamadas/chess_alphazero_chamada.jpg',
      description:
        'Bem-vindo ao curso de captura de peças de xadrez. Neste curso, você aprenderá como capturar peças com cada uma das seis peças do xadrez: peão, torre, bispo, cavalo, dama e rei. Ao final do curso, você terá uma compreensão completa de como funciona a captura de peças no xadrez.',
      lessons: {
        create: [
          {
            title: 'Captura com a Torre',
            order: 1,
            piece: 'Rook',
            position: { d4: 'wR', e4: 'bN' },
            description:
              'A torre é uma peça muito poderosa no xadrez, pois se move na vertical ou horizontal sem restrições quanto ao número de casas. Quando há uma peça inimiga na casa final do movimento, a torre pode capturá-la. É importante lembrar que a torre só pode se mover em linha reta, ou seja, não pode capturar uma peça que esteja diagonalmente adjacente.',
          },
          {
            title: 'Captura com o Bispo',
            order: 2,
            piece: 'Bishop',
            position: { d4: 'wB', f6: 'bQ' },
            description:
              'O bispo é uma peça muito versátil, pois se move na diagonal, também sem restrições quanto ao número de casas. Quando há uma peça inimiga na casa final do movimento, o bispo pode capturá-la. É importante lembrar que o bispo só pode se mover em diagonal, ou seja, não pode capturar uma peça que esteja em uma casa vertical ou horizontalmente adjacente.',
          },
          {
            title: 'Captura com a Dama',
            order: 3,
            piece: 'Queen',
            position: { d4: 'wQ', e4: 'bP' },
            description:
              'A dama é a peça mais poderosa do xadrez, pois combina os movimentos da torre e do bispo, podendo se mover em qualquer direção, também sem restrições quanto ao número de casas. Quando há uma peça inimiga na casa final do movimento, a dama pode capturá-la.',
          },
          {
            title: 'Captura com o Cavalo',
            order: 4,
            piece: 'Knight',
            position: { d4: 'wN', f5: 'bR' },
            description:
              'O cavalo é uma peça muito peculiar, pois se move em L, podendo pular outras peças no tabuleiro. Quando há uma peça inimiga na casa final do movimento, o cavalo pode capturá-la. É importante lembrar que o cavalo só pode capturar peças que estejam em seu movimento em L.',
          },
          {
            title: 'Captura com o Rei',
            order: 5,
            piece: 'King',
            position: { d2: 'wK', e2: 'bP' },
            description:
              'O rei é a peça mais importante do xadrez, pois sua captura significa o fim do jogo. Ele só pode se mover uma casa em qualquer direção, mas não pode se mover para uma casa que esteja sendo atacada pelo adversário. O rei pode capturar as peças inimigas na diagonal, mas não pode se colocar em uma posição de risco. É importante citar que o rei não pode se colocar em uma posição em que fique ameaçado pelo adversário. Veremos mais nas aulas de peças atacadas.',
          },
          {
            title: 'Captura com o Peão',
            order: 6,
            piece: 'Pawn',
            position: { d5: 'wP', e6: 'bR' },
            description:
              'O peão é a peça mais fraca do xadrez, mas também a mais numerosa. Ele só pode se mover para frente, uma casa de cada vez, exceto no seu primeiro movimento, quando pode se mover duas casas. O peão captura as peças inimigas na diagonal, mas não pode se mover para a frente se houver uma peça bloqueando o caminho. É importante citar que o peão faz capturas de forma diferente das outras peças, só podendo capturar peças que estejam em sua diagonal, além disso existe uma regra especial chamada "en-passant" que veremos na próxima aula.',
          },
          {
            title: 'O que é En Passant no Xadrez',
            order: 7,
            piece: 'Chess',
            position: {
              fen: 'rnbqkbnr/pppppp1p/6p1/4P3/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
            },
            moves: {
              black: 'd7d5',
              white: 'e5d6',
            },
            userColor: 'w',
            description:
              'O En Passant é uma jogada especial no xadrez que permite a um peão capturar outro peão adversário que avançou duas casas em seu primeiro movimento, como se este tivesse avançado apenas uma casa. Este movimento só pode ser realizado imediatamente após o peão adversário ter avançado duas casas, caso contrário a captura en passant não é mais possível. Este movimento é considerado uma captura normal, ou seja, a posição do peão capturador e do peão capturado são trocadas.',
          },
        ],
      },
    },
  });
  console.log(`Course created with ID: ${course2.id}`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
