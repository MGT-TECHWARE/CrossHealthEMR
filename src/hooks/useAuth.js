import { useAuthStore } from '../stores/authStore'
import {
  login as authLogin,
  register as authRegister,
  logout as authLogout,
  signInWithGoogle as authSignInWithGoogle,
} from '../services/auth.service'

export function useAuth() {
  const { user, role, isLoading, clear } = useAuthStore()

  async function login(email, password) {
    const data = await authLogin(email, password)
    return data
  }

  async function register(params) {
    const data = await authRegister(params)
    return data
  }

  async function signInWithGoogle() {
    const data = await authSignInWithGoogle()
    return data
  }

  async function logout() {
    await authLogout()
    clear()
  }

  return { user, role, isLoading, login, logout, register, signInWithGoogle }
}

export default useAuth
