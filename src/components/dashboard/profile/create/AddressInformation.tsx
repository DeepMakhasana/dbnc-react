import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import useMultiStepFormContext from "@/context/multi-step-form/useMultiStepFormContext";
import { storeAddressSchema } from "./formSchema";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { getCities, getStates } from "@/api/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { ActionType, StoreAddressPayload, StoreAddressResponse } from "@/types/profile";
import { getStoreAddressById, updateStoreAddressInformation } from "@/api/profile";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader";

const AddressInformation = ({ action = ActionType.CREATE, storeId }: { action?: ActionType; storeId?: number }) => {
  const { formData, nextStep, updateFormData, prevStep } = useMultiStepFormContext();
  const navigate = useNavigate();
  const isUpdateAction = action === ActionType.UPDATE;
  const queryClient = useQueryClient();

  const { data: states, isLoading: isStateLoading } = useQuery({
    queryKey: ["state"],
    queryFn: getStates,
  });

  const form = useForm<z.infer<typeof storeAddressSchema>>({
    resolver: zodResolver(storeAddressSchema),
    defaultValues: {
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      stateId: formData.stateId,
      cityId: formData.cityId,
      pincode: formData.pincode,
      googleMapLink: formData.googleMapLink,
      latitude: formData.latitude,
      longitude: formData.longitude,
    },
  });
  const { watch, handleSubmit, getValues, setValue } = form;

  const stateId = watch("stateId");
  const { data: cities, isLoading: isCitiesLoading } = useQuery({
    queryKey: ["city", getValues("stateId")],
    queryFn: () => getCities(getValues("stateId")),
    enabled: !!stateId,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["addressInformation", { storeId }],
    queryFn: () => getStoreAddressById(Number(storeId)),
    enabled: !!storeId,
  });

  useEffect(() => {
    if (isUpdateAction && data) {
      form.reset({
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        cityId: String(data.cityId),
        stateId: String(data.stateId),
        latitude: String(data.latitude),
        longitude: String(data.longitude),
        pincode: String(data.pincode),
        googleMapLink: data.googleMapLink,
      });
    }
  }, [data, isUpdateAction, form]);

  // Effect to set the cityId only after cities are fetched
  useEffect(() => {
    if (isUpdateAction && cities && cities?.length > 0 && data?.cityId) {
      setValue("cityId", String(data.cityId));
    }
  }, [isUpdateAction, cities, data?.cityId, setValue]);

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
          toast({
            title: "Location set successfully",
          });
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

  // update mutation
  const { mutate: updateMutate, isPending: updatePending } = useMutation<
    StoreAddressResponse,
    Error,
    { payload: StoreAddressPayload; storeAddressId: string | number }
  >({
    mutationFn: updateStoreAddressInformation,
    onSuccess: (res) => {
      queryClient.setQueryData(["addressInformation", { storeId }], () => res);
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

  function onSubmit(values: z.infer<typeof storeAddressSchema>) {
    const { addressLine1, addressLine2, cityId, googleMapLink, latitude, longitude, pincode, stateId } = values;
    if (isUpdateAction && data) {
      updateMutate({
        payload: {
          addressLine1,
          addressLine2,
          cityId: Number(cityId),
          googleMapLink,
          latitude: Number(latitude),
          longitude: Number(longitude),
          pincode: Number(pincode),
          stateId: Number(stateId),
          storeId: Number(storeId),
        },
        storeAddressId: data?.id,
      });
    } else {
      nextStep();
    }
  }

  // Watch form changes and sync with MultiStepForm state
  useEffect(() => {
    if (!isUpdateAction) {
      const subscription = watch((data) => {
        updateFormData(data);
      });

      return () => subscription.unsubscribe();
    }
  }, [watch, updateFormData, isUpdateAction]);

  console.log("rerender", data);
  if (isLoading || isStateLoading || isCitiesLoading) {
    return <Loader />;
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid lg:col-span-2 lg:gap-8">
            <Card className="py-6 shadow-md rounded-lg">
              <CardContent className="py-0 px-4 lg:px-6 grid gap-3">
                {/* address */}
                <FormField
                  control={form.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shop number, building, near by/opposite</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Shop number, building, near by/opposite (only)" rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>Maximum 255 characters are allow in address</FormDescription>
                    </FormItem>
                  )}
                />

                {/* address */}
                <FormField
                  control={form.control}
                  name="addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main area, road</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Main area, road (only)" rows={3} {...field} />
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a state" />
                          </SelectTrigger>
                          <SelectContent>
                            {isStateLoading ? (
                              <SelectItem value="loading">Loading...</SelectItem>
                            ) : (
                              states?.map((state) => (
                                <SelectItem key={state.id} value={`${state.id}`}>
                                  {state.name}
                                </SelectItem>
                              ))
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a city" />
                          </SelectTrigger>
                          <SelectContent>
                            {isCitiesLoading ? (
                              <SelectItem value="loading">Loading...</SelectItem>
                            ) : (
                              cities?.map((city) => (
                                <SelectItem key={city.id} value={`${city.id}`}>
                                  {city.name}
                                </SelectItem>
                              ))
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
          <Button
            type="button"
            variant={"outline"}
            onClick={() => (isUpdateAction ? navigate(-1) : prevStep())}
            className="px-10"
          >
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

export default AddressInformation;
