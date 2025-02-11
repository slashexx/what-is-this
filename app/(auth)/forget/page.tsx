"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase";
import toast from "react-hot-toast";

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username required (length >2)" })
    .max(50),
  password: z
    .string()
    .min(5, { message: "Password is too short it should be of length 5" }),
});

const LoginPage = () => {
  const router = useRouter();
  const { currentUser, login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  useEffect(() => {
    if (currentUser) {
      router.push("/admin");
    }
  }, [currentUser]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await login(values.username, values.password);
    } catch (error) {
      console.log(error);
    }
    return;
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Check your email for further instructions");
      router.push("/login")
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Form {...form}>
        <form onSubmit={handlePasswordReset} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    placeholder="Email Address"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Send Email</Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
