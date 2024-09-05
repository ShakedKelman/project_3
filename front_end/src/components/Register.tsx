import React from 'react'
import { register } from '../api/auth-api'

type Props = {}

const Register = (props: Props) => {
    const [fname, setFname] = React.useState<string>("")
    const [lname, setLname] = React.useState<string>("")
    const [email, setEmail] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()

        await register(fname, lname, email, password);        
        alert("User Added")
    }

  return (
    <div>Register Form

        <br/>
        <form onSubmit={handleSubmit}>
            <input required placeholder='first name' onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{setFname(e.target.value)}}/>
            <br/>
            <input required placeholder='last name' onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{setLname(e.target.value)}}/>
            <br/>
            <input required placeholder='email' type='email' onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{setEmail(e.target.value)}}/>
            <br/>
            <input required type='password' placeholder='' onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{setPassword(e.target.value)}}/>
            <br/>

            <button type='submit'> Register </button>
        </form>
    </div>

    
  )
}

export default Register