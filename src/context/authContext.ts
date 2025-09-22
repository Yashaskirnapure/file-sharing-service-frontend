import { createContext } from "react"

export type User = {
	id: string
	name: string
	email: string
}

export type AuthContextType = {
	user: User | null
	token: string | null
	login: (token: string) => void
	logout: () => void
	isAuthenticated: boolean
}

export type JWTPayload = {
	userId: string
	name: string
	email: string
	exp: number
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)