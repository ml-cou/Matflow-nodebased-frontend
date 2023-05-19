import React from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="grid place-items-center mt-12">
      <h1 className="text-3xl font-bold mb-12">Already Registered?</h1>
      <div className="max-w-5xl flex gap-6">
        <div className="border w-1/2 p-6 rounded shadow-md">
          <h3 className="text-2xl font-medium mb-2">New User ?</h3>
          <p className="text-sm font-light mb-6">
            Create a new user account on Matflow and embark on an exciting
            journey of machine learning and data analytics. Gain access to a
            wide range of resources, collaborate with fellow enthusiasts, and
            unlock exclusive features tailored to enhance your learning
            experience. Join us today and unleash your potential in the world of
            data.
          </p>
          <Link
            to={"/register"}
            className="border-2 border-primary-btn py-2 px-4 rounded-md hover:bg-primary-btn hover:text-white"
          >
            Create an account
          </Link>
        </div>
        <div className="border w-1/2 p-6 rounded shadow-md">
          <h3 className="text-2xl font-medium mb-2">Login</h3>
          <p className="text-sm font-light mb-4">
            If you have an account with us, please login to proceed.
          </p>
          <form action="" className="flex flex-col items-start">
            <label
              htmlFor="email"
              className="text-md font-medium text-gray-700"
            >
              EMAIL
            </label>
            <input
              type="email"
              id="email"
              className="my-2 p-2 rounded outline-none border-2 shadow hover:border-primary-btn hover:border-2 w-full"
              placeholder="Enter your email"
            />
            <label
              htmlFor="password"
              className="text-md font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="my-2 p-2 rounded outline-none border-2 hover:border-primary-btn shadow w-full"
              placeholder="Enter your password"
            />
            <button className="border-2 mt-4 text-md px-6 py-2 border-primary-btn rounded-md hover:bg-primary-btn hover:text-white">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
