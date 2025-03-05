import { FormEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import useMultiStepFormContext from "@/context/multi-step-form/useMultiStepFormContext";
import { createSlug, generateUniqueId } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IS3PutMultipleObjectPayload, IS3PutMultipleObjectResponse, putMultipleObjectPresignedUrl } from "@/api/s3";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import useAuthContext from "@/context/auth/useAuthContext";
import { imageBaseUrl } from "@/lib/constants";
import {
  createStore,
  createStoreAddress,
  createStoreLinks,
  createStorePhotos,
  createStoreService,
  deleteStorePhoto,
  getStorePhotosById,
} from "@/api/profile";
import {
  ActionType,
  StoreAddressPayload,
  StoreAddressResponse,
  StoreLinksPayload,
  StoreLinksResponse,
  StorePayload,
  StorePhotos,
  StorePhotosPayload,
  StorePhotosResponse,
  StoreResponse,
  StoreServicePayload,
  StoreServiceResponse,
} from "@/types/profile";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader";

const Photos = ({ action = ActionType.CREATE, storeId }: { action?: ActionType; storeId?: number }) => {
  const { user } = useAuthContext();
  const { formData, updateFormData, prevStep, clearFormData } = useMultiStepFormContext();
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input
  const [uploadProgress, setUploadProgress] = useState<{ uploaded: number; total: number }>({ uploaded: 0, total: 0 });
  const [uploadImages, setUploadImages] = useState<string[]>([]);
  const navigate = useNavigate();
  const isUpdateAction = action === ActionType.UPDATE;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["photos", { storeId }],
    queryFn: () => getStorePhotosById(Number(storeId)),
    enabled: !!storeId,
  });

  const uploadFilesToS3 = async (payload: IS3PutMultipleObjectResponse[]) => {
    let uploadedCount = 0;
    const totalFiles = images.length;

    const uploadPromises = images.map((file, index) => {
      return axios
        .put(payload[index].url, file.file, {
          headers: { "Content-Type": file.file.type },
        })
        .then((data) => {
          setUploadProgress({ uploaded: (uploadedCount += 1), total: totalFiles });
          return data;
        })
        .catch((error) => {
          toast({
            title: "Image Upload error:",
            description: error?.response.data.message || error.message,
            variant: "destructive",
          });
        });
    });

    return Promise.all(uploadPromises);
  };

  // mutation for verify otp for verification
  const { mutate: uploadUrlMutation, isPending: uploadUrlPending } = useMutation<
    IS3PutMultipleObjectResponse[],
    Error,
    IS3PutMultipleObjectPayload
  >({
    mutationFn: putMultipleObjectPresignedUrl,
    onSuccess: (data) => {
      console.log("successfully generate url done", data);
      setUploadProgress({ uploaded: 0, total: data.length });
      uploadFilesToS3(data)
        .then((data) => {
          console.log(data);
          if (!isUpdateAction) {
            updateFormData({ photos: [...formData.photos, ...uploadImages] });
            setUploadProgress({ uploaded: 0, total: 0 });
          }
          clearAllImages();
          if (isUpdateAction && storeId) {
            createStorePhotosMutation({ storeId, paths: uploadImages });
          }
        })
        .catch((error) => {
          toast({
            title: "Image Upload error:",
            description: error?.response.data.message || error.message,
            variant: "destructive",
          });
        });
    },
    onError: (error: any) => {
      console.log("error", error);
      toast({
        title: "Url generate error:",
        description: error?.response.data.message || error.message,
        variant: "destructive",
      });
    },
  });

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  // Remove individual image
  const removeImage = (index: number) => {
    setImages((prevImages) => {
      const newImages = prevImages.filter((_, i) => i !== index);

      // ✅ Reset input if all images are removed
      if (newImages.length === 0 && fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear file input
      }

      return newImages;
    });
  };

  // Clear all images
  const clearAllImages = () => {
    setImages([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear file input
    }
  };

  function onUpload() {
    const payload = images.map((item) => {
      const fileExtension = item.file.name.split(".").pop(); // Get file extension
      const timestamp = Date.now(); // Get current timestamp
      const uniqueId = generateUniqueId();
      return { fileName: item.file.name, key: `${user?.id}/photos/${timestamp}-${uniqueId}.${fileExtension}` };
    });

    setUploadImages(payload.map((item) => item.key));

    uploadUrlMutation({ files: payload });
  }

  // create store
  const {
    name,
    categoryId,
    email,
    number,
    whatsappNumber,
    tagline,
    slug,
    logo,
    feedbackLink,
    upiId,
    bio,
    addressLine1,
    addressLine2,
    cityId,
    googleMapLink,
    latitude,
    longitude,
    pincode,
    stateId,
    services,
    links,
    photos,
  } = formData;

  // mutation for create store
  const { mutate: createStoreMutation, isPending: createStorePending } = useMutation<
    StoreResponse,
    Error,
    StorePayload
  >({
    mutationFn: createStore,
    onSuccess: (data) => {
      console.log("successfully create store", data);
      createStoreAddressMutation({
        addressLine1,
        addressLine2,
        cityId: Number(cityId),
        stateId: Number(stateId),
        latitude: Number(latitude),
        longitude: Number(longitude),
        googleMapLink,
        pincode: Number(pincode),
        storeId: data.id,
      });
    },
    onError: (error: any) => {
      console.log("error", error);
      toast({
        title: "Create profile error:",
        description: error?.response.data.message || error.message,
        variant: "destructive",
      });
    },
  });

  // mutation for create store address
  const { mutate: createStoreAddressMutation, isPending: createStoreAddressPending } = useMutation<
    StoreAddressResponse,
    Error,
    StoreAddressPayload
  >({
    mutationFn: createStoreAddress,
    onSuccess: (data) => {
      console.log("successfully create store address", data);
      createStoreServiceMutation(
        services.map((service, i) => ({ index: i + 1, serviceId: Number(service), storeId: data.storeId }))
      );
    },
    onError: (error: any) => {
      console.log("error", error);
      toast({
        title: "Create store address error:",
        description: error?.response.data.message || error.message,
        variant: "destructive",
      });
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
      if (links.length > 0) {
        createStoreLinksMutation(
          links.map((l, i) => ({
            index: i + 1,
            SocialMediaId: Number(l.socialMediaId),
            link: l.link,
            storeId: data[0].storeId,
          }))
        );
      } else {
        createStorePhotosMutation({ storeId: data[0].storeId, paths: photos });
      }
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

  // mutation for create store links
  const { mutate: createStoreLinksMutation, isPending: createStoreLinksPending } = useMutation<
    StoreLinksResponse[],
    Error,
    StoreLinksPayload[]
  >({
    mutationFn: createStoreLinks,
    onSuccess: (data) => {
      console.log("successfully create store links", data);
      createStorePhotosMutation({ storeId: data[0].storeId, paths: photos });
    },
    onError: (error: any) => {
      console.log("error", error);
      toast({
        title: "Create store links error:",
        description: error?.response.data.message || error.message,
        variant: "destructive",
      });
    },
  });

  // mutation for create store photos
  const { mutate: createStorePhotosMutation, isPending: createStorePhotosPending } = useMutation<
    StorePhotosResponse[],
    Error,
    StorePhotosPayload
  >({
    mutationFn: createStorePhotos,
    onSuccess: (data) => {
      console.log("successfully create store photos", data);
      if (isUpdateAction) {
        setUploadImages([]);
        setUploadProgress({ uploaded: 0, total: 0 });
        queryClient.setQueryData(["photos", { storeId }], (oldData: StorePhotos[]) => [...oldData, ...data]);
        toast({
          title: "New photos uploaded successfully",
        });
      } else {
        clearFormData();
        toast({
          title: "Profile:",
          description: "Profile created successfully",
        });
        navigate("/profile");
      }
    },
    onError: (error: any) => {
      console.log("error", error);
      toast({
        title: "Create store photos error:",
        description: error?.response.data.message || error.message,
        variant: "destructive",
      });
    },
  });

  // mutation for create store photos
  const { mutate: deleteStorePhotoMutation, isPending: deleteStorePhotoPending } = useMutation<
    StorePhotos,
    Error,
    number
  >({
    mutationFn: deleteStorePhoto,
    onSuccess: (data) => {
      queryClient.setQueryData(["photos", { storeId }], (oldData: StorePhotos[]) =>
        oldData.filter((photo) => photo.id !== data.id)
      );
      toast({
        title: "Photo deleted successfully",
      });
    },
    onError: (error: any) => {
      console.log("error", error);
      toast({
        title: "Delete photo error:",
        description: error?.response.data.message || error.message,
        variant: "destructive",
      });
    },
  });

  const deleteUploadedPhoto = (id: number) => {
    deleteStorePhotoMutation(id);
  };

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (photos.length > 0) {
      createStoreMutation({
        name,
        categoryId: Number(categoryId),
        email,
        number,
        whatsappNumber,
        tagline: tagline,
        slug: `${slug}-${createSlug(addressLine2)}`,
        logo,
        feedbackLink,
        isActive: true,
        storeOwnerUserId: Number(user?.id),
        upiId,
        bio,
      });
    } else {
      toast({
        title: "First upload store photos then create.",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <Card className="py-6 shadow-md rounded-lg">
        <CardContent className="py-0 px-3 lg:px-6 grid gap-3">
          {/* File Input */}
          <Label>Upload photos</Label>
          <Input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            multiple
            onChange={handleFileChange}
            id="image-upload"
            placeholder="tets"
          />

          {deleteStorePhotoPending && (
            <p className="py-4 flex gap-2">
              <Loader2 className="animate-spin" /> Deleting...
            </p>
          )}

          {/* uploaded images */}
          {formData.photos.length > 0 && !isUpdateAction && (
            <div className={`grid grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4 my-4`}>
              {formData.photos.map((image) => (
                <div key={image} className="flex justify-center">
                  <img
                    src={`${imageBaseUrl}${image}`}
                    alt="uploaded"
                    className="w-24 h-24 object-cover rounded shadow border"
                  />
                </div>
              ))}
            </div>
          )}

          {data && data.length > 0 && isUpdateAction && (
            <div className={`grid grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 my-4`}>
              {data.map((image) => (
                <div key={image.id} className="relative flex justify-center">
                  <img
                    src={`${imageBaseUrl}${image.path}`}
                    alt="uploaded"
                    className="w-24 h-24 object-cover rounded shadow border"
                  />
                  <Button
                    type="button"
                    variant={"outline"}
                    size={"icon"}
                    onClick={() => deleteUploadedPhoto(image.id)}
                    className="absolute top-0 right-0 rounded-full"
                  >
                    <Trash />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Image Previews */}
          <div className={`grid grid-cols-3 lg:grid-cols-4 gap-2 ${images.length > 0 && "my-4"}`}>
            {images?.map((img, index) => (
              <div key={index} className="relative border rounded-md p-2">
                <img src={img.preview} alt="preview" className="w-24 h-24 object-cover rounded-lg shadow" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-3 right-3 bg-primary text-white rounded-full p-1 shadow"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Clear All Button */}
          {images.length > 0 && (
            <div className="flex gap-3">
              <Button type="button" onClick={clearAllImages}>
                Remove All
              </Button>
              <Button type="button" disabled={uploadUrlPending || uploadProgress.total > 0} onClick={onUpload}>
                {uploadUrlPending && <Loader2 className="animate-spin" />}
                Upload
              </Button>
            </div>
          )}

          {/* {JSON.stringify(uploadProgress)} */}
          {uploadProgress.total > 0 && uploadProgress.uploaded != uploadProgress.total && (
            <div className="flex flex-col gap-3 mt-4">
              <p className="flex gap-2 py-2">
                <Loader2 className="animate-spin" />{" "}
                {Math.floor((uploadProgress.uploaded / uploadProgress.total) * 100)} uploading...{" "}
                <b>{uploadProgress.uploaded}</b> uploaded form
                <b>{uploadProgress.total}</b> total
              </p>
              <Progress
                value={Math.floor((uploadProgress.uploaded / uploadProgress.total) * 100)}
                className={`w-[${Math.floor((uploadProgress.uploaded / uploadProgress.total) * 100)}%]`}
              />
            </div>
          )}
        </CardContent>
      </Card>
      {/* Submit Button */}
      {!isUpdateAction && (
        <div className="flex gap-4">
          <Button type="button" variant={"outline"} onClick={() => prevStep()} className="px-10">
            Previous
          </Button>
          <Button
            type="submit"
            disabled={
              createStorePhotosPending ||
              createStoreLinksPending ||
              createStoreServicePending ||
              createStoreAddressPending ||
              createStorePending
            }
            className="px-10"
          >
            {(createStorePhotosPending ||
              createStoreLinksPending ||
              createStoreServicePending ||
              createStoreAddressPending ||
              createStorePending) && <Loader2 className="animate-spin" />}
            Create
          </Button>
        </div>
      )}
    </form>
  );
};

export default Photos;
