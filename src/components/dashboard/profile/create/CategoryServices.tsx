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
import {
  addCategory,
  addService,
  getCategory,
  getServices,
  getSuggestProfileBio,
  getSuggestServicesByCategory,
} from "@/api/utils";
import {
  AddCategoryPayload,
  AddCategoryResponse,
  AddServicePayload,
  AddServiceResponse,
  SuggestBioPayload,
  SuggestBioResponse,
} from "@/types/utils";
import {
  ActionType,
  DeleteStoreServicesPayload,
  DeleteStoreServicesResponse,
  StoreCategoryBioUpdatePayload,
  StoreServicePayload,
  StoreServiceResponse,
  StoreUpdateResponse,
} from "@/types/profile";
import { useNavigate } from "react-router-dom";
import {
  createStoreService,
  deleteStoreServices,
  getStoreCategoryBioById,
  getStoreServicesById,
  updateStoreCategoryBio,
} from "@/api/profile";
import Loader from "../../Loader";
import { toast } from "@/hooks/use-toast";

const CategoryServices = ({ action = ActionType.CREATE, storeId }: { action?: ActionType; storeId?: number }) => {
  const { formData, nextStep, updateFormData, prevStep } = useMultiStepFormContext();
  const [searchService, setSearchService] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [selectedService, setSelectedService] = useState<string[]>([]);
  const [displaySelectedService, setDisplaySelectedService] = useState<{ id: number; name: string }[]>([]);
  const [deletedService, setDeletedService] = useState<number[]>([]);
  const [addServices, setAddServices] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isUpdateAction = action === ActionType.UPDATE;

  const { data, isLoading } = useQuery({
    queryKey: ["categoryBio", { storeId }],
    queryFn: () => getStoreCategoryBioById(Number(storeId)),
    enabled: !!storeId,
  });

  const { data: createdServices, isLoading: createdServicesIsLoading } = useQuery({
    queryKey: ["createdServices", { storeId }],
    queryFn: () => getStoreServicesById(Number(storeId)),
    enabled: !!storeId,
  });

  const form = useForm<z.infer<typeof categoryServiceSchema>>({
    resolver: zodResolver(categoryServiceSchema),
    defaultValues: {
      categoryId: formData.categoryId,
      services: formData.services,
      bio: formData.bio,
    },
  });
  const { watch, handleSubmit, getValues, reset } = form;

  // get all category
  const { data: category, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["category"],
    queryFn: getCategory,
  });

  const onChangeCategory = watch("categoryId");
  // get services by category
  const { data: services, isLoading: isServicesLoading } = useQuery({
    queryKey: ["services", getValues("categoryId")],
    queryFn: () => getServices(getValues("categoryId")),
    enabled: !!onChangeCategory,
  });

  useEffect(() => {
    if (services && services?.length > 0 && !isUpdateAction) {
      const oldSelectServicesArray = services.filter((s) => getValues("services").includes(String(s.id)));
      const onlySelectedServiceNameArray = oldSelectServicesArray.map((s) => s.name);
      setSelectedService(onlySelectedServiceNameArray);
      setDisplaySelectedService(oldSelectServicesArray);
    }
  }, [services, getValues, isUpdateAction]);

  // get suggest services by category
  const { data: suggestServices, isLoading: isSuggestServicesLoading } = useQuery({
    queryKey: ["suggestServices", getValues("categoryId")],
    queryFn: () =>
      getSuggestServicesByCategory({
        name: isUpdateAction ? data?.name || "" : formData.name,
        categoryId: getValues("categoryId"),
      }),
    enabled: !!getValues("categoryId") && !!services,
  });

  // add category mutation
  const { mutate: addCategoryMutation, isPending: isAddCategoryPending } = useMutation<
    AddCategoryResponse,
    Error,
    AddCategoryPayload
  >({
    mutationFn: addCategory,
    onSuccess: (data) => {
      console.log("service add", data);
      form.setValue("categoryId", String(data.id));
      queryClient.setQueryData(["category"], (oldData: any) => [...oldData, data]);
      setSearchCategory("");
    },
    onError: (error: any) => {
      console.log("error", error);
    },
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
      setDisplaySelectedService((pre) => [...pre, data]);
      form.setValue("services", [...getValues("services"), String(data.id)]);
      if (isUpdateAction) {
        setAddServices((pre) => [...pre, data.id]);
      }
      queryClient.setQueryData(["services", getValues("categoryId")], (oldData: any) => [...oldData, data]);
      setSearchService("");
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

  // update category and bio mutation
  const { mutate: updateCategoryBioMutation, isPending: isUpdateCategoryBioPending } = useMutation<
    StoreUpdateResponse,
    Error,
    { payload: StoreCategoryBioUpdatePayload; storeId: string | number }
  >({
    mutationFn: updateStoreCategoryBio,
    onSuccess: () => {
      toast({
        title: "Updated successfully",
      });
    },
    onError: (error: any) => {
      console.log("error", error);
    },
  });

  // update category and bio mutation
  const { mutate: deleteStoreServicesMutation, isPending: isDeleteStoreServicesPending } = useMutation<
    DeleteStoreServicesResponse,
    Error,
    DeleteStoreServicesPayload
  >({
    mutationFn: deleteStoreServices,
    onSuccess: (data) => {
      console.log("deleted", data.message);
      queryClient.setQueryData(["createdServices", { storeId }], (oldData: StoreServiceResponse[]) =>
        oldData.filter((s) => !deletedService.includes(s.id))
      );
      toast({
        title: "Updated successfully",
      });
    },
    onError: (error: any) => {
      console.log("error", error);
    },
  });

  // mutation for create store services
  const { mutate: createStoreServiceMutation, isPending: createStoreServicePending } = useMutation<
    StoreServiceResponse[],
    Error,
    StoreServicePayload[]
  >({
    mutationFn: createStoreService,
    onSuccess: (data) => {
      console.log("successfully create store service", data);
      queryClient.setQueryData(["createdServices", { storeId }], (oldData: StoreServiceResponse[]) => [
        ...oldData,
        ...data,
      ]);
      toast({
        title: "Updated successfully",
      });
    },
    onError: (error: any) => {
      console.log("error", error);
      toast({
        title: "Create store service error:",
        description: error?.response.data.message || error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof categoryServiceSchema>) {
    if (isUpdateAction) {
      console.log(values);
      updateCategoryBioMutation({
        payload: { categoryId: Number(values.categoryId), bio: values.bio },
        storeId: Number(storeId),
      });
      if (deletedService.length > 0) {
        deleteStoreServicesMutation(deletedService);
      }
      if (addServices?.length > 0) {
        const prevLen = createdServices?.length || 1 - deletedService.length;
        createStoreServiceMutation(
          addServices.map((service, i) => ({
            index: i + prevLen,
            serviceId: Number(service),
            storeId: Number(storeId),
          }))
        );
      }
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

  useEffect(() => {
    if (isUpdateAction && data && createdServices) {
      reset({
        categoryId: String(data.category.id),
        services: createdServices.map((s) => String(s.serviceId)),
        bio: data.bio,
      });
      setSelectedService(createdServices.map((s) => s.service.name));
      setDisplaySelectedService(createdServices.map((s) => ({ id: s.serviceId, name: s.service.name })));
    }
  }, [action, data, isUpdateAction, reset, createdServices]);

  if (isLoading || createdServicesIsLoading) {
    return <Loader />;
  }

  console.log("display", selectedService);

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
                  <FormLabel className="flex gap-4">
                    Business category
                    {isAddCategoryPending && (
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
                          className={cn("sm:w-[400px] w-full justify-between", !field.value && "text-muted-foreground")}
                        >
                          {field.value
                            ? category?.find((category) => String(category.id) === field.value)?.name
                            : "Select Business category"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="sm:w-[400px] w-full p-0">
                      <Command>
                        <CommandInput
                          onValueChange={(e) => setSearchCategory(e)}
                          value={searchCategory}
                          placeholder="Search category..."
                        />
                        {searchCategory && (
                          <CommandItem
                            value={searchCategory}
                            className="cursor-pointer text-zinc-700"
                            onSelect={() => {
                              addCategoryMutation({
                                name: searchCategory,
                              });
                            }}
                          >
                            {searchCategory} <Plus className="ml-auto mr-1 cursor-pointer" />
                          </CommandItem>
                        )}
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
                          {field.value.length > 0 && displaySelectedService.length > 0
                            ? displaySelectedService.map((s) => (
                                <div
                                  key={s.id}
                                  className="flex items-center justify-start gap-3 border rounded py-2 px-4"
                                >
                                  <span className="line-clamp-1 max-w-36 sm:max-w-fit">{s.name}</span>
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const updateSelectedValues = field.value.filter((id) => id !== String(s.id));
                                      form.setValue("services", updateSelectedValues);
                                      setDisplaySelectedService((prev) => prev.filter((ds) => ds.id != s.id));
                                      if (isUpdateAction) {
                                        const isExist = createdServices?.find((cs) => cs.serviceId === s.id);
                                        if (isExist) setDeletedService((pre) => [...pre, isExist.id]);
                                      }
                                    }}
                                  >
                                    <X />
                                  </div>
                                </div>
                              ))
                            : "Select Services"}
                          {/* {field.value.length > 0 &&
                            isUpdateAction &&
                            data?.category.id != Number(getValues("categoryId")) &&
                            services &&
                            createdServices &&
                            [...services, ...createdServices.map((s) => ({ id: s.serviceId, name: s.service.name }))]
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
                                      if (isUpdateAction) {
                                        const isExist = createdServices?.find(
                                          (s) => s.serviceId === selectedService.id
                                        );
                                        if (isExist) setDeletedService((pre) => [...pre, isExist.id]);
                                      }
                                    }}
                                  >
                                    <X />
                                  </div>
                                </div>
                              ))}
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
                                        if (isUpdateAction) {
                                          const isExist = createdServices?.find(
                                            (s) => s.serviceId === selectedService.id
                                          );
                                          if (isExist) setDeletedService((pre) => [...pre, isExist.id]);
                                        }
                                      }}
                                    >
                                      <X />
                                    </div>
                                  </div>
                                ))
                            : "Select Services"} */}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="sm:w-[400px] w-full p-0">
                      <Command className="h-60">
                        <CommandInput
                          onValueChange={(e) => setSearchService(e)}
                          value={searchService}
                          placeholder="Search services..."
                        />
                        {searchService && (
                          <CommandItem
                            value={searchService}
                            className="cursor-pointer text-zinc-700"
                            onSelect={() => {
                              addServiceMutation({
                                name: searchService,
                                categoryId: Number(getValues("categoryId")),
                              });
                            }}
                          >
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
                            {displaySelectedService.map((service) => (
                              <CommandItem
                                value={service.name}
                                key={service.id}
                                onSelect={() => {
                                  if (!field.value.includes(String(service.id))) {
                                    setSelectedService((pre: string[]) => [...pre, service.name]);
                                    setDisplaySelectedService((pre) => [...pre, service]);
                                    form.setValue("services", [...field.value, String(service.id)]);
                                    if (isUpdateAction) {
                                      setAddServices((pre) => [...pre, service.id]);
                                    }
                                  }
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
                            {services
                              ?.filter((s) => !displaySelectedService.some((i) => i.id === s.id))
                              .map((service) => (
                                <CommandItem
                                  value={service.name}
                                  key={service.id}
                                  onSelect={() => {
                                    if (!field.value.includes(String(service.id))) {
                                      setSelectedService((pre: string[]) => [...pre, service.name]);
                                      setDisplaySelectedService((pre) => [...pre, service]);
                                      form.setValue("services", [...field.value, String(service.id)]);
                                      if (isUpdateAction) {
                                        setAddServices((pre) => [...pre, service.id]);
                                      }
                                    }
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
                        name: isUpdateAction ? String(data?.name) : formData.name,
                        cityId: isUpdateAction ? String(data?.storeAddresses.cityId) : formData.cityId,
                        categoryId: isUpdateAction ? getValues("categoryId") : formData.categoryId,
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
          <Button
            type="button"
            variant={"outline"}
            onClick={() => (isUpdateAction ? navigate(-1) : prevStep())}
            className="px-10"
          >
            {isUpdateAction ? "Cancel" : "Previous"}
          </Button>
          {createStoreServicePending || isDeleteStoreServicesPending || isUpdateCategoryBioPending ? (
            <Button type="button" disabled className="px-10">
              <Loader2 className="animate-spin" /> Updating...
            </Button>
          ) : (
            <Button type="submit" className="px-10">
              {isUpdateAction ? "Update" : "Next"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default CategoryServices;
