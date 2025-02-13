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

const FeedbackUPIId = () => {
  const { formData, nextStep, updateFormData, prevStep } = useMultiStepFormContext();

  const form = useForm<z.infer<typeof feedbackUPIIdSchema>>({
    resolver: zodResolver(feedbackUPIIdSchema),
    defaultValues: {
      feedbackLink: formData.feedbackLink,
      upiId: formData.upiId,
    },
  });
  const { watch, handleSubmit } = form;

  function onSubmit(values: z.infer<typeof feedbackUPIIdSchema>) {
    console.log(values);
    nextStep();
  }

  // Watch form changes and sync with MultiStepForm state
  useEffect(() => {
    const subscription = watch((data) => {
      updateFormData(data);
    });

    return () => subscription.unsubscribe();
  }, [watch, updateFormData]);

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
          <Button type="button" onClick={() => prevStep()} className="px-10">
            Previous
          </Button>
          <Button type="submit" className="px-10">
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FeedbackUPIId;
