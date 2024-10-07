"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Loading from "@/components/Loading"; // Assuming you have a Loading component

interface ComboboxProps {
  loading: boolean;
  listData: { value: string; label: string }[];
  placeHolder: string;
  disabled?: boolean;
  value: string;
  label?: string;
  defaultValue?: { label: string | null; value: string | null };
  onChange: (value: string) => void;
}

export function Combobox({
  loading,
  listData,
  placeHolder,
  disabled = false,
  value,
  label,
  defaultValue,
  onChange,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedValue, setSelectedValue] = React.useState(value);

  React.useEffect(() => {
    if (defaultValue) {
      setSelectedValue(defaultValue.value || "");
    }
  }, [defaultValue]);

  // Filter listData based on the search query
  const filteredList = listData.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <label
        htmlFor="email"
        className="block text-sm font-semibold leading-6 text-gray-900 mb-2"
      >
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={loading || disabled}
          >
            {loading ? (
              <span>Loading...</span>
            ) : selectedValue ? (
              listData.find((item) => item.value === selectedValue)?.label
            ) : (
              placeHolder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <Loading />
            </div>
          ) : (
            <Command>
              <CommandInput
                placeholder={placeHolder}
                value={searchQuery}
                onValueChange={setSearchQuery} // Update the search query state
              />
              <CommandEmpty>No items found.</CommandEmpty>
              <CommandGroup>
                {filteredList.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.label} // Use label for search and display
                    onSelect={() => {
                      const newValue =
                        item.value === selectedValue ? "" : item.value;
                      setSelectedValue(newValue);
                      onChange(newValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValue === item.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
