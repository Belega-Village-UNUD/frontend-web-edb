"use client";

import ButtonConfirm from "@/components/button/ButtonConfirm";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useStoreState } from "@/zustand/stores";
import { usePersistedUser } from "@/zustand/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Province = {
  province_id: string;
  province: string;
};

type City = {
  city_id: string;
  province_id: string;
  province: string | null;
  type: string;
  city_name: string;
  postal_code: string;
};

const FormSchema = z.object({
  address: z.string().min(8, {
    message: "Address must be at least 8 characters",
  }),
  province: z.object({
    province_id: z.string(),
    province: z.string(),
  }),
  city: z.object({
    city_id: z.string(),
    province_id: z.string(),
    province: z.string(),
    type: z.string(),
    city_name: z.string(),
    postal_code: z.string(),
  }),
});

interface AddressFormStoreProps {
  onAddressFormSubmit: () => void;
}

const AddressFormStore = ({ onAddressFormSubmit }: AddressFormStoreProps) => {
  const [open, setOpen] = useState(false);

  const [openProvince, setOpenProvince] = useState(false);

  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [token] = usePersistedUser((state) => [state.token]);
  const [address, setAddress] = useStoreState((state) => [
    state.address,
    state.setAddress,
  ]);
  const [province, setProvince] = useStoreState((state) => [
    state.province,
    state.setProvince,
  ]);
  const [city, setCity, set_city_id] = useStoreState((state) => [
    state.city,
    state.setCity,
    state.setCityId,
  ]);

  const getProvince = useCallback(async () => {
    try {
      if (!token) {
        console.error("Please Login First");
        return null;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipping/province`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const responseJson = await response.json();
      // console.log(responseJson)
      if (responseJson.success === true) {
        setProvinces(responseJson.data);
      } else {
        console.error(responseJson.message);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }, [token]);

  useEffect(() => {
    getProvince();
  }, [getProvince]);

  const getCity = useCallback(
    async (provinceId: string) => {
      try {
        if (!token) {
          console.error("Please Login First");
          return null;
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/shipping/city?province_id=${provinceId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const responseJson = await response.json();
        // console.log(responseJson.data)
        if (responseJson.success === true) {
          setCities(responseJson.data);
        } else {
          console.error(responseJson.message);
        }
      } catch (error: any) {
        console.error(error.message);
      }
    },
    [token]
  );

  useEffect(() => {
    getCity(provinceId);
  }, [provinceId, getCity]);

  // useEffect(() => {
  //   if (provinceId) {
  //     const cities = responseJsonCityBali.filter((city) => city.province_id === provinceId)
  //     setCities(cities)
  //   }
  // }, [provinceId])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      address: address,
      province: province,
      city: city,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.success("You submitted the following values:");
    setAddress(data.address);

    const provinceFound = provinces.find(
      (province) => province.province_id === provinceId
    );
    const cityFound = cities.find((city) => city.city_id === cityId);

    const provinceData = {
      province_id: provinceId,
      province: provinceFound ? provinceFound.province : "",
    };
    const cityData = cityFound
      ? {
          city_id: cityId,
          province_id: provinceId,
          province: provinceFound ? provinceFound.province : "",
          type: cityFound.type,
          city_name: cityFound.city_name,
          postal_code: cityFound.postal_code,
        }
      : null;
    if (provinceData) {
      setProvince(provinceData);
    }

    if (cityData) {
      setCity(cityData);
    }
    setCities(cities);
    set_city_id(cityId);

    // console.log(cityData)
    // console.log(provinceData);
    onAddressFormSubmit();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Address Store</FormLabel>
              <FormControl>
                <Input
                  placeholder="Jl. antasari gg. 291 bla bla.."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your Address of Your Store.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="font-semibold">Province</FormLabel>
              <Popover open={openProvince} onOpenChange={setOpenProvince}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openProvince}
                    className="w-[200px] justify-between"
                  >
                    {provinceId
                      ? provinces.find(
                          (province) => province.province_id === provinceId
                        )?.province
                      : "Select Province..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search province..." />
                    <CommandList>
                      <CommandEmpty>No province found.</CommandEmpty>
                      <CommandGroup>
                        {provinces.map((province) => (
                          <CommandItem
                            key={province.province_id}
                            value={province.province_id}
                            onSelect={(currentValue) => {
                              setProvinceId(
                                currentValue === provinceId ? "" : currentValue
                              );
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                provinceId === province.province_id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {province.province}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="font-semibold">City</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                  >
                    {cityId
                      ? cities.find((city) => city.city_id === cityId)
                          ?.city_name
                      : "Select city..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search city..." />
                    <CommandList>
                      <CommandEmpty>No city found.</CommandEmpty>
                      <CommandGroup>
                        {cities.map((city) => (
                          <CommandItem
                            key={city.city_id}
                            value={city.city_id}
                            onSelect={(currentValue) => {
                              setCityId(
                                currentValue === cityId ? "" : currentValue
                              );
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                cityId === city.city_id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {city.city_name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <ButtonConfirm type="submit" label="Submit" />
      </form>
    </Form>
  );
};

export default AddressFormStore;
