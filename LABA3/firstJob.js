function firstJob() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('Hello World');
      }, 2000);
    });
  }

firstJob().then((result) => {
    console.log(result); // Hello World
}).catch((error) => {
    console.error(error);
});

async function handleFirstJob() {
    try {
      const result = await firstJob();
      console.log(result); // Hello World
    } catch (error) {
      console.error(error);
    }
  }
  
  handleFirstJob();