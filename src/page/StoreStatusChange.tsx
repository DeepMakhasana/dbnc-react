import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { UpdateStoreOpenCloseStatusPayload, UpdateStoreOpenCloseStatusResponse } from "@/types/profile";
import { updateStoreOpenCloseStatus } from "@/api/profile";
import { Loader2 } from "lucide-react";

const FormSchema = z.object({
  pin: z
    .string()
    .regex(/^\d{4}$/, "Secret must be a 4-digit number.")
    .min(4, "Secret must be exactly 4 digits.") // Optional, but ensures length
    .max(4, "Secret must be exactly 4 digits."),
});

const StoreStatusChange = () => {
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
  const { mutate, isPending } = useMutation<
    UpdateStoreOpenCloseStatusResponse,
    Error,
    UpdateStoreOpenCloseStatusPayload
  >({
    mutationFn: updateStoreOpenCloseStatus,
    onSuccess: (data) => {
      reset();
      navigate(`/status-update/${data.isOpen ? "open" : "close"}?name=${encodeURI(data.name)}`, { replace: true });
    },
    onError: (error: any) => {
      console.log("error", error);
      reset();
      toast({
        title: "Secret warning:",
        description: error?.response.data.message || error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate({ secret: data.pin, storeId: Number(params.storeId) });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold">Update store status</h1>
        <div className="text-center text-sm">Enter secret for update status</div>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 flex-col">
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
                <FormDescription>4 digit secret to update status</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isPending} type="submit" className="w-full">
            {isPending && <Loader2 className="animate-spin" />}
            {isPending ? "Please wait" : "Verify"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default StoreStatusChange;
