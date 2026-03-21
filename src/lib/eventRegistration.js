/** API / DB may return boolean or string */
export function isRegistrationEnabled(value) {
  return value === true || value === 'true' || value === 1 || value === '1'
}
