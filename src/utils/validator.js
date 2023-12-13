const validateSignUp = async (
  phoneNumber,
  userEmail,
  recoveryEmail,
  password
) => {
  // 특수문자 없이 숫자 10자 이상
  const phoneNumberRegex = /^[0-9]{10,}$/;

  //ID는 영문 대소문자 + 숫자를 반드시 혼용하여 3~15자로 이루어져야 합니다.
  const userEmailRegex =
    /^(?=.*[A-Za-z].*[0-9]|[0-9].*[A-Za-z])[A-Za-z0-9]{3,15}$/;
  //영문 대소문자, 숫자, 밑줄, 하이픈, 마침표 및 도메인 이름 포함 가능
  //이메일 주소는 '@' 문자로 구분되어야 하며 도메인 이름은 최소 2~3자 이상의 영문 대소문자로 이루어져야 합니다.
  const recoveryEmailRegex =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

  // 비밀번호는 적어도 8자 이상이어야 하며 적어도 하나의 영문 대소문자, 하나의 숫자 및 하나의 특수문자를 포함해야 합니다.
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/;

  // test함수를 사용해 주어진 이메일이 정규 표현식과 일치하는 지 여부 확인(일치할 경우 true, 불일치일 경우 false를 반환)
  if (!phoneNumberRegex.test(phoneNumber)) {
    const error = new Error("PHONENUMBER_VALIDATION_ERROR");
    error.statusCode = 400;

    throw error;
  }

  // if (!userEmailRegex.test(userEmail)) {
  //   const error = new Error("EMAIL_VALIDATION_ERROR");
  //   error.statusCode = 400;

  //   throw error;
  // }

  if (!recoveryEmailRegex.test(recoveryEmail)) {
    const error = new Error("EMAIL_VALIDATION_ERROR");
    error.statusCode = 400;

    throw error;
  }

  if (!passwordRegex.test(password)) {
    const error = new Error("PASSWORD_VALIDATION_ERROR");
    error.statusCode = 400;

    throw error;
  }
};
const validateChangePassword = async (
  newPassword,
) =>{
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/;

  if (!passwordRegex.test(newPassword)) {
    const error = new Error("PASSWORD_VALIDATION_ERROR");
    error.statusCode = 400;

    throw error;
  }
}

module.exports = {
  validateSignUp,
  validateChangePassword,
};
