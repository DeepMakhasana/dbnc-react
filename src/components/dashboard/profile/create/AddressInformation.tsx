import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import useMultiStepFormContext from "@/context/multi-step-form/useMultiStepFormContext";
import { storeAddressSchema } from "./formSchema";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { getCities, getStates } from "@/api/utils";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

const AddressInformation = () => {
  const { formData, nextStep, updateFormData, prevStep } = useMultiStepFormContext();

  const { data: states, isLoading: isStateLoading } = useQuery({
    queryKey: ["state"],
    queryFn: getStates,
  });

  const form = useForm<z.infer<typeof storeAddressSchema>>({
    resolver: zodResolver(storeAddressSchema),
    defaultValues: {
      addressLine: formData.addressLine,
      stateId: formData.stateId,
      cityId: formData.cityId,
      pincode: formData.pincode,
      googleMapLink: formData.googleMapLink,
      latitude: formData.latitude,
      longitude: formData.longitude,
    },
  });
  const { watch, handleSubmit, getValues, setValue, formState, error } = form;

  const { data: cities, isLoading: isCitiesLoading } = useQuery({
    queryKey: ["city", getValues("stateId")],
    queryFn: () => getCities(getValues("stateId")),
    enabled: !!getValues("stateId"),
  });

  function onSubmit(values: z.infer<typeof storeAddressSchema>) {
    console.log(values);
    nextStep();
  }

  function setLatitudeLongitude() {
    console.log("test");
    if ("geolocation" in navigator) {
      console.log("in");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("enter");
          console.log(position.coords);
          setValue("latitude", `${position.coords.latitude}`);
          setValue("longitude", `${position.coords.longitude}`);
        },
        (error) => {
          console.error("Geolocation Error:", error.message);
          toast({
            title: "Location warning:",
            description: error.message,
            variant: "destructive",
          });
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  // Watch form changes and sync with MultiStepForm state
  useEffect(() => {
    const subscription = watch((data) => {
      updateFormData(data);
    });

    return () => subscription.unsubscribe();
  }, [watch, updateFormData]);

  // console.log(formState, error);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid lg:col-span-2 lg:gap-8">
            <Card className="py-6 shadow-md rounded-lg">
              <CardContent className="py-0 px-4 lg:px-6 grid gap-3">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="addressLine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Full address" rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>Maximum 255 characters are allow in address</FormDescription>
                    </FormItem>
                  )}
                />

                {/* state */}
                <FormField
                  control={form.control}
                  name="stateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={getValues("stateId")}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a state" />
                          </SelectTrigger>
                          <SelectContent>
                            {isStateLoading ? (
                              <SelectItem value="loading">Loading...</SelectItem>
                            ) : (
                              states?.map((state) => <SelectItem value={`${state.id}`}>{state.name}</SelectItem>)
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* city */}
                <FormField
                  control={form.control}
                  name="cityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={getValues("cityId")}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a city" />
                          </SelectTrigger>
                          <SelectContent>
                            {isCitiesLoading ? (
                              <SelectItem value="loading">Loading...</SelectItem>
                            ) : (
                              cities?.map((city) => <SelectItem value={`${city.id}`}>{city.name}</SelectItem>)
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="pincode" {...field} />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>Pincode must be 6 digit</FormDescription>
                    </FormItem>
                  )}
                />

                {/* WhatsApp Number */}
                {/* <FormField
                  control={form.control}
                  name="whatsappNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Number</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="whatsApp number" {...field} />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>WhatsApp number must be 10 digit</FormDescription>
                    </FormItem>
                  )}
                /> */}
              </CardContent>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card className="py-6 shadow-md rounded-lg">
              <CardContent className="py-0 px-4 lg:px-6 grid gap-4">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="googleMapLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Google map</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://map.google.com/cvredbjkrf" {...field} />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>Copy link from google map application</FormDescription>
                    </FormItem>
                  )}
                />

                {/* get cordinets */}
                <div className="mt-6 flex flex-col gap-4">
                  <Label>Location</Label>
                  <div className="flex gap-2 items-center cursor-pointer" onClick={setLatitudeLongitude}>
                    <Button size={"icon"} type="button">
                      <MapPin />
                    </Button>
                    <p>Set Location</p>
                  </div>
                  {getValues("latitude") && getValues("longitude") && (
                    <p>{`${getValues("latitude")}, ${getValues("longitude")}`}</p>
                  )}
                  <p className="text-sm text-zinc-500">Set location from mobile device</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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

export default AddressInformation;
