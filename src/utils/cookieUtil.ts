export function setCookie(name: string, value: string, exp: number) {
  var date = new Date()
  date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000)
  document.cookie =
    name + '=' + value + ';expires=' + date.toUTCString() + ';path=/'
}

export function getCookie(name: string) {
  var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
  return value ? value[2] : null
}
