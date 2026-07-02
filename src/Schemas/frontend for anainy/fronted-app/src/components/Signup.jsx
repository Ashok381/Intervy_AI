import React, { useContext } from 'react'
import { useForm } from "react-hook-form"
import { InfoContext } from '../App'

const Signup = (props) => {
  const showInfo = useContext(InfoContext)

  function handleLoginclick() {
    (props.setUser)(false);
  }

  async function handleSignupclick(data) {
    try {
      const response = await fetch(
        "http://localhost:3000/api/user/register",
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
        throw new Error(Data.message || "Sign up failed");
      }
      props.setUser(false);
      showInfo("Account created. Please log in.", "#2a9d8f");
    } catch (err) {
      console.log(err)
      showInfo(err.message || "Something went wrong while signing up")
    }
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  return (
    <div>
      <div className='login_card'>
        <form className='formcard' onSubmit={handleSubmit(handleSignupclick)}>
          <div className='symmelogin'>
            <div className='login_form label_form'>
              <p><strong>User Name: </strong></p>
              <p><strong>Email: </strong></p>
              <p><strong>Password: </strong></p>
            </div>
            <div className='login_form '>
              <input type="text" {...register("username", { required: true })} />
              <input type="email" {...register("email", { required: true })} />
              <input type="password" {...register("password", { required: true })} />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting}>{isSubmitting ? "submitting" : "Sign UP"}</button>
          {/* NOTE: was errors.userName, but the field is registered as "username" — the validation message never showed before */}
          {errors.username && <h3>Username is required</h3>}
          {errors.email && <h3>email is required</h3>}
          {errors.password && <h3>password is required</h3>}
        </form>
        <h3> ! already have an account please login !</h3>
        <button type="button" onClick={handleLoginclick}>Login</button>
      </div>
    </div>
  )
}

export default Signup
