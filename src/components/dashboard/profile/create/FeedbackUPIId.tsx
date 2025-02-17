import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { feedbackUPIIdSchema } from "./formSchema";
import useMultiStepFormContext from "@/context/multi-step-form/useMultiStepFormContext";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ActionType, StoreFeedbackUpiUpdatePayload, StoreUpdateResponse } from "@/types/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStoreFeedbackUpiById, updateStoreFeedbackUpi } from "@/api/profile";
import Loader from "../../Loader";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const FeedbackUPIId = ({ action = ActionType.CREATE, storeId }: { action?: ActionType; storeId?: number }) => {
  const { formData, nextStep, updateFormData, prevStep } = useMultiStepFormContext();
  const navigate = useNavigate();
  const isUpdateAction = action === ActionType.UPDATE;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["feedbackUpi", { storeId }],
    queryFn: () => getStoreFeedbackUpiById(Number(storeId)),
    enabled: !!storeId,
  });

  const form = useForm<z.infer<typeof feedbackUPIIdSchema>>({
    resolver: zodResolver(feedbackUPIIdSchema),
    defaultValues: {
      feedbackLink: formData.feedbackLink,
      upiId: formData.upiId,
    },
  });
  const { watch, handleSubmit } = form;

  // update mutation
  const { mutate: updateMutate, isPending: updatePending } = useMutation<
    StoreUpdateResponse,
    Error,
    { payload: StoreFeedbackUpiUpdatePayload; storeId: string | number }
  >({
    mutationFn: updateStoreFeedbackUpi,
    onSuccess: (res) => {
      queryClient.setQueryData(["feedbackUpi", { storeId }], () => ({
        feedbackLink: res.feedbackLink,
        upiId: res.upiId,
      }));
      toast({
        title: "Updated successfully",
      });
    },
    onError: (error: any) => {
      console.log("request fail: ", error);
      toast({
        title: "Update warning:",
        description: error?.response.data.message || error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof feedbackUPIIdSchema>) {
    if (isUpdateAction) {
      updateMutate({ payload: values, storeId: Number(storeId) });
    } else {
      nextStep();
    }
  }

  useEffect(() => {
    if (isUpdateAction && data?.feedbackLink && data.upiId) {
      form.reset({
        feedbackLink: data.feedbackLink,
        upiId: data.upiId,
      });
    }
  }, [data, isUpdateAction, form]);

  // Watch form changes and sync with MultiStepForm state
  useEffect(() => {
    if (!isUpdateAction) {
      const subscription = watch((data) => {
        updateFormData(data);
      });

      return () => subscription.unsubscribe();
    }
  }, [watch, updateFormData, isUpdateAction]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card className="py-6 shadow-md rounded-lg">
          <CardContent className="py-0 px-4 lg:px-6 grid gap-3">
            {/* feedback */}
            <FormField
              control={form.control}
              name="feedbackLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Feedback URL <span className="text-zinc-500 font-normal">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="Google business feedback url" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Get URL from search business on google using register google business gmail copy "Get more review"
                  </FormDescription>
                </FormItem>
              )}
            />
            {/* feedback */}
            <FormField
              control={form.control}
              name="upiId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    UPI Id <span className="text-zinc-500 font-normal">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="example@okaxis" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>Get UPI Id from any payment application</FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        {/* Submit Button */}
        <div className="flex gap-4">
          <Button type="button" onClick={() => (isUpdateAction ? navigate(-1) : prevStep())} className="px-10">
            {isUpdateAction ? "Cancel" : "Previous"}
          </Button>
          <Button type="submit" className="px-10">
            {updatePending && <Loader2 className="animate-spin" />}
            {isUpdateAction && !updatePending && "Update"}
            {!isUpdateAction && "Next"}
            {updatePending && "Updating..."}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FeedbackUPIId;
