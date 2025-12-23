"use client"
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Poppins } from 'next/font/google'
import Image from "next/image";
import Cursor from './Cursor'
import { signIn } from '@/app/lib/auth-client'
 

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});


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

const Page = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [passwordError, setPasswordError] = useState("")
  
  const containerRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  
  const router = useRouter()

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasCapital = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long.";
    }
    if (!hasCapital) {
      return "Password must include at least one capital letter.";
    }
    if (!hasNumber) {
      return "Password must include at least one number.";
    }
    if (!hasSpecial) {
      return "Password must include at least one special character.";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (name === "password") setPasswordError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const error = validatePassword(formData.password)
    if (error) {
      setPasswordError(error)
      return
    }
    setPasswordError("")

    if (!isLogin) {
      // Sign Up Flow - Step 1
      // Save data to session storage to retrieve in profileCreate
      sessionStorage.setItem("signup_data", JSON.stringify({
        email: formData.email,
        password: formData.password
      }));
      // Navigate to profileCreate page with the name as query param
      router.push(`/profileCreate?name=${encodeURIComponent(formData.name)}`)
    } else {
      // Login Flow
      console.log("Logging in with:", formData.email)
      await signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: "/buyer/browse" // Redirect after login
      }, {
        onError: (ctx) => {
           alert(ctx.error.message)
        }
      })
    }
  }

  useEffect(() => {
    setPasswordError("")
  }, [isLogin])

  useGSAP(() => {    // Circle animation
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
  return (



    <div
      ref={containerRef}
      className="w-full h-screen bg-[#fafafa] flex text-black justify-center items-center flex-col overflow-hidden relative"
    >
      <Cursor />
      <div
        ref={circleRef}
        className="circle hidden md:block absolute rounded-full bg-[#40D2E0]"
        style={{
          width: size || 0,
          height: size || 0,
          bottom: size ? -(size * 0.333) : 0,
          right: size ? -(size * 0.333) : 0,
        }}
      ></div>

      <div ref={contentRef} className="flex flex-col items-center z-10 w-full px-3 md:px-0">
        <div className="w-full md:w-[30vw] flex flex-col items-center">
          <Image
            src={"/FisheraLogo1.png"}
            alt="Fishera Logo"
            className="w-[40vh] max-w-full mb-2 h-auto"
            width={1500}
            height={1000}
            priority
          />

          <h1 className={`${poppins.className} mb-1 text-[clamp(1.5rem,4vw,2.5rem)] text-center`}>
            {isLogin ? "Welcome Back" : "Create a Profile"}
          </h1>

          <p className='font-light flex items-center justify-center text-black/55 md:text-black/70 text-[clamp(0.9rem,2vw,1.2rem)] text-center mb-1'>
            {isLogin
              ? "Please enter your email and password"
              : "Please enter your name in the field below"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3.5 mt-1 w-full items-center"
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
            type="email"
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
            className={`p-3 rounded-full px-7 w-full outline-none border ${passwordError ? 'border-red-500' : 'border-black/20'} md:w-[30vw] text-black/80 font-medium text-[clamp(0.9rem,1.5vw,1.1rem)]`}
            required
          />

          {passwordError && (
            <p className="text-red-500 text-xs -mt-1.25 w-full md:w-[30vw] px-4 text-left">
              {passwordError}
            </p>
          )}

          <button
            type="submit"
            className="mt-[.4vw] bg-[#40D2E0] text-gray-900 font-bold w-full md:w-[30vw] py-3 rounded-full cursor-pointer text-[clamp(0.9rem,1.5vw,1.1rem)] hover:bg-[#40b0e0] transition-colors"
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
      </div>
    </div>
  )
}

export default Page
