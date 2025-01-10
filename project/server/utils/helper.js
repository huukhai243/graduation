const MailConfig = require("../config/mail");

const sendMailPayment = (email, type, more, month) => {
  let title = "";
  switch (type) {
    case "rooms":
      title = "phòng";
      break;
    case "services":
      title = "dịch vụ";
      break;
    default:
      title = "giữ xe";
      break;
  }

  title += ` tháng ${month}`;

  MailConfig.sendMail({
    mailTo: email,
    subject: `Thanh toán tiền ${title}`,
    html: `<p>
      Bạn có một hóa đơn thanh toán tiền ${title}, vui lòng kiểm tra và thanh toán.Ghi rõ nội dung chuyển khoản :Tiền
      ${title}
    </p>
    ${more}
    `,
  });
};

const sendMailNotifyRegister = (email, content) => {
  MailConfig.sendMail({
    mailTo: email,
    subject: "Thông báo",
    html: `<p>
      ${content}
    </p>`,
  });
};
module.exports = {
  sendMailPayment,
  sendMailNotifyRegister,
};
