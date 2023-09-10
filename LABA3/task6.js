function square(number) {
    return new Promise((resolve, reject) => {
      if (typeof number !== 'number') {
        reject(new Error('Invalid input'));
      } else {
        setTimeout(() => {
          resolve(number * number);
        }, 2000);
      }
    });
  }
  
  function cube(number) {
    return new Promise((resolve, reject) => {
      if (typeof number !== 'number') {
        reject(new Error('Invalid input'));
      } else {
        setTimeout(() => {
          resolve(number * number * number);
        }, 2000);
      }
    });
  }
  
  function fourthPower(number) {
    return new Promise((resolve, reject) => {
      if (typeof number !== 'number') {
        reject(new Error('Invalid input'));
      } else {
        setTimeout(() => {
          resolve(number * number * number * number);
        }, 2000);
      }
    });
  }

  Promise.race([square(2), cube(3), fourthPower(4)])
  .then((result) => {
    console.log(result); // 16
  })
  .catch((error) => {
    console.error(error);
  });


  Promise.any([square(2), cube(3), fourthPower(4)])
  .then((result) => {
    console.log(result); // 4
  })
  .catch((error) => {
    console.error(error);
  });
