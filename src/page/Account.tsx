import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { IIsEmailVerify, sendVerificationOtpEmailPayload, sendVerificationOtpEmailResponse } from "@/types/auth";
import { sendVerificationOtpEmail } from "@/api/auth";
import { toast } from "@/hooks/use-toast";
import InputOTPForm from "@/components/account/Input-otp-form";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .transform((val) => val.toLowerCase()),
});

const Account = () => {
  const [isEmailVerified, setIsEmailVerified] = useState<IIsEmailVerify>({ email: "", isVerified: false });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // mutation for verify otp for verification
  const { mutate, isPending } = useMutation<sendVerificationOtpEmailResponse, Error, sendVerificationOtpEmailPayload>({
    mutationFn: sendVerificationOtpEmail,
    onSuccess: (data) => {
      setIsEmailVerified({ email: data.email, isVerified: false });
      toast({
        title: "OTP verification:",
        description: data.message,
      });
    },
    onError: (error: any) => {
      console.log("error", error);
      toast({
        title: "OTP verification error:",
        description: error?.response.data.message || error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // ✅ This will be type-safe and validated.
    mutate(values);
  }

  return (
    <div className="flex flex-col gap-6">
      {isEmailVerified?.email && !isEmailVerified?.isVerified ? (
        <div className="flex flex-col gap-6">
          <InputOTPForm isEmailVerified={isEmailVerified} />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="example@gmail.com" {...field} />
                  </FormControl>
                  <FormDescription>Enter your email above to start your account</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && <Loader2 className="animate-spin" />}
              {isPending ? "Please wait" : "Submit"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default Account;
