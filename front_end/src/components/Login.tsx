import React from 'react'
import { login } from '../api/auth-api'

type Props = {}

const Login = (props: Props) => {
    const [email, setEmail] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const user = await login(email, password);
        alert("hello " + user.firstName)
    }
    return (
        <div>Login

            <form onSubmit={handleLogin}>
                <input placeholder='email' type='email' value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value) }} />
                <input placeholder='password' type='password' value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value) }} />

                <button type='submit'> Login </button>
            </form>

        </div>
    )
}

export default Login