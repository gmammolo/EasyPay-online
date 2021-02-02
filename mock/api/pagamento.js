module.exports = function (app) {
  const pagamentoResponse = {
    id: 18,
    valore: 1.0,
    timestamp: '2021-02-02T10:03:53.343',
    type: 'pagamento',
    from: 21,
    from_name: 'Prodotti Scolastici',
    to: 20,
    to_name: 'Sedie da Manager',
  };

  const outOfBudget = {
    type: 'OUT_OF_BUDGET',
    message: 'budget del cliente 21 insufficiente',
    timestamp: 1612260277651,
  };

  const errorSaldo = {
    type: 'INSUFFICIENT_FUNDST',
    message: 'Fondi del cliente 21 insufficienti',
    timestamp: 1612260138275,
  };

  app.get('/api/pagamenti', (req, res, next) => {
    res.json([pagamentoResponse]);
  });

  // app.get('/api/pagamenti/:id', (req, res, next) => {
  //   res.json(pagamentoResponse);
  // });

  app.post('/api/pagamenti', (req, res, next) => {
    if (req.body.value > 200) {
      return res.status(400).json(errorSaldo);
    } else if (req.body.value > 20) {
      return res.status(400).json(outOfBudget);
    } else {
      return res.json(pagamentoResponse);
    }
  });
};
