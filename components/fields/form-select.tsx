import { OptionItem } from "@/lib/type/type";
import { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type FormsInputProps<T extends FieldValues> = {
    control: Control<T>
    path: Path<T>
    options: OptionItem[]
    label?: string
    className?: string
    placeHolder?: string
}

export default function FormSelect<T extends FieldValues>({control, path, options, label, className, placeHolder} : FormsInputProps<T>) {
    
    return (
        <FormField control={control} name={path} render={({field}) =>
            <FormItem className={className}>
                {label && <FormLabel>{label}</FormLabel>}

                <Select value={field.value} onValueChange={field.onChange}>
                   <FormControl>
                     <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder= {placeHolder || "Select One"} />
                     </SelectTrigger>
                   </FormControl> 

                    <SelectContent>
                       {options.map((option, index) => 
                          <SelectItem key={index} value={option.key}>
                              {option.value}
                          </SelectItem>
                        )}
                    </SelectContent>
                    
                 </Select>
                <FormMessage/>
            </FormItem>
        }/>
    )
}
