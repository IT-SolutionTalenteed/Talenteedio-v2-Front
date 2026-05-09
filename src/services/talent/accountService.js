import api from '../api.js'

export const accountService = {
  deleteAccount: (password) => api.delete('/talent/account', { data: { password } }),
}

export default accountService
