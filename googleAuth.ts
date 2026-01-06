let GoogleSignin: any;
let statusCodes: any;
let isErrorWithCode: any;
let isSuccessResponse: any;
let isCancelledResponse: any;

export async function loadGoogleSignin() {
  if (GoogleSignin) {
    return {
      GoogleSignin,
      statusCodes,
      isErrorWithCode,
      isSuccessResponse,
      isCancelledResponse,
    };
  }

  const mod = await import("@react-native-google-signin/google-signin");
  GoogleSignin = mod.GoogleSignin;
  statusCodes = mod.statusCodes;
  isErrorWithCode = mod.isErrorWithCode;
  isSuccessResponse = mod.isSuccessResponse;
  isCancelledResponse = mod.isCancelledResponse;

  return {
    GoogleSignin,
    statusCodes,
    isErrorWithCode,
    isSuccessResponse,
    isCancelledResponse,
  };
}
