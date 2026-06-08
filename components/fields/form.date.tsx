import { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

type FormsDateProps<T extends FieldValues> = {
     control: Control<T>
     path: Path<T>
     label?: string
     className?: string
     disable: boolean
}


export default function FormsDate<T extends FieldValues>({control, path, label, className, disable}: FormsDateProps<T>) {
     return (
        <FormField
            control={control} name={path} render={({ field }) => (
                <FormItem className= {className}>
                    {label && <FormLabel>{label}</FormLabel> }
                    
                    <FormControl>
                        <Input {...field} type="date" disabled={disable} className="bg-white disabled:bg-zinc-100" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
     )
}