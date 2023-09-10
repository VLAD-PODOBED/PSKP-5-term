function secondJob() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Something went wrong'));
      }, 3000);
    });
  }

secondJob().then((result) => {
        console.log(result); // не будет выполнено
    }).catch((error) => {
        console.error(error); // Error: Something went wrong
    });

async function handleSecondJob() {
    try {
        await secondJob();
    } catch (error) {
        console.error(error); // Error: Something went wrong
    }
}
      
handleSecondJob();