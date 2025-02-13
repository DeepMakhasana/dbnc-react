import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { categoryServiceSchema } from "./formSchema";
import useMultiStepFormContext from "@/context/multi-step-form/useMultiStepFormContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2, Plus, X } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addService, getCategory, getServices, getSuggestProfileBio, getSuggestServicesByCategory } from "@/api/utils";
import { AddServicePayload, AddServiceResponse, SuggestBioPayload, SuggestBioResponse } from "@/types/utils";

const CategoryServices = () => {
  const { formData, nextStep, updateFormData, prevStep } = useMultiStepFormContext();
  const [searchService, setSearchService] = useState("");
  const [selectedService, setSelectedService] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof categoryServiceSchema>>({
    resolver: zodResolver(categoryServiceSchema),
    defaultValues: {
      categoryId: formData.categoryId,
      services: formData.services,
      bio: formData.bio,
    },
  });
  const { watch, handleSubmit, getValues } = form;

  // get all category
  const { data: category, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["category"],
    queryFn: getCategory,
  });

  // get services by category
  const { data: services, isLoading: isServicesLoading } = useQuery({
    queryKey: ["services", getValues("categoryId")],
    queryFn: () => getServices(getValues("categoryId")),
    enabled: !!getValues("categoryId"),
  });

  useEffect(() => {
    if (services && services?.length > 0) {
      const selectServices = services.filter((s) => formData.services.includes(String(s.id))).map((s) => s.name);
      setSelectedService(selectServices);
    }
  }, [services, formData.services]);

  // get suggest services by category
  const { data: suggestServices, isLoading: isSuggestServicesLoading } = useQuery({
    queryKey: ["suggestServices", getValues("categoryId")],
    queryFn: () =>
      getSuggestServicesByCategory({
        name: formData.name,
        categoryId: getValues("categoryId"),
      }),
    enabled: !!getValues("categoryId") && !!services,
  });

  // add service mutation
  const { mutate: addServiceMutation, isPending: isAddServicesPending } = useMutation<
    AddServiceResponse,
    Error,
    AddServicePayload
  >({
    mutationFn: addService,
    onSuccess: (data) => {
      console.log("service add", data);
      setSelectedService((pre: string[]) => [...pre, data.name]);
      form.setValue("services", [...getValues("services"), String(data.id)]);
      queryClient.setQueryData(["services", getValues("categoryId")], (oldData: any) => [...oldData, data]);
    },
    onError: (error: any) => {
      console.log("error", error);
    },
  });

  // suggest bio mutation
  const { mutate: suggestBioMutation, isPending: isSuggestBioPending } = useMutation<
    SuggestBioResponse,
    Error,
    SuggestBioPayload
  >({
    mutationFn: getSuggestProfileBio,
    onSuccess: (data) => {
      console.log("bio", data);
      form.setValue("bio", data.bio);
    },
    onError: (error: any) => {
      console.log("error", error);
    },
  });

  function onSubmit(values: z.infer<typeof categoryServiceSchema>) {
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
            {/* category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Business category</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "sm:w-[400px] w-[220px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? category?.find((category) => String(category.id) === field.value)?.name
                            : "Select Business category"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="sm:w-[400px] w-[220px] p-0">
                      <Command>
                        <CommandInput placeholder="Search category..." />
                        <CommandList>
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {isCategoryLoading && (
                              <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin" /> Loading...
                              </div>
                            )}
                            {category?.map((category) => (
                              <CommandItem
                                value={category.name}
                                key={category.id}
                                onSelect={() => {
                                  form.setValue("categoryId", String(category.id));
                                }}
                              >
                                {category.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    String(category.id) === field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Take the best category for your business.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Services */}
            <FormField
              control={form.control}
              name="services"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="flex gap-4">
                    Services
                    {isAddServicesPending && (
                      <div className="flex items-center gap-2 text-zinc-700">
                        <Loader2 className="animate-spin w-4 h-4" /> Adding...
                      </div>
                    )}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          className={`h-auto flex gap-2 flex-wrap ${
                            field.value.length > 0 ? "justify-start" : "justify-between text-muted-foreground"
                          }`}
                        >
                          {field.value.length > 0
                            ? services
                                ?.filter((service) => field.value.includes(String(service.id)))
                                ?.map((selectedService) => (
                                  <div
                                    key={selectedService.id}
                                    className="flex items-center justify-start gap-3 border rounded py-2 px-4"
                                  >
                                    <span className="line-clamp-1 max-w-36 sm:max-w-fit">{selectedService.name}</span>
                                    <div
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const updateSelectedValues = field.value.filter(
                                          (id) => id !== String(selectedService.id)
                                        );
                                        form.setValue("services", updateSelectedValues);
                                      }}
                                    >
                                      <X />
                                    </div>
                                  </div>
                                ))
                            : "Select Services"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="sm:w-[400px] w-full p-0">
                      <Command className="h-60">
                        <CommandInput onValueChange={(e) => setSearchService(e)} placeholder="Search services..." />
                        {searchService && (
                          <CommandItem value={searchService} className="cursor-pointer text-zinc-700">
                            {searchService} <Plus className="ml-auto mr-1 cursor-pointer" />
                          </CommandItem>
                        )}
                        <CommandList>
                          <CommandEmpty>No services found.</CommandEmpty>
                          <CommandGroup>
                            {isServicesLoading && (
                              <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin" /> Loading...
                              </div>
                            )}
                            {services?.map((service) => (
                              <CommandItem
                                value={service.name}
                                key={service.id}
                                onSelect={() => {
                                  setSelectedService((pre: string[]) => [...pre, service.name]);
                                  form.setValue("services", [...field.value, String(service.id)]);
                                }}
                              >
                                {service.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    field.value.includes(String(service.id)) ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                            {isSuggestServicesLoading && (
                              <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin" /> Loading...
                              </div>
                            )}
                            {suggestServices
                              ?.filter((service) => !selectedService.includes(service))
                              ?.map((suggestService) => (
                                <CommandItem
                                  key={suggestService}
                                  value={suggestService}
                                  className="cursor-pointer text-zinc-700"
                                  onSelect={() =>
                                    addServiceMutation({
                                      name: suggestService,
                                      categoryId: Number(getValues("categoryId")),
                                    })
                                  }
                                >
                                  {suggestService} <Plus className="ml-auto mr-1 cursor-pointer" />
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Select relevant services which you offer in business.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        isSuggestBioPending ? "Generating..." : "Generate or write bio with in 180 character"
                      }
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    disabled={isSuggestBioPending}
                    size={"sm"}
                    variant={"outline"}
                    onClick={() =>
                      suggestBioMutation({
                        name: formData.name,
                        cityId: formData.cityId,
                        categoryId: formData.categoryId,
                        services: selectedService,
                      })
                    }
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    {isSuggestBioPending && <Loader2 className="animate-spin w-4 h-4" />}Generate
                  </Button>
                  <FormMessage />
                  <FormDescription>Maximum 180 characters are allow in bio</FormDescription>
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

export default CategoryServices;
