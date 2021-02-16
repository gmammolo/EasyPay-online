module.exports = function (app) {
  const users = [
    {
      id: 20,
      otp: '235778',
      pin: '1234',
      nome: 'Ababua',
      cognome: 'Bau',
      cf: 'SNHFAIHCFIUHFHSYDCUHND',
      phone: '+390123456789',
      address: 'Strada grande',
      createdAt: '2021-01-08T11:59:43.699+0000',
      updatedAt: '2021-01-08T11:59:43.699+0000',
      ragSoc: 'Pizzeria Mare Blu',
      piva: 'SHKVIYNGARCNIYHCFAIHIANHAI',
      birth_date: '23/11/1989',
      type: 'commerciante',
      id_conto: 20,
      email: 'user1@gmail.com',
    },
    {
      id: 21,
      otp: '453422',
      pin: '1234',
      nome: 'Paolo',
      cognome: 'Pioppo',
      cf: 'ASDFGHJKLPOIUYTRE',
      phone: '+390123456789',
      address: 'Via Rossi',
      createdAt: '2021-01-08T11:59:42.943+0000',
      updatedAt: '2021-01-08T11:59:42.943+0000',
      birth_date: '23/11/1983',
      id_conto: 21,
      email: 'user1@gmail.com',
      type: 'cliente',
    },
  ];

  app.get('/api/clienti', (req, res, next) => {
    res.json(users);
  });

  app.get('/api/clienti/:id', (req, res, next) => {
    const otp = req.query.opt;
    const pin = req.query.pin;
    const user = users.find((user) => user.id + '' === req.params.id);
    if (!user) {
      return res.status(404).json({
        type: 'NO_COUNT',
        message: "Cliente not found with id : '4'",
        timestamp: 1611268454561,
      });
    } else if (user.otp === otp || user.pin === pin || (!otp && !pin)) {
      return res.json(user);
    } else {
      // id giusto ma pin sbagliato
      return res.status(400).json({
        type: 'INVALID_REQUEST',
        message: 'Invalid request',
        timestamp: 1610107795531,
      });
    }
  });
};
