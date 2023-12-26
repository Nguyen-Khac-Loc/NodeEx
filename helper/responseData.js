function responseReturn(res, status, sucess, data) {
  res.send(status, {
    state: sucess,
    data: data,
  });
}
module.exports = {
  responseReturn: responseReturn,
};
