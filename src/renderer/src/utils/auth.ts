/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as jwtDecodePkg from 'jwt-decode'

type TokenPayload = {
  exp: number
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false

  try {
    const jwtDecode = (jwtDecodePkg as any).default as <T>(token: string) => T
    const decoded = jwtDecode<TokenPayload>(token)
    const now = Date.now() / 1000
    return decoded.exp > now
  } catch {
    return false
  }
}
