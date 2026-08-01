import { Control, FieldValues, Path } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Checkbox } from "../ui/checkbox"

type FormsCheckBoxProps<T extends FieldValues> = {
    control: Control<T>
    path: Path<T>
    label?: string
    description?: string
    className?: string
    action?: (checked: boolean) => void
}

export default function FormsCheckBox<T extends FieldValues>({control, path, label, description, className, action}: FormsCheckBoxProps<T>) {
    return (
        <FormField  control={control}  name={path}
            render={({ field }) => (
                <FormItem className={className}>
                    <div className="flex items-start gap-3">
                        <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                    const isChecked = checked === true;
                                    field.onChange(checked)
                                    if(checked) {
                                         action?.(isChecked)
                                    }
                                }}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>{label}</FormLabel>
                            <p className="text-sm text-zinc-500">{description}</p>
                        </div>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    )

}
