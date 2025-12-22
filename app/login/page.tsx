<<<<<<< HEAD
import React from 'react'
import { Google_Sans } from 'next/font/google'
import { Poppins } from 'next/font/google'
import Link from 'next/link'
import { after } from 'node:test';
=======
"use client"
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Poppins } from 'next/font/google'
import Image from "next/image";
import img from "./logo.png";
import Cursor from './Cursor'
>>>>>>> 9a39155 (the code I did with you and it has minimal backend setup)

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

<<<<<<< HEAD
const myStyle = {
    after: {
        content: '""',
        position: 'absolute' as 'absolute',
        width: '100%',
        height: '2px',
        bottom: '0',
        left: '0',
        backgroundColor: 'black',
        transform: 'scaleX(0)',
        transformOrigin: 'bottom right',
        transition: 'transform 0.25s ease-out',
    },
}
=======
const Page = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })
  
  const containerRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLogin) {
      // Navigate to profileCreate page with the name as query param
      router.push(`/profileCreate?name=${encodeURIComponent(formData.name)}`)
    } else {
      console.log("Login data:", formData)
      // Add login logic here
    }
  }

  useGSAP(() => {
    // Circle animation
    if (circleRef.current) {
      gsap.to(circleRef.current, {
        top: isLogin ? "-15vh" : "calc(100% - 23vw)",
        left: isLogin ? "-15vh" : "calc(100% - 23vw)",
        duration: 1.2,
        ease: "power4.inOut",
      })
    }

    // Content entrance animation
    // Only run this on mount (when the component is first created)
    // We can check if it's the first render or just rely on useGSAP's scoping
    // However, since this hook runs on [isLogin] change too, we need to separate them 
    // or ensure the "from" animation doesn't re-run unexpectedly on state change if we don't want it to.
    // But the original code had two separate useEffects.
    
  }, { scope: containerRef, dependencies: [isLogin] })

  useGSAP(() => {
    if (contentRef.current) {
      const elems = contentRef.current.children
      gsap.from(elems, {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
      })
    }
  }, { scope: containerRef }) // Empty dependencies = run once on mount

  const [size, setSize] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setSize(window.innerWidth * 0.3);
    };
    
    // Set initial size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
>>>>>>> 9a39155 (the code I did with you and it has minimal backend setup)

const page = () => {
  return (
<<<<<<< HEAD
    <div className="w-full min-h-screen bg-[#eee] flex flex-col lg:flex-row">
      <div className="div1 w-full lg:w-1/2 min-h-[30vh] lg:min-h-screen bg-black" />

      <div className="div2 w-full lg:w-1/2 min-h-screen bg-[#eee] flex items-center justify-center px-4">
        <div className="inner-div flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-8 sm:py-10 rounded-2xl w-full max-w-md lg:max-w-xl h-auto text-black bg-white shadow-2xl">
          <form>
            <fieldset className="w-full border-2 border-black/90 rounded-2xl px-6 sm:px-8 py-8 sm:py-10">
              <legend
                className={`px-4 text-xl sm:text-2xl lg:text-3xl font-black tracking-tight ${poppins.className}`}
              >
                Welcome Back!
              </legend>

              <div className="flex flex-col gap-5 mt-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="text"
                    className="border-2 border-gray-900/90 w-full px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-black/40 transition"
                    placeholder="Enter your Email..."
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Password</label>
                  <input
                    type="password"
                    className="border-2 border-gray-900/90 w-full px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-black/40 transition"
                    placeholder="Enter your Password..."
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 bg-[#a7ff8a] text-black px-6 py-3 rounded-full font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Login
                </button>

                <button
                  type="button"
                  className="bg-black w-full rounded-full text-white flex items-center justify-center py-3 font-medium hover:bg-black/90 transition"
                >
                  Create New Account
                </button>
              </div>
            </fieldset>
          </form>
        </div>
=======
    <div
      ref={containerRef}
      className="w-full h-screen bg-[#fafafa] flex text-black justify-center items-center flex-col overflow-hidden relative"
    >
      <Cursor />
      <div
        ref={circleRef}
        className="circle hidden md:block absolute rounded-full bg-[#8cfe65]"
        style={{
          width: size || 0,
          height: size || 0,
          bottom: size ? -(size * 0.333) : 0,
          right: size ? -(size * 0.333) : 0,
        }}
      ></div>

      <div ref={contentRef} className="flex flex-col items-center z-10 w-full">
        <Image
          src={img}
          alt="Profile"
          className="w-[18vh] mb-5 h-auto"
        />

        <h1 className={`${poppins.className} mb-4 text-[clamp(1.5rem,4vw,2.5rem)]`}>
          {isLogin ? "Welcome Back" : "Create a Profile"}
        </h1>

        <p className='font-light flex items-center justify-center sm:w-full md:w-auto sm:text-black/55 md:text-black/70 text-[clamp(0.9rem,2vw,1.2rem)] text-center px-4'>
          {isLogin
            ? "Please enter your email and password"
            : "Please enter your name in the field below"}
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3.5 mt-4 w-full px-3 md:px-0 items-center"
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
            className="mt-[.4vw] bg-[#8cfe65] text-black font-bold w-full md:w-[30vw] py-3 rounded-full cursor-pointer text-[clamp(0.9rem,1.5vw,1.1rem)] hover:bg-[#7aef54] transition-colors"
          >
            {isLogin ? "Login" : "Enter"}
          </button>
        </form>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="w-full md:w-[30vw] px-3 text-gray-500 cursor-pointer mt-2 select-none text-[clamp(0.8rem,1.5vw,1rem)] text-center hover:text-black transition-colors"
        >
          {isLogin ? "Create a new account?" : "Already have an account?"}
        </p>
>>>>>>> 9a39155 (the code I did with you and it has minimal backend setup)
      </div>
    </div>
  )
}

export default page
