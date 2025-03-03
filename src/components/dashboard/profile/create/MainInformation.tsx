import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import useMultiStepFormContext from "@/context/multi-step-form/useMultiStepFormContext";
import {
  deleteObject,
  IImageUploadPayload,
  imageUpload,
  IS3DeleteObjectPayload,
  IS3DeleteObjectResponse,
  IS3PutObjectPayload,
  IS3PutObjectResponse,
  putObjectPresignedUrl,
} from "@/api/s3";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import useAuthContext from "@/context/auth/useAuthContext";
import { createSlug, validateImageSize } from "@/lib/utils";
import { Loader2, Trash } from "lucide-react";
import { imageBaseUrl } from "@/lib/constants";
import { mainInformationSchema } from "./formSchema";
import {
  ActionType,
  StoreByIdForUpdateResponse,
  StoreMainDetailUpdatePayload,
  StoreUpdateResponse,
} from "@/types/profile";
import { getStoreByIdForUpdate, updateStoreMainInformation } from "@/api/profile";
import Loader from "../../Loader";
import { useNavigate } from "react-router-dom";

const MainInformation = ({ action = ActionType.CREATE, storeId }: { action?: ActionType; storeId?: number }) => {
  const { formData, nextStep, updateFormData } = useMultiStepFormContext();
  const { user } = useAuthContext();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [logoUploadKey, setLogoUploadKey] = useState<string | null>(null);
  const navigate = useNavigate();
  const isUpdateAction = action === ActionType.UPDATE;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["mainInformation", { storeId }],
    queryFn: () => getStoreByIdForUpdate(Number(storeId)),
    enabled: !!storeId,
  });

  // generate presigned URL for file upload mutation
  const { mutate: imagePresignedURLPutObjetMutate, isPending: isPendingPresignedURL } = useMutation<
    IS3PutObjectResponse,
    Error,
    IS3PutObjectPayload
  >({
    mutationKey: ["generatePresignedURL"],
    mutationFn: putObjectPresignedUrl,
    onSuccess: (res) => {
      imageUploadToS3tMutate({
        url: res.url,
        payload: {
          file: file as File,
          fileType: file?.type as string,
        },
      });
    },
    onError: (error: any) => {
      console.log("request fail: ", error);
      toast({
        title: "Image upload error:",
        description: error?.response.data.message || error.message,
        variant: "destructive",
      });
    },
  });

  // upload file in s3 mutation
  const { mutate: imageUploadToS3tMutate, isPending: isPendingImageUpload } = useMutation<
    any,
    Error,
    IImageUploadPayload
  >({
    mutationKey: ["logoUpload"],
    mutationFn: imageUpload,
    onSuccess: (res) => {
      console.log("file upload status: ", res);
      if (logoUploadKey) {
        setValue("logo", logoUploadKey);
        setPreview(null);
        setFile(null);
      }
    },
    onError: (error: any) => {
      console.log("request fail: ", error);
      toast({
        title: "Image upload error:",
        description: error?.response.data.message || error.message,
        variant: "destructive",
      });
    },
  });

  // delete file in s3 mutation
  const { mutate: imageDeleteToS3tMutate, isPending: isPendingImageDelete } = useMutation<
    IS3DeleteObjectResponse,
    Error,
    IS3DeleteObjectPayload
  >({
    mutationKey: ["logoDelete"],
    mutationFn: deleteObject,
    onSuccess: (res) => {
      console.log("file delete status: ", res);
      setValue("logo", "");
    },
    onError: (error: any) => {
      console.log("request fail: ", error);
      toast({
        title: "Image delete error:",
        description: error?.response.data.message || error.message,
        variant: "destructive",
      });
    },
  });

  // update mutation
  const { mutate: updateMutate, isPending: updatePending } = useMutation<
    StoreUpdateResponse,
    Error,
    { payload: StoreMainDetailUpdatePayload; storeId: string | number }
  >({
    mutationFn: updateStoreMainInformation,
    onSuccess: (res) => {
      queryClient.setQueryData(["mainInformation", { storeId }], (old: StoreByIdForUpdateResponse) => ({
        name: res.name,
        number: res.number,
        id: old.id,
        email: res.email,
        slug: res.slug,
        tagline: res.tagline,
        logo: res.logo,
        whatsappNumber: res.whatsappNumber,
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

  const form = useForm<z.infer<typeof mainInformationSchema>>({
    resolver: zodResolver(mainInformationSchema),
    defaultValues: {
      name: formData.name,
      slug: formData.slug,
      tagline: formData.tagline,
      number: formData.number,
      whatsappNumber: formData.whatsappNumber,
      email: formData.email,
      logo: formData.logo,
    },
  });
  const { setValue, watch, handleSubmit, getValues } = form;

  // Auto-generate slug from name
  const nameValue = watch("name");
  useEffect(() => {
    if (nameValue) {
      const slug = createSlug(nameValue);
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [nameValue, setValue]);

  // Watch form changes and sync with MultiStepForm state
  useEffect(() => {
    if (!isUpdateAction) {
      const subscription = watch((data) => {
        updateFormData(data);
      });

      return () => subscription.unsubscribe();
    }
  }, [watch, updateFormData, isUpdateAction]);

  // Handle Image Upload
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));

      // Proceed with valid data
      if (!validateImageSize(selectedFile?.size as number)) {
        toast({
          title: "Image upload warning:",
          description: "Invalid file size, size must be less then 2 MB.",
          variant: "destructive",
        });
      } else {
        // generate presigned-url
        const type = `${selectedFile?.type}`.split("/");
        const updateFileName = `${user?.id}/logo-${Date.now()}.${type[1]}`;
        setLogoUploadKey(updateFileName);
        imagePresignedURLPutObjetMutate({ fileName: updateFileName, fileType: selectedFile.type });
      }
    }
  };

  function onSubmit(values: z.infer<typeof mainInformationSchema>) {
    const { name, email, logo, number, tagline, whatsappNumber } = values;
    if (!isUpdateAction) {
      nextStep();
    } else {
      updateMutate({ payload: { name, email, logo, number, tagline, whatsappNumber }, storeId: Number(storeId) });
    }
  }

  function onImageDelete() {
    imageDeleteToS3tMutate({ key: getValues("logo") });
  }

  useEffect(() => {
    if (isUpdateAction && data) {
      setValue("name", data.name);
      setValue("email", data.email);
      setValue("tagline", data.tagline);
      setValue("slug", data.slug);
      setValue("logo", data.logo);
      setValue("number", data.number);
      setValue("whatsappNumber", data.whatsappNumber);
      setLogoUploadKey(data.logo);
    }
  }, [action, data, isUpdateAction, setValue]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid lg:col-span-2 lg:gap-8">
            <Card className="py-6 shadow-md rounded-lg">
              <CardContent className="py-0 px-4 lg:px-6 grid gap-3">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Business name" {...field} />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>Maximum 40 characters are allow</FormDescription>
                    </FormItem>
                  )}
                />

                {/* Slug (Read-Only) */}
                {/* {!isUpdateAction && (
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="slug" disabled {...field} readOnly />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )} */}

                {/* Tagline */}
                <FormField
                  control={form.control}
                  name="tagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tagline</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="tagline" {...field} />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>Maximum 70 characters are allow</FormDescription>
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>Number must be 10 digit</FormDescription>
                    </FormItem>
                  )}
                />

                {/* WhatsApp Number */}
                <FormField
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="example@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>Email must be valid address</FormDescription>
                    </FormItem>
                  )}
                />
                {/* Logo Upload */}
                {getValues().logo ? (
                  <div className="flex gap-4 items-center">
                    <img
                      src={`${imageBaseUrl}${getValues().logo}`}
                      alt="Preview"
                      className="mt-2 w-24 h-24 rounded-md object-contain"
                    />
                    <Button
                      type="button"
                      disabled={isPendingImageDelete}
                      variant={"outline"}
                      size={"icon"}
                      onClick={onImageDelete}
                    >
                      {isPendingImageDelete ? <Loader2 className="animate-spin" /> : <Trash />}
                    </Button>
                  </div>
                ) : (
                  <FormItem>
                    <FormLabel>Logo or Store Front Photo</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={handleImageChange} />
                    </FormControl>
                    {preview && (
                      <img src={preview} alt="Preview" className="mt-2 w-24 h-24 rounded-md object-contain" />
                    )}
                    {(isPendingPresignedURL || isPendingImageUpload) && (
                      <div className="flex gap-3 items-center">
                        <Loader2 className="animate-spin" /> <span className="text-sm">Uploading...</span>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Submit Button */}
        <div className="flex gap-4">
          {isUpdateAction && (
            <Button type="button" variant={"outline"} onClick={() => navigate(-1)} className="px-10">
              Cancel
            </Button>
          )}
          {updatePending ? (
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

export default MainInformation;
