import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { StoreSecretPayload, StoreSecretResponse } from "@/types/profile";
import { createUpdateStoreSecret } from "@/api/profile";
import { ChevronLeft, Loader2 } from "lucide-react";

const FormSchema = z.object({
  pin: z
    .string()
    .regex(/^\d{4}$/, "Secret must be a 4-digit number.")
    .min(4, "Secret must be exactly 4 digits.") // Optional, but ensures length
    .max(4, "Secret must be exactly 4 digits."),
});

const StoreSecret = () => {
  const params = useParams();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const { handleSubmit, reset } = form;

  // mutation for set/change secret
  const { mutate, isPending } = useMutation<StoreSecretResponse, Error, StoreSecretPayload>({
    mutationFn: createUpdateStoreSecret,
    onSuccess: (data) => {
      //   setIsEmailVerified({ email: data.email, isVerified: false });
      toast({
        title: "Secret:",
        description: data.message,
      });
      reset();
      navigate(-1);
    },
    onError: (error: any) => {
      console.log("error", error);
      toast({
        title: "Secret error:",
        description: error?.response.data.message || error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate({ secret: data.pin, storeId: Number(params.storeId) });
  }

  console.log(params);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex gap-4 items-center">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div>
          <h1 className="text-2xl font-medium line-clamp-1">Set/change Secret</h1>
          <p className="text-sm hidden text-muted-foreground sm:block">create and update store secret</p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card className="py-6 shadow-md rounded-lg">
            <CardContent className="py-0 px-4 lg:px-6 grid gap-3">
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secret PIN</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={4} autoFocus {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>4 digit secret to perform confidential task</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="animate-spin" />}
                {isPending ? "Please wait" : "Submit"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </main>
  );
};

export default StoreSecret;
