import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const course = await prisma.course.create({
    data: {
      title: 'Movimento das Peças',
      description:
        'Bem-vindo ao curso de movimentos de peças de xadrez. Neste curso, você aprenderá como mover cada uma das seis peças do xadrez: peão, torre, bispo, cavalo, dama e rei. Ao final do curso, você terá uma compreensão completa dos movimentos possíveis de cada peça.',
      image: 'https://adrenaline.com.br/uploads/chamadas/chess_alphazero_chamada.jpg',
    },
  });

  const lesson = await prisma.lesson.create({
    data: {
      title: 'Movimento da Torre',
      description:
        'A torre é uma das peças mais poderosas no xadrez. Ela pode se mover para frente, para trás e para os lados, em linha reta, desde que não haja outra peça bloqueando o caminho. No tabuleiro, a torre pode se mover quantas casas quiser, em qualquer direção permitida, desde que siga em linha reta. Para se mover com a torre, selecione-a e clique em uma das casas possíveis para ela, ou arraste-a para a casa desejada. Passe o mouse sobre a torre para ver as casas possíveis que ela pode se mover.',
      courseId: course.id,
      category: 'Tutorial',
      position: '6k1/5p2/6p1/8/4R3/8/8/4K3 b - - 0 1',
      moves: ['g8g7', 'e4c4', 'g6g5', 'c4c8'],
      userColor: 'w',
      messages: { g8g7: 'message1', e4c4: 'message2', g6g5: 'Message3', c4c8: 'Message5' },
    },
  });

  console.log('Curso e aula criados com sucesso!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
