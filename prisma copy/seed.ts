import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'seed@seed.com',
      password: 'seed',
      username: 'Seed',
      image: 'https://mundoconectado.com.br/uploads/2022/05/25/25658/cacto.jpg',
    },
  });

  const course = await prisma.course.create({
    data: {
      title: 'Movimento das Peças',
      description:
        'Bem-vindo ao curso de movimentos de peças de xadrez. Neste curso, você aprenderá como mover cada uma das seis peças do xadrez: peão, torre, bispo, cavalo, dama e rei. Ao final do curso, você terá uma compreensão completa dos movimentos possíveis de cada peça.',
      image: 'https://adrenaline.com.br/uploads/chamadas/chess_alphazero_chamada.jpg',
      category: 'Tutorial',
      creatorId: user.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Movimento da Torre',
      description:
        'A torre é uma das peças mais poderosas no xadrez. Ela pode se mover para frente, para trás e para os lados, em linha reta, desde que não haja outra peça bloqueando o caminho. No tabuleiro, a torre pode se mover quantas casas quiser, em qualquer direção permitida, desde que siga em linha reta. Para se mover com a torre, arraste-a para a casa desejada. Passe o mouse sobre a torre para ver as casas possíveis que ela pode se mover.',
      courseId: course.id,
      position: '6k1/5p2/6p1/8/4R3/8/8/4K3 b - - 0 1',
      moves: ['g8g7', 'e4c4', 'g6g5', 'c4c8'],
      userColor: 'w',
      messages: {
        g8g7: 'Mova sua torre para c4!',
        e4c4: 'Muito bem!',
        g6g5: 'Agora mova sua torre para c8!',
        c4c8: 'Parabéns, você dominou o movimento da torre!',
      },
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Movimento do Bispo',
      description:
        'O bispo é uma peça poderosa que pode se mover em uma linha diagonal por qualquer número de casas. Cada jogador tem dois bispos: um nas casas brancas e outro nas casas pretas. Os bispos só podem se mover em casas de sua própria cor.',
      courseId: course.id,
      position: '5k2/6b1/8/4p3/8/8/5PB1/4K3 b - - 0 1',
      moves: ['g7f6', 'g2c6', 'f6e7', 'c6a4'],
      userColor: 'w',
      messages: {
        g7f6: 'Mova seu bispo para c6!',
        g2c6: 'Muito bem!',
        f6e7: 'Agora mova seu bispo até a4!',
        c6a4: 'Parabéns, você dominou o movimento do Bispo!',
      },
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Movimento do Cavalo',
      description:
        'O cavalo é uma das peças mais curiosas no xadrez. Ele se move em L, ou seja, duas casas em uma direção e uma casa em outra direção perpendicular. Essa é a única peça do xadrez que pode pular sobre outras peças, o que a torna muito útil para atacar oponentes ou para fugir de situações difíceis. Para se mover com o cavalo, arraste-o para a casa desejada. Passe o mouse sobre o cavalo para ver as casas possíveis que ele pode se mover.',
      courseId: course.id,
      position: '6kn/6pp/8/8/8/8/PPP5/KN6 w - - 0 1',
      moves: ['b1c3', 'h8f7', 'c3d5', 'f7e5'],
      userColor: 'b',
      messages: {
        b1c3: 'Mova seu cavalo para f7!',
        h8f7: 'Muito bem!',
        c3d5: 'Agora mova seu cavalo até e5!',
        f7e5: 'Parabéns, você dominou o movimento do Cavalo!',
      },
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Movimento da Dama',
      description:
        'A Dama é a peça mais poderosa no xadrez. Ela pode se mover em linha reta, tanto na horizontal quanto na vertical, bem como nas diagonais, desde que não haja outras peças bloqueando o caminho. Para se mover com a Dama, arraste-a para a casa desejada. Passe o mouse sobre a Dama para ver as casas possíveis que ela pode se mover.',
      courseId: course.id,
      position: '7k/8/5q2/8/8/PP6/1P6/K7 w - - 0 1',
      moves: ['a1a2', 'f6f2', 'a3a4', 'f2b6'],
      userColor: 'b',
      messages: {
        a1a2: 'Mova sua dama para f2!',
        f6f2: 'Muito bem!',
        a3a4: 'Agora mova sua dama até b6!',
        f2b6: 'Parabéns, você dominou o movimento da Dama!',
      },
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Movimento do Rei',
      description:
        'O rei é a peça mais importante do xadrez, e o objetivo do jogo é dar xeque-mate no rei adversário. O rei pode se mover para qualquer casa adjacente (diagonal, vertical ou horizontal), desde que não esteja em xeque ou não vá colocar-se em xeque (Veremos mais nas aulas sobre xeque e ataque). No tabuleiro, o rei é representado pela peça com uma cruz no topo. Para se mover com o rei, arraste-o para a casa desejada. Passe o mouse sobre o rei para ver as casas possíveis que ele pode se mover.',

      courseId: course.id,
      position: '8/pp2k3/8/8/8/8/PP2K3/8 b - - 0 1',
      moves: ['e7d6', 'e2d3', 'd6d7', 'd3d4'],
      userColor: 'w',
      messages: {
        e7d6: 'Mova seu rei para d3!',
        e2d3: 'Muito bem!',
        d6d7: 'Agora mova seu rei até d4!',
        d3d4: 'Parabéns, você dominou o movimento do Rei!',
      },
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Movimento do Peão',
      description:
        'O peão é a peça mais numerosa no tabuleiro e tem um movimento simples, mas importante. Ele só pode se mover para frente, uma casa por vez, exceto no seu primeiro movimento, quando pode mover duas casas. No entanto, ele só pode capturar outras peças na diagonal (veremos nas aulas sobre captura de peças). Para se mover com o peão, clique nele e arraste-o para a casa desejada. Passe o mouse sobre o peão para ver as casas possíveis que ele pode se mover.',
      courseId: course.id,
      position: '2k5/2p5/8/8/8/8/4P3/4K3 b - - 0 1',
      moves: ['c7c6', 'e2e4', 'c6c5', 'e4e5'],
      userColor: 'w',
      messages: {
        c7c6: 'Mova seu peão para e4!',
        e2e4: 'Muito bem!',
        c6c5: 'Agora mova seu peão até e5!',
        e4e5: 'Parabéns, você dominou o movimento do Peão!',
      },
    },
  });

  console.log('Curso e aulas criados com sucesso!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
