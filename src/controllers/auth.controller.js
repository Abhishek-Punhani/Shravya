const { createUser }=require( "../services/auth.service.js");

module.exports.register = async (req, res, next) => {
  try {
    const { name, email, picture, status, password } = req.body;
    const newUser = await createUser({
      name,
      email,
      picture,
      status,
      password,
    });

   
  } catch (error) {
    next(error);
  }
}
