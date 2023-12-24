const nodemailer = require('nodemailer');

// Создаем транспортер для отправки писем
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'mama2003271@gmail.com',
    pass: 'podobed0499',
  },
});

// Функция для отправки письма
const sendEmail = () => {
  const mailOptions = {
    from: 'mama2003271@gmail.com',
    to: 'podobedvladislavgeorg@gmail.com',
    subject: 'Тестовое письмо',
    text: 'Привет, это тестовое письмо!',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Письмо отправлено: ' + info.response);
    }
  });
};

// Вызываем функцию для отправки письма
sendEmail();