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
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
