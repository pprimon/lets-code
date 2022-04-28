import { defaultService } from './commons/http'

export const loginUser = () => {
  return defaultService().post('/login', { login:"letscode", senha:"lets@123"})
}
