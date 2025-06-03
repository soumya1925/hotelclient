import React from 'react'
import "../styles/Register.scss"
import {useNavigate} from 'react-router-dom'
import { useState, useEffect } from 'react'

const RegisterPage = () => {

    const [formData, setFormData] = React.useState(
        {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmpassword: '',
            profileImage: null
        }
    );
   const handleChange = (e) => {
        const { name, value ,files } = e.target;
        setFormData({ 
            ...formData, 
            [name]: value ,
            [name]:name === 'profileImage' ? files[0] : value
        });
    }
    const [passwordMatch, setPasswordMatch] = useState(true);
    useEffect(()=>{
        setPasswordMatch(formData.password === formData.confirmpassword || formData.confirmpassword === '')
    })
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try{
            const register_form = new FormData()
            for (var key  in formData){
                register_form.append(key,formData[key])
            }
            const response = await fetch("https://hotelserver-9wlo.onrender.com/auth/register",{
                method:'POST',
                body:register_form
            })
            if(response.ok){
                navigate('/login')
            }

            
        }catch(err){
            console.log("Registration Failed",err.message);

    }
};

    return (
        <div className='register'>
            <div className='register_content'>
                <form className='register_content_form'
                onSubmit={handleSubmit}>
                    <input
                        placeholder='First Name'
                        name='firstName'
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />


                    <input
                        placeholder='Last Name'
                        name='lastName'
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />

                    <input
                        placeholder='Email'
                        name='email'
                        type='email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        placeholder='Password'
                        name='password'
                        type='password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <input
                        placeholder='Confirm Password'
                        name='confirmpassword'
                        type='password'
                        value={formData.confirmpassword}
                        onChange={handleChange}
                        required
                    />

                    {!passwordMatch && (<p style={{color:"red"}}> Passwords do not match</p>)}

                    <input
                        id="image"
                        type="file"
                        name="profileImage"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor='image'>
                      <img src="/assets/addImage.png" alt="add profile photo" />  
                      <p>Upload Your Photo</p>
                    </label>

                    {formData.profileImage && (
                        <img
                            src={URL.createObjectURL(formData.profileImage)}
                            alt="profile photo"
                            style={{ maxWidth: "80px" }} 
                        />
                    )}
                    <button type='submit'
                    disabled={!passwordMatch}>REGISTER</button>
                </form>
                <a href='/login'>Already have an account?Log in</a>

            </div>
        </div>
    )
}

export default RegisterPage