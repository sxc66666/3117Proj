import React, { useState } from "react";
import FormInput from "../components/FormInput";

export default function Auth() {
  const [isRegister, setIsRegister] = useState(false);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setPassword("");
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          {isRegister ? "Create an account" : "Sign in to your account"}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6">
          {isRegister && (
            <>
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Register as:</label>
                <div className="mt-2 relative">
                  <select
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 appearance-none"
                    defaultValue=""
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="" disabled>
                      Choose your role
                    </option>
                    <option value="customer">Customer</option>
                    <option value="vendor">Vendor</option>
                  </select>
                  <div
                    className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-300"
                    style={{ fontSize: "1.3rem" }}
                  >
                    ▾
                  </div>
                </div>
              </div>

              <FormInput
                label={role === "vendor" ? "Restaurant Name" : "Username"}
                type="text"
                required
              />
            </>
          )}

          <FormInput
            label="Email address"
            type="email"
            required
            autoComplete="email"
          />

          <FormInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isRegister ? "Sign up" : "Sign in"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          {isRegister ? "Already have an account?" : "Not a member?"}{" "}
          <button
            type="button"
            onClick={toggleForm}
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            {isRegister ? "Sign in" : "Create an account"}
          </button>
        </p>
      </div>
    </div>
  );
}
