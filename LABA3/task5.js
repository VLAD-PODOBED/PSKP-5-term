function square(number) {
    return new Promise((resolve, reject) => {
      if (typeof number !== 'number') {
        reject(new Error('Invalid input'));
      } else {
        resolve(number * number);
      }
    });
  }
  
  function cube(number) {
    return new Promise((resolve, reject) => {
      if (typeof number !== 'number') {
        reject(new Error('Invalid input'));
      } else {
        resolve(number * number * number);
      }
    });
  }
  
  function fourthPower(number) {
    return new Promise((resolve, reject) => {
      if (typeof number !== 'number') {
        reject(new Error('Invalid input'));
      } else {
        resolve(number * number * number * number);
      }
    });
  }

  Promise.all([square(2), cube(3), fourthPower(4)])
  .then((results) => {
    console.log(results); // не будет выполнено
  })
  .catch((error) => {
    console.error(error); // Error: Invalid input
  });
