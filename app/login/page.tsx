import React from 'react'
import { Google_Sans } from 'next/font/google'
import { Poppins } from 'next/font/google'
import Link from 'next/link'
import { after } from 'node:test';

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

const page = () => {
  return (
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
      </div>
    </div>
  )
}

export default page
