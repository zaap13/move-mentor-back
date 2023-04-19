# API MoveMentor

API para gerenciamento de cursos, lições e usuários da plataforma MoveMentor.

## Rotas

### Autenticação

- POST /auth/sign-in
  - Autentica o usuário com base no email e senha fornecidos no corpo da requisição.
  - Corpo da requisição: `{ "email": string, "password": string }`
  - Retorna um token de autenticação em caso de sucesso.

### Usuários

- POST /users
  - Cria um novo usuário.
  - Corpo da requisição: `{ "username": string, "image": string "email": string, "password": string }`
  - Retorna os dados do usuário criado.

### Cursos

- GET /courses

  - Lista todos os cursos disponíveis.
  - Requer autenticação.
  - Retorna uma lista com os dados de todos os cursos.

- GET /courses/subscribed

  - Lista todos os cursos que o usuário está inscrito.
  - Requer autenticação.
  - Retorna uma lista com os dados de todos os cursos.

- GET /courses/:id

  - Retorna os dados do curso com o id especificado.
  - Requer autenticação.
  - Retorna os dados do curso.

- POST /courses/subscribe

  - Inscreve o usuário em um curso.
  - Corpo da requisição: `{ "courseId": string }`
  - Requer autenticação.
  - Retorna os dados da inscrição.

- DELETE /courses/subscribe/:subscriptionId

  - Cancela a inscrição do usuário em um curso.
  - Requer autenticação.
  - Retorna os dados da inscrição cancelada.

- POST /courses

  - Cria um novo curso.
  - Corpo da requisição: `{ "title": string, "description": string, "image": string, "category": string }`
  - Requer autenticação.
  - Retorna os dados do curso criado.

- PATCH /courses/:id

  - Atualiza os dados de um curso existente.
  - Corpo da requisição: `{ "title": string, "description": string, "image": string, "category": string }`
  - Requer autenticação como proprietário do curso.
  - Retorna os dados do curso atualizado.

- DELETE /courses/:id
  - Exclui um curso existente.
  - Requer autenticação como proprietário do curso.
  - Retorna os dados do curso excluído.

### Lições

- GET /lessons/:id

  - Retorna os dados da lição com o id especificado.
  - Requer autenticação e inscrição no curso correspondente.
  - Retorna os dados da lição.

- POST /lessons/complete/:id

  - Marca a lição como concluída para o usuário.
  - Requer autenticação e inscrição no curso correspondente.
  - Retorna os dados da lição concluída.

- POST /lessons

  - Cria uma nova lição para um curso.
  - Corpo da requisição: `{ "title": string, "description": string, "position": string, "courseId": number, "userColor": string, "moves": array. "messages": object}`
  - Requer autenticação como proprietário do curso correspondente.
  - Retorna os dados da lição criada.

- PATCH /lessons/:id

  - Atualiza os dados de uma lição existente.
  - Corpo da requisição: `{ "title": string, "description": string, "position": string, "courseId": number, "userColor": string, "moves": array. "messages": object}`
  - Requer autenticação como proprietário da lição.
  - Retorna os dados da lição atualizada.

- DELETE /lessons/:id
  - Exclui uma lição existente.
  - Requer autenticação como proprietário da lição.
  - Retorna os dados da lição excluída.
