const {ACCESS_CODE} = require('../config');


module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword,
  accessCode
) => {
  const errors = {};
  var usernameRegex = /^[a-zA-Z][a-zA-Z0-9\_]{2,}/
  if(username.trim() ===''){
    errors.username = 'Username must not be empty.'
  }

  //username must contain only letters and numbers
  if(!/^[a-zA-Z][a-zA-Z0-9\_]{2,}/.test(username)){
    errors.username = 'Username must start with a letter and not contain special characters.'
  }   

  if(email.trim() ===''){
    errors.email = 'Email must not be empty.'
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address.';
    }
  }

  if(password.trim() === ''){
    errors.password = 'Password must not be empty.'
  } else {
    if(password != confirmPassword){
      errors.confirmPassword = "Passwords must match."
    }
  }

  if(accessCode.trim === ''){
    errors.accessCode = 'Access code must not be empty.'
  } else {
    console.log("IN HERE. access code is: " + ACCESS_CODE)
    if(accessCode != ACCESS_CODE){
      errors.accessCode = "Invalid access code."
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length <1
  }
}

module.exports.validateLoginInput = (username, password) =>{
  const errors = {};

  if(username.trim() ===''){
    errors.username = 'Username must not be empty.'
  }

  if(password.trim() ===''){
    errors.password = 'Password must not be empty.'
  }

  return {
    errors,
    valid: Object.keys(errors).length <1
  }
}