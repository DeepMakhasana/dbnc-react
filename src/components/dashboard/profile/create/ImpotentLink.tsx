import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, Loader2, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useCallback, useEffect, useState } from "react";
import useMultiStepFormContext from "@/context/multi-step-form/useMultiStepFormContext";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getSocialMediaPlatforms } from "@/api/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ActionType,
  StoreLinks,
  StoreLinksPayload,
  StoreLinksResponse,
  UpdateStoreSocialLinkPayload,
  UpdateStoreSocialLinkResponse,
} from "@/types/profile";
import { useNavigate } from "react-router-dom";
import { createStoreLinks, deleteStoreLink, getStoreLinksById, updateStoreSocialLink } from "@/api/profile";
import Loader from "../../Loader";
import { toast } from "@/hooks/use-toast";

type TLink = {
  socialMediaId: string;
  name: string;
  link: string;
  index: number;
  id?: number;
};

const ImpotentLink = ({ action = ActionType.CREATE, storeId }: { action?: ActionType; storeId?: number }) => {
  const { formData, nextStep, updateFormData, prevStep } = useMultiStepFormContext();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<TLink[]>([]);
  const [addValue, setAddValue] = useState<TLink[]>([]);
  const navigate = useNavigate();
  const isUpdateAction = action === ActionType.UPDATE;
  const queryClient = useQueryClient();

  // get all social media platform
  const { data: SocialMediaPlatform, isLoading: isSocialMediaPlatformLoading } = useQuery({
    queryKey: ["social-media-platform"],
    queryFn: getSocialMediaPlatforms,
  });

  // get all social media links
  const { data: StoreLinks, isLoading: isStoreLinksLoading } = useQuery({
    queryKey: ["social-link", { storeId }],
    queryFn: () => getStoreLinksById(Number(storeId)),
    enabled: !!storeId,
  });

  console.log(StoreLinks);

  useEffect(() => {
    if (Array.isArray(SocialMediaPlatform) && SocialMediaPlatform.length > 0 && !isUpdateAction) {
      const oldData = formData.links.map((link) => {
        const index = SocialMediaPlatform.findIndex((item) => item.id === Number(link.socialMediaId));
        return { ...link, name: SocialMediaPlatform[index].name };
      });
      setValue(oldData);
    }
  }, [SocialMediaPlatform, formData.links, isUpdateAction]);

  useEffect(() => {
    if (isUpdateAction && StoreLinks) {
      const oldData = StoreLinks.map((l) => ({
        socialMediaId: String(l.SocialMediaId),
        name: l.socialMedia.name,
        link: l.link,
        index: l.index,
        id: l.id,
      }));
      setValue(oldData);
    }
  }, [StoreLinks, isUpdateAction]);

  // mutation for create store links
  const { mutate: createStoreLinksMutation, isPending: createStoreLinksPending } = useMutation<
    StoreLinksResponse[],
    Error,
    StoreLinksPayload[]
  >({
    mutationFn: createStoreLinks,
    onSuccess: (data) => {
      console.log("successfully create store links", data);
      setAddValue([]);
      toast({
        title: "Links add successfully",
      });
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

  const updateFormsData = useCallback((data: { links: { socialMediaId: string; link: string; index: number }[] }) => {
    updateFormData(data);
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isUpdateAction && addValue.length > 0) {
      createStoreLinksMutation(
        addValue.map((l) => ({
          index: l.index,
          SocialMediaId: Number(l.socialMediaId),
          link: l.link,
          storeId: Number(storeId),
        }))
      );
    } else {
      nextStep();
    }
  }

  // Watch form changes and sync with MultiStepForm state
  useEffect(() => {
    if (!isUpdateAction) {
      if (value.length > 0) {
        updateFormsData({
          links: value.map((l) => ({ socialMediaId: l.socialMediaId, link: l.link, index: l.index })),
        });
      }
    }
  }, [value, updateFormsData, isUpdateAction]);

  if (isStoreLinksLoading) {
    return <Loader />;
  }

  console.log("setAddValue", addValue);

  return (
    <form onSubmit={onSubmit} method="post" className="space-y-8">
      <Card className="py-6 shadow-md rounded-lg">
        <CardContent className="py-0 px-4 lg:px-6 grid gap-3">
          {/* social media */}
          <div className="flex flex-col gap-3">
            <Label>Impotent platforms</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] sm:w-[400px] justify-between"
                >
                  {value.length > 0 ? "Add platform" : "Select platform"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] sm:w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Search framework..." />
                  <CommandList>
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {isSocialMediaPlatformLoading && (
                        <div className="flex items-center gap-2">
                          <Loader2 className="animate-spin" /> Loading...
                        </div>
                      )}
                      {SocialMediaPlatform?.map((social) => (
                        <CommandItem
                          key={social.id}
                          value={social.name}
                          onSelect={(currentValue) => {
                            console.log(currentValue);
                            setValue((pre) => [
                              ...pre,
                              { name: social.name, socialMediaId: String(social.id), link: "", index: -1 },
                            ]);
                            setOpen(false);
                            if (isUpdateAction && StoreLinks) {
                              setAddValue((pre) => [
                                ...pre,
                                {
                                  name: social.name,
                                  socialMediaId: String(social.id),
                                  link: "",
                                  index: StoreLinks.length + 1,
                                },
                              ]);
                            }
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value.map((p) => p.name).includes(social.name) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {social.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-3">
            {value?.map((p, i) => (
              <LinkCart
                key={p.socialMediaId}
                setValue={setValue}
                p={p}
                index={i}
                isUpdateAction={isUpdateAction}
                storeId={storeId}
                setAddValue={setAddValue}
                addValue={addValue}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Submit Button */}
      {isUpdateAction ? (
        addValue.length > 0 && (
          <div className="flex gap-4">
            <Button type="button" variant={"outline"} onClick={() => navigate(-1)} className="px-10">
              Cancel
            </Button>
            <Button type="submit" disabled={createStoreLinksPending} className="px-10">
              {createStoreLinksPending ? "Adding..." : "Add"}
            </Button>
          </div>
        )
      ) : (
        <div className="flex gap-4">
          <Button type="button" variant={"outline"} onClick={() => prevStep()} className="px-10">
            Previous
          </Button>
          <Button type="submit" className="px-10">
            Next
          </Button>
        </div>
      )}
    </form>
  );
};

const LinkCart = ({
  setValue,
  setAddValue,
  p,
  index,
  isUpdateAction,
  storeId,
  addValue,
}: {
  setValue: Dispatch<SetStateAction<TLink[]>>;
  setAddValue: Dispatch<SetStateAction<TLink[]>>;
  p: TLink;
  index: number;
  isUpdateAction: boolean;
  storeId: number | undefined;
  addValue: TLink[];
}) => {
  const [updateValue, setUpdateValue] = useState<{ id: number; link: string }>();
  const queryClient = useQueryClient();

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    const value = e.target.value;
    const name = e.target.name;
    const id = e.target.id;

    console.log(name, value);

    setValue((pre) => pre.map((item) => (item.socialMediaId === name ? { ...item, link: value, index: i } : item)));
    if (isUpdateAction && addValue.map((item) => item.socialMediaId === name).length > 0) {
      setAddValue((pre) => pre.map((item) => (item.socialMediaId === name ? { ...item, link: value } : item)));
    } else if (isUpdateAction) {
      setUpdateValue({ id: Number(id), link: value });
    }
  };

  // mutation for create store links
  const { mutate: updateStoreLinksMutation, isPending: updateStoreLinksPending } = useMutation<
    UpdateStoreSocialLinkResponse,
    Error,
    { payload: UpdateStoreSocialLinkPayload; storeSocialMediaId: string | number }
  >({
    mutationFn: updateStoreSocialLink,
    onSuccess: (data) => {
      console.log("successfully create store links", data);
      queryClient.setQueryData(["social-link", { storeId }], (oldData: StoreLinks[]) =>
        oldData.map((l) => (l.id === data.id ? { ...l, link: data.index } : l))
      );
      setUpdateValue(undefined);
      toast({
        title: "Links update successfully",
      });
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

  const onUpdate = () => {
    if (updateValue) {
      updateStoreLinksMutation({ payload: { link: updateValue?.link }, storeSocialMediaId: updateValue.id });
    }
  };

  // update category and bio mutation
  const { mutate: deleteStoreLinkMutation, isPending: isDeleteStoreLinkPending } = useMutation<
    StoreLinksResponse,
    Error,
    number
  >({
    mutationFn: deleteStoreLink,
    onSuccess: (data) => {
      console.log("deleted", data);
      queryClient.setQueryData(["social-link", { storeId }], (oldData: StoreLinks[]) =>
        oldData.filter((l) => l.id != data.id)
      );
      toast({
        title: "Delete successfully",
      });
    },
    onError: (error: any) => {
      console.log("error", error);
    },
  });

  const deleteSocialLink = (socialMediaId: string, id?: number) => {
    setValue((pre) => pre.filter((l) => l.socialMediaId != socialMediaId).map((l, i) => ({ ...l, index: i + 1 })));
    if (isUpdateAction && id) {
      deleteStoreLinkMutation(id);
    }
  };

  return (
    <Card key={p.socialMediaId}>
      <CardContent className="flex flex-col gap-2 py-4">
        <div className="flex justify-between items-center">
          <Label>{p.name}</Label>
          <Button
            size={"icon"}
            disabled={isDeleteStoreLinkPending}
            onClick={() => deleteSocialLink(p.socialMediaId, p.id)}
            variant={"outline"}
          >
            {isDeleteStoreLinkPending ? <Loader2 className="animate-spin" /> : <Trash />}
          </Button>
        </div>
        <Input
          type="url"
          name={p.socialMediaId}
          value={p.link}
          id={String(p.id) || "link"}
          placeholder={`https://${p.name.toLowerCase()}.com/something`}
          onChange={(e) => handleOnChange(e, index + 1)}
          required
          autoComplete="off"
        />
        {updateValue && addValue.filter((item) => item.socialMediaId === p.socialMediaId).length === 0 && (
          <Button type="button" disabled={updateStoreLinksPending} onClick={onUpdate}>
            {updateStoreLinksPending && <Loader2 className="animate-spin" />}
            {updateStoreLinksPending ? "Updating..." : "Update"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ImpotentLink;
