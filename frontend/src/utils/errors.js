export function getErrorMessage(err, fallback = 'Something went wrong') {
  return err.response?.data?.message || fallback;
}
