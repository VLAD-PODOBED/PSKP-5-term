function thirdJob(data) {
    return new Promise((resolve, reject) => {
      if (typeof data !== 'number') {
        reject('error');
      } else if (data % 2 === 1) {
        setTimeout(() => {
          resolve('odd');
        }, 1000);
      } else if (data % 2 === 0) {
        setTimeout(() => {
          reject('even');
        }, 2000);
      }
    });
  }

  thirdJob(5).then((result) => {
    console.log(result); // odd
  }).catch((error) => {
    console.error(error);
  });
  
  
  thirdJob(4).then((result) => {
    console.log(result); // не будет выполнено
  }).catch((error) => {
    console.error(error); // even
  });

  async function handleThirdJob() {
    try {
      const result1 = await thirdJob(5);
      console.log(result1); // odd
    } catch (error) {
      console.error(error);
    }
  
    try {
      const result2 = await thirdJob(4);
      console.log(result2); // не будет выполнено
    } catch (error) {
      console.error(error); // even
    }
  }
  
  handleThirdJob();