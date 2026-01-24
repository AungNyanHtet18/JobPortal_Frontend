import { HTMLInputTypeAttribute } from "react"
import { Control, FieldValues, Path } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

type FormsInputProps<T extends FieldValues> = {
     control: Control<T>
     path: Path<T>
     label?: string
     className?: string
     placeHolder?: string
}

export default function FormsTextAreaInput<T extends FieldValues>({control, path, label, className, placeHolder}: FormsInputProps<T>) {
     return (
        <FormField control={control} name={path} render={({field}) =>
            <FormItem className={className}>
               {label && <FormLabel>{label}</FormLabel>}

                <FormControl>
                    <Textarea {...field}  placeholder={placeHolder || `Enter ${label}`} />
                </FormControl>

                <FormMessage/>
            </FormItem>
        }/> 
     )
}
