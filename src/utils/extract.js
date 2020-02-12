/* eslint-disable import/prefer-default-export */
export const extractErrMsg = (validationResult) => {
  let errMsg = 'Please pass at least one parameter.';
  const error = validationResult.errors[0]

  if (error) {
    const { message, property } = error
    errMsg = `${property} ${message}`
  }
  return errMsg;
}
