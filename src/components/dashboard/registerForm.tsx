import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getCurrentDateTime } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Loader2, Ticket } from "lucide-react";
import { registerTicket } from "@/lib/registerFirestore";
import toast from "react-hot-toast";

const ticketNumberRegex = /^\d{4}$/;

const formSchema = z.object({
  ticketNumber: z.string().regex(ticketNumberRegex, {
    message: "Ticket ID must be 4 numbers",
  }),
  studentId: z.string(),
  createdAt: z.string(),
  registered: z.boolean(),
});

interface RegisterFormProps {
  studentId: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ studentId }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticketNumber: "",
      studentId: studentId,
      createdAt: getCurrentDateTime(),
      registered: false,
    },
  });

  const onRegister = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await registerTicket(values);
      toast.success("Registered ticket successfully");
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Ticket number already exist") {
          toast.error(
            "Ticket number already exists. Please use a different ticket.",
          );
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
    console.log(values);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onRegister)} className="space-y-8">
          <FormField
            control={form.control}
            name="ticketNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ticket ID</FormLabel>
                <FormControl>
                  <Input placeholder="0001" {...field} />
                </FormControl>
                <FormDescription>Ticket ID</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <Ticket className="h-4 w-4 mr-2" />
                Register
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
