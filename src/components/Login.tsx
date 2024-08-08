import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, LogIn } from "lucide-react";

const formSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters",
    })
    .max(50),
  password: z.string().min(2, {
    message: "Password",
  }),
});

const Login = () => {
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();

  if (currentUser) navigate("/dashboard");

  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      navigate("/dashboard");
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error("Login failed!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center p-16 gap-8">
        <h1 className="text-4xl font-bold">Login to Dashboard</h1>
        <p className="text-slate-500">
          Please look for Victor if you don't have the login credentials
        </p>
        <div className="border p-8 rounded-md shadow hover:shadow-lg min-w-96">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl className="relative">
                      <Input placeholder="****" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default Login;
