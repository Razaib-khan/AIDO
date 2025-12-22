"use client"
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { Poppins } from 'next/font/google'
import Image from "next/image";
import img from "./Adobe Express - file.png";
import Cursor from './Cursor'

const poppins = Poppins({ subsets: ['latin'], weight: ['600'] })

const Page = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })
  const containerRef = useRef(null)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!isLogin) {
      // Navigate to profileCreate page with the name as query param
      router.push(`/profileCreate?name=${encodeURIComponent(formData.name)}`)
    } else {
      console.log("Login data:", formData)
      // Add login logic here
    }
  }

  useEffect(() => {
    gsap.to(".circle", {
      top: isLogin ? "-15vh" : "calc(100% - 23vw)",
      left: isLogin ? "-15vh" : "calc(100% - 23vw)",
      duration: 1.2,
      ease: "power4.inOut",
    })
  }, [isLogin])

  useEffect(() => {
    const elems = containerRef.current.children
    gsap.from(elems, {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 1,
      ease: "power3.out",
    })
  }, [])

  const [size, setSize] = useState(0);

  useEffect(() => {
    setSize(window.innerWidth * 0.3);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-[#fafafa] flex text-black justify-center items-center flex-col overflow-hidden relative"
    >
      <Cursor />
      <div
        className="circle hidden md:block absolute rounded-full bg-[#8cfe65]"
        style={{
          width: size || 0,
          height: size || 0,
          bottom: size ? -(size * 0.333) : 0, // roughly -10vw
          right: size ? -(size * 0.333) : 0,
        }}
      ></div>


      <Image
        src={img}
        alt="Profile"
        className="w-[18vh] mb-5 h-auto z-10"
      />

      <h1 className={`${poppins.className} mb-4 z-10 text-[clamp(1.5rem,4vw,2.5rem)]`}>
        {isLogin ? "Welcome Back" : "Create a Profile"}
      </h1>

      <p className='font-light flex items-center justify-center sm:w-full md:w-auto sm:text-black/55 md:text-black/70 z-10 text-[clamp(0.9rem,2vw,1.2rem)]'>
        {isLogin
          ? "Please enter your email and password"
          : "Please enter your name in the field below"}
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3.5 mt-4 z-10 w-full px-3 md:px-0 items-center"
      >
        {!isLogin && (
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder='Your Name'
            className='p-3 rounded-full px-7 w-full outline-none border border-black/20 md:w-[30vw] text-black/80 font-medium text-[clamp(0.9rem,1.5vw,1.1rem)]'
            required
          />
        )}

        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder='Your Email'
          className='p-3 rounded-full px-7 w-full outline-none border border-black/20 md:w-[30vw] text-black/80 font-medium text-[clamp(0.9rem,1.5vw,1.1rem)]'
          required
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder='Your Password'
          className='p-3 rounded-full px-7 w-full outline-none border border-black/20 md:w-[30vw] text-black/80 font-medium text-[clamp(0.9rem,1.5vw,1.1rem)]'
          required
        />

        <button
          type="submit"
          className="mt-4 bg-[#8cfe65] text-black font-bold w-full md:w-[30vw] py-3 rounded-full cursor-pointer z-10 text-[clamp(0.9rem,1.5vw,1.1rem)]"
        >
          {isLogin ? "Login" : "Enter"}
        </button>
      </form>

      <p
        onClick={() => setIsLogin(!isLogin)}
        className="w-full md:w-[30vw] px-3 text-gray-500 cursor-pointer mt-2 select-none z-10 text-[clamp(0.8rem,1.5vw,1rem)]"
      >
        {isLogin ? "Create a new account?" : "Already have an account?"}
      </p>
    </div>
  )
}

export default Page
