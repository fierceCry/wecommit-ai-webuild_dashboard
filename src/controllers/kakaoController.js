const kakaoService = require('../services/kakaoService');
const { catchAsync } = require('../utils/error');

const kakaoSignUp = catchAsync(async (req, res) => {
  const authCode = req.query.code;
  const endPoint = req.path;
  const redirectUri = await kakaoService.getRedirectUri(endPoint);
  const kakaoAccessToken = await kakaoService.getKaKaoAccessToken(
    authCode,
    redirectUri
  );
  const { profile } = await kakaoService.getUserInformation(kakaoAccessToken);
  const social = "kakao";
  console.log(profile.nickname, social)
  await kakaoService.addAdditionalInfo(profile.nickname, social);

  res.status(200).json({message: "SIGN UP COMPLETED"});
});

const kakaoSignIn = catchAsync(async (req, res) => {
  const authCode = req.query.code;
  const endPoint = req.path;
  const redirectUri = await kakaoService.getRedirectUri(endPoint);
  const kakaoAccessToken = await kakaoService.getKaKaoAccessToken(
    authCode,
    redirectUri
  );
  const { email, gender, birthyear, birthday } =
    await kakaoService.getUserInformation(kakaoAccessToken);
  const age = await kakaoService.calculateAge(birthyear, birthday);
  const user = await kakaoService.getUserByEmail(email);
  if (!user) {
    await kakaoService.createUser(email, gender, age);
    return await res.status(202).json({
      message: 'BASIC REGISTRATION SUCCESSFUL. NEED ADDITIONAL INFORMATION',
    });
  }
  const { nickname, height, weight } = user;
  if (!nickname || !height || !weight) {
    await res.status(202).json({
      message: 'NEED ADDITIONAL INFORMATION',
    });
  } else if (nickname && height && weight) {
    const token = await kakaoService.createToken(email);

    await res
      .status(200)
      .json({ authorization: token, message: 'SIGN IN COMPLETED' });
  }
});

module.exports = {
  kakaoSignUp,
  kakaoSignIn
}