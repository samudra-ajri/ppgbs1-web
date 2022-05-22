import { useState, useEffect } from 'react'
import { FaUser } from 'react-icons/fa'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const { email, password } = formData
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }
  const onSubmit = (e) => {
    e.preventDefault()
  }

  return <>
    <section className='heading'>
      <h1>
        Login
      </h1>
    </section>

    <sction className='form'>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <input
            type='email'
            className='form-control'
            id='email'
            name='email'
            value={email}
            placeholder='Email'
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            className='form-control'
            id='password'
            name='password'
            value={password}
            placeholder='Password'
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <button type="submit" className='btn btn-block'>Daftar</button>
        </div>
      </form>
    </sction>
  </>
}

export default Login