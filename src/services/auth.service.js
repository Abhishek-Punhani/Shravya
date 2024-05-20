const createHttpError=require("http-errors");
const validator=require("validator");
const { UserModel } =require( "../models/index.js");
const bcrypt=require("bcrypt");

//env variables
const { DEFAULT_PICTURE, DEFAULT_STATUS } = process.env;

module.exports.createUser = async (userData) => {
  const { name, email, picture, status, password } = userData;

  //check if fields are empty
  if (!name || !email || !password) {
    throw createHttpError.BadRequest("Please fill all fields.");
  }

  //check name length
  if (
    !validator.isLength(name, {
      min: 2,
      max: 16,
    })
  ) {
    throw createHttpError.BadRequest(
      "Plase make sure your name is between 2 and 16 characters."
    );
  }

  //Check status length
  if (status && status.length > 64) {
    throw createHttpError.BadRequest(
      "Please make sure your status is less than 64 characters."
    );
  }

  //check if email address is valid
  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest(
      "Please make sure to provide a valid email address."
    );
  }

  //check if user already exist
  const checkDb = await UserModel.findOne({ email });
  if (checkDb) {
    throw createHttpError.Conflict(
      "Please try again with a different email address, this email already exist."
    );
  }

  //check password length
  if (
    !validator.isLength(password, {
      min: 6,
      max: 128,
    })
  ) {
    throw createHttpError.BadRequest(
      "Please make sure your password is between 6 and 128 characters."
    );
  }

  //hash password--->to be done in the user model

  //adding user to database
  const user = await new UserModel({
    name,
    email,
    picture: picture || DEFAULT_PICTURE,
    status: status || DEFAULT_STATUS,
    password,
  }).save();

  return user;
};


module.exports.signUser=async(email,password)=>{
  const user=UserModel.findOne({email:email.toLowerCase()}).lean();


  // if user does'nt exist

  if(!user) throw new createHttpError.NotFound("Invalid Credentials");

  // mathing passwords

  let pass_match= await bcrypt.compare(password,user.password);
  if(!pass_match) throw new createHttpError.NotFound("Invalid Credentials");

  return user;
  
}