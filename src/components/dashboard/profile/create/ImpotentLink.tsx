import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, Loader2, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import useMultiStepFormContext from "@/context/multi-step-form/useMultiStepFormContext";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getSocialMediaPlatforms } from "@/api/utils";
import { useQuery } from "@tanstack/react-query";

const ImpotentLink = () => {
  const { formData, nextStep, updateFormData, prevStep } = useMultiStepFormContext();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<{ socialMediaId: string; name: string; link: string; index: number }[]>([]);

  // get all social media platform
  const { data: SocialMediaPlatform, isLoading: isSocialMediaPlatformLoading } = useQuery({
    queryKey: ["social-media-platform"],
    queryFn: getSocialMediaPlatforms,
  });

  useEffect(() => {
    if (Array.isArray(SocialMediaPlatform) && SocialMediaPlatform.length > 0) {
      const oldData = formData.links.map((link) => {
        const index = SocialMediaPlatform.findIndex((item) => item.id === Number(link.socialMediaId));
        return { ...link, name: SocialMediaPlatform[index].name };
      });
      setValue(oldData);
    }
  }, [SocialMediaPlatform]);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    const value = e.target.value;
    const name = e.target.name;

    console.log(name, value);

    setValue((pre) => pre.map((item) => (item.socialMediaId === name ? { ...item, link: value, index: i } : item)));
  };

  const updateFormsData = useCallback((data: { links: { socialMediaId: string; link: string; index: number }[] }) => {
    updateFormData(data);
  }, []);

  const deleteSocialLink = (socialMediaId: string) => {
    setValue((pre) => pre.filter((l) => l.socialMediaId != socialMediaId).map((l, i) => ({ ...l, index: i + 1 })));
  };

  function onSubmit() {
    console.log(value);
    nextStep();
  }

  // Watch form changes and sync with MultiStepForm state
  useEffect(() => {
    if (value.length > 0) {
      updateFormsData({ links: value.map((l) => ({ socialMediaId: l.socialMediaId, link: l.link, index: l.index })) });
    }
  }, [value, updateFormsData]);

  return (
    <form onSubmit={onSubmit} className="space-y-8">
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
              <Card key={p.socialMediaId}>
                <CardContent className="flex flex-col gap-2 py-4">
                  <div className="flex justify-between items-center">
                    <Label>{p.name}</Label>
                    <Button size={"icon"} onClick={() => deleteSocialLink(p.socialMediaId)} variant={"outline"}>
                      <Trash />
                    </Button>
                  </div>
                  <Input
                    type="url"
                    name={p.socialMediaId}
                    value={p.link}
                    placeholder={`https://${p.name.toLowerCase()}.com/something`}
                    onChange={(e) => handleOnChange(e, i + 1)}
                    required
                    autoComplete="off"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
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
  );
};

export default ImpotentLink;
