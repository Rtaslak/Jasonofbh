
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { FormValues, metalTypes, metalColors } from "./FormSchema";

interface ProductDetailsProps {
  control: Control<FormValues>;
}

export function ProductDetails({ control }: ProductDetailsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground/80 mb-4">Product Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="metal.primaryMetal"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex">
                Primary Metal <span className="text-destructive ml-1">*</span>
              </FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary metal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {metalTypes.map((type) => (
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
      
      <div className="space-y-4">
        <FormLabel className="block mb-2">Metal Colors</FormLabel>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="metal.tones.yellow"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Yellow Gold</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="metal.tones.white"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">White Gold</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="metal.tones.rose"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Rose Gold</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="metal.tones.black"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Black Gold</FormLabel>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <FormField
          control={control}
          name="stoneDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stone Details</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter stone details (optional)" 
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="additionalNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter any additional notes (optional)" 
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
