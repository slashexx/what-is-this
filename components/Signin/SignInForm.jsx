"use client";
import React, { useEffect, useState } from "react";
import logo from "../../public/juristo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/auth-context.tsx";
import Link from "next/link";
import ClipLoader from "react-spinners/ClipLoader";
import toast from "react-hot-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(5, { message: "Password is too short; it should be at least 5 characters" }),
});

const SignInForm = () => {
  const router = useRouter();
  const { currentUser, login, signup } = useAuth(); 
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  async function onSubmit(values) {
    try {
      setLoading(true);
      const res = await login(values.email, values.password);
      
      if (res && res.user) {  // Check for successful login by verifying user object exists
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        toast.error(res?.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup() {
    try {
      setLoading(true);
      const values = form.getValues();
      const res = await signup(values.email, values.password);
      
      if (res.status) {
        toast.success("Signup successful!");
        router.push("/dashboard");
      } else {
        toast.error(res.message || "Signup failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during signup");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md px-8 py-6">
      <div className="mb-8">
        <Image
          src={logo}
          alt="Logo"
          width={200}
          height={80}
          className="h-16 w-auto"
        />
      </div>
      <h2 className="text-lg text-gray-600 mb-3">
        Welcome back !!!
      </h2>
      <h1 className="text-3xl font-bold mb-8">Sign in</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative mt-10 mb-10">
        <div className="mb-4">
          <label
            className="block text-black text-sm mb-2 font-poppins"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="bhawbhaw@gmail.com"
            {...form.register("email")}
            className="w-full p-3 bg-baw-input rounded-sm text-gray-900 focus:outline-none focus:border-red-400"
            required
          />
        </div>
        <div className="mb-6 font-poppins mt-10">
          <label
            className="text-black text-sm mb-2 font-poppins flex justify-between"
            htmlFor="password"
          >
            Password
            <Link href="#" className="text-sm text-gray-500 ml-4">
              Forgot Password?
            </Link>
          </label>
          <input
            type="password"
            id="password"
            placeholder="********"
            {...form.register("password")}
            className="w-full p-3 bg-baw-input rounded-sm text-gray-900 focus:outline-none focus:border-red-400"
            required
          />
        </div>
        <div className="w-full flex justify-center lg:mt-10">
          <button
            type="submit"
            className="w-full lg:w-fit lg:rounded-full bg-baw-red text-white font-bold py-3 px-7 rounded-md flex justify-center items-center hover:bg-baw-yellow"
          >
            {loading ? <ClipLoader size={17} color={"#fff"} loading={loading} className="mx-8 my-1"/> : (
              <>
                <span>SIGN IN</span>
                <span className="ml-2">➔</span>
              </>
            )}
          </button>
        </div>
      </form>
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={handleSignup}
          className="text-sm text-[#695d56] hover:text-[#4D413E] underline"
        >
          Don&apos;t have an account? Sign up
        </button>
      </div>
    </div>
  );
};

export default SignInForm;
