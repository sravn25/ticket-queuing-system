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
import { useState } from "react";
import { Loader2, Ticket } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getCurrentDateTime } from "@/lib/utils";
import { useRegistration } from "@/contexts/RegistrationContext";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { timeslotLimit } from "@/lib/counterFirestore";
import { storeWaitData } from "@/lib/waitFirestore";

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
  vegetarian: z.boolean(),
  dateTime: z.string(),
  rank: z.number(),
  collectDetails: z.object({
    timeslot: z.enum(["530", "630", "730", "5", "6"], {
      message: "Timeslot is required",
    }),
    venue: z.enum(["TGH", "LT1"], { message: "Invalid venue" }),
  }),
  queuingStatus: z.enum(["queuing", "waiting", "cancelled", "collected"]),
  ticketNumber: z.string().nullable(),
});

export const WaitForm = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { counterData, refreshCounterData, timeslotData } = useRegistration();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      studentId: "",
      studentEmail: "",
      personalEmail: "",
      phoneNumber: "",
      vegetarian: false,
      dateTime: getCurrentDateTime(),
      rank: counterData?.waitingCount || 0,
      collectDetails: {
        timeslot: "5",
        venue: "LT1",
      },
      queuingStatus: "waiting",
      ticketNumber: null,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const timeslotCap = await timeslotLimit(
        values.collectDetails.venue,
        values.collectDetails.timeslot,
      );
      if (!timeslotCap) {
        throw new Error("Reached limit");
      }

      values.rank += 1;
      console.log("Values ranking:", values.rank);

      //submit
      await storeWaitData(values);
      toast.success("Joined waiting list successfully");

      await refreshCounterData();

      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Student ID already exist") {
          toast.error("Student ID already exists. Please use a different ID.");
        } else if (error.message === "Reached limit") {
          toast.error("Timeslot limit has been reached, try another timeslot");
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
          <FormField
            control={form.control}
            name="collectDetails.timeslot"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Timeslot</FormLabel>
                <FormDescription className="font-semibold">
                  Date: 19th September
                  <br />
                  Venue: Will be emailed in a first come first serve basis if
                  there are empty slots from the queuing list
                </FormDescription>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a timeslot" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="5">
                      5:00PM ({`${250 - (timeslotData?.LT1["5"].count || 0)}`}{" "}
                      slots left)
                    </SelectItem>
                    <SelectItem value="6">
                      6:00PM ({`${250 - (timeslotData?.LT1["6"].count || 0)}`}{" "}
                      slots left)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Timeslot to collect your physical ticket
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vegetarian"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vegetarian</FormLabel>
                <FormLabel className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <p>Are you vegetarian?</p>
                </FormLabel>
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

export default WaitForm;
