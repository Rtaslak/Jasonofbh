
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { DollarSign } from "lucide-react";
import { FormValues, productTypes } from "./FormSchema";

interface ProductInformationProps {
  control: Control<FormValues>;
}

export function ProductInformation({ control }: ProductInformationProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground/80 mb-4">Product Information</h2>
      
      {/* Serial number and product type on the same line */}
      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={control}
          name="serialNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serial Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter serial number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="productType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex">
                Product Type <span className="text-destructive ml-1">*</span>
              </FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {productTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Sale price in its own row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="salePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex">
                Sale Price <span className="text-destructive ml-1">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-8" placeholder="0.00" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
