function createOrder(cardNumber) {
    return new Promise((resolve, reject) => {
      validateCard(cardNumber)
        .then((isValid) => {
          if (isValid) {
            setTimeout(() => {
              const orderId = generateOrderId();
              resolve(orderId);
            }, 5000);
          } else {
            reject(new Error('Card is not valid'));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function validateCard(cardNumber) {
    console.log(cardNumber);
    return new Promise((resolve) => {
      const isValid = Math.random() < 0.5;
      resolve(isValid);
    });
  }

  function proceedToPayment(orderId) {
    console.log(orderId);
    return new Promise((resolve, reject) => {
      const isSuccess = Math.random() < 0.5;
      if (isSuccess) {
        resolve('Payment successful');
      } else {
        reject(new Error('Payment failed'));
      }
    });
  }

  createOrder('1234567890')
  .then((orderId) => {
    return proceedToPayment(orderId);
  })
  .then((paymentResult) => {
    console.log(paymentResult);
  })
  .catch((error) => {
    console.error(error);
  });


async function handleCreateOrderAndPayment() {
  try {
    const orderId = await createOrder('1234567890');
    const paymentResult = await proceedToPayment(orderId);
    console.log(paymentResult);
  } catch (error) {
    console.error(error);
  }
}

handleCreateOrderAndPayment();