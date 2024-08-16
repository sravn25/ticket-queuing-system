import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { getQueueCount, storeQueueData } from "@/lib/queueFirestore";
import { useState } from "react";
import { Loader2, Ticket } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getCurrentDateTime } from "@/lib/utils";

const englishNameRegex = /^[A-Za-z\s,\\/]+$/;
const studentIdRegex = /^\d{7}$/;
const studentEmailRegex = /^[A-Za-z0-9._%+-]+@sd\.taylors\.edu\.my$/;
const phoneNumberRegex =
  /^\+?(\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

const formSchema = z.object({
  fullName: z.string().min(3).max(50).regex(englishNameRegex, {
    message: "Full name must contain English letters only",
  }),
  studentId: z.string().regex(studentIdRegex, {
    message: "Student ID must be 7 characters",
  }),
  studentEmail: z.string().regex(studentEmailRegex, {
    message: "Please enter a valid student email",
  }),
  personalEmail: z.string().email({
    message: "Please enter a valid email",
  }),
  phoneNumber: z.string().regex(phoneNumberRegex, {
    message: "Please enter a valid phone number",
  }),
  dateTime: z.string(),
  rank: z.number(),
  collected: z.boolean(),
});

export const QueueForm = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      studentId: "",
      studentEmail: "",
      personalEmail: "",
      phoneNumber: "",
      dateTime: getCurrentDateTime(),
      rank: 1,
      collected: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const ranking = await getQueueCount();
      values.rank = ranking + 1;
      console.log("Ranking:", ranking);
      console.log("Values ranking:", values.rank);
      await storeQueueData(values);
      toast.success("Queued for ticket successfully");
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Student ID already exist") {
          toast.error("Student ID already exists. Please use a different ID.");
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormDescription>English only</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student ID</FormLabel>
                <FormControl>
                  <Input placeholder="0362041" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="studentEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@sd.talyors.edu.my" {...field} />
                </FormControl>
                <FormDescription>
                  Please do not use personal email
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="personalEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personal Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@gmail.com" {...field} />
                </FormControl>
                <FormDescription>Use your personal email</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="0123456789" {...field} />
                </FormControl>
                <FormDescription>
                  For contact purpose if email is unreachable
                </FormDescription>
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
      <Toaster />
    </>
  );
};

export default QueueForm;
