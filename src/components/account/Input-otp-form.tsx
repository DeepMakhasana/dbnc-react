import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { useMutation } from "@tanstack/react-query";
import { IIsEmailVerify, verifyEmailPayload, verifyEmailResponse } from "@/types/auth";
import { verifyEmailOtp } from "@/api/auth";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

interface IInputOTPForm {
  isEmailVerified: IIsEmailVerify;
}

function InputOTPForm({ isEmailVerified }: IInputOTPForm) {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  // mutation for verify otp for verification
  const mutation = useMutation<verifyEmailResponse, Error, verifyEmailPayload>({
    mutationFn: verifyEmailOtp,
    onSuccess: (data) => {
      console.log("successfully verification done", data);
      toast({
        title: "OTP verification:",
        description: data.message,
      });
      if (data.isUserExist) {
        navigate("/");
      } else {
        navigate(`/account/onboard?email=${encodeURIComponent(data.email)}`);
      }
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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    mutation.mutate({ email: isEmailVerified.email, otp: data.pin, userType: "owner" });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your {isEmailVerified.email} Email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={mutation.isPending} type="submit" className="w-full">
          {mutation.isPending && <Loader2 className="animate-spin" />}
          {mutation.isPending ? "Please wait" : "Verify"}
        </Button>
      </form>
    </Form>
  );
}

export default InputOTPForm;
