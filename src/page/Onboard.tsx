import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { storeOwnerUserOnboard } from "@/api/auth";
import { storeOwnerUserOnboardPayload, storeOwnerUserOnboardResponse } from "@/types/auth";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import useAuthContext from "@/context/auth/useAuthContext";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name require minimum 2 characters")
    .max(30, "First Name cannot exceed 30 characters"),
  lastName: z
    .string()
    .min(2, "Last name require minimum 2 characters")
    .max(30, "Last Name cannot exceed 30 characters"),
  number: z
    .string()
    .length(10, { message: "Mobile number must be exactly 10 digits" })
    .regex(/^\d+$/, { message: "Mobile number must contain only digits" }),
});

const Onboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const email = searchParams.get("email");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      number: "",
    },
  });

  // mutation for verify otp for verification
  const { mutate, isPending } = useMutation<storeOwnerUserOnboardResponse, Error, storeOwnerUserOnboardPayload>({
    mutationFn: storeOwnerUserOnboard,
    onSuccess: (data) => {
      console.log("successfully verification done", data);
      toast({
        title: "Onboarding:",
        description: "Register successfully",
      });
      login(data.token);
      navigate("/");
    },
    onError: (error: any) => {
      console.log("error", error);
      toast({
        title: "Onboarding Warning:",
        description: error?.response.data.message || error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // ✅ This will be type-safe and validated.
    console.log(values);
    if (email) {
      const payload = {
        email,
        name: `${values.firstName} ${values.lastName}`,
        number: values.number,
      };
      mutate(payload);
    } else {
      toast({
        title: "Warning:",
        description: "Some thing wrong with email in url.",
        variant: "destructive",
      });
    }
  }
  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="surname" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid gap-2 mb-4">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile number</FormLabel>
                  <FormControl>
                    <Input placeholder="Mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="animate-spin" />}
            {isPending ? "Please wait" : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Onboard;
