import React, { useContext, useState } from 'react'
import Signup from './Signup'
import { useForm } from "react-hook-form"
import { checkAuth, InfoContext } from '../App'

const Login = (props) => {
  const [isnewUser, setUser] = useState(false)
  const showInfo = useContext(InfoContext)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  async function handleLoginclick(data) {
    try {
      const response = await fetch(
        "http://localhost:3000/api/user/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        }
      );

      const Data = await response.json();
      if (!response.ok) {
        throw new Error(Data.message || "Login failed");
      }
      await checkAuth()
    } catch (err) {
      console.log(err)
      showInfo(err.message || "Something went wrong while logging in")
    }
  }

  function handleSignupClick() {
    setUser(true)
  }

  if (isnewUser) {
    return <Signup setUser={setUser} />
  }

  return (
    <div className='login_card'>
      <form className='formcard' onSubmit={handleSubmit(handleLoginclick)}>
        <div className='symmelogin'>
          <div className='login_form label_form'>
            <p><strong>User Name : </strong></p>
            <p><strong>Email : </strong></p>
            <p><strong>Password: </strong></p>
          </div>
          <div className='login_form'>
            <input type="text" {...register("username")} />
            <input type="email" {...register("email")} />
            <input type="password" {...register("password", { required: true })} />
          </div>
        </div>
        {errors.password && <h3>username or email and password is required</h3>}
        <button type='submit' disabled={isSubmitting}> {isSubmitting ? "fetching the data..." : "Login"} </button>
      </form>
      <h3>new user? please Sign up </h3>
      <button type={'button'} onClick={handleSignupClick} disabled={isSubmitting}> sign UP</button>
    </div>
  )
}

export default Login
