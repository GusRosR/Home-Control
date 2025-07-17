"use client"

import { useForm } from "react-hook-form"
import { optional, z } from "zod" //Library for input validation (on the frontend)
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Category, PageProps } from "@/types"
import { router, usePage } from "@inertiajs/react"
import { onSubmit } from "./categories-service"


/* Zod validation shown in the documentation */
const formSchema = z.object({
    name: z.string().min(1, "The name is required").trim(),
    parent_id: optional(z.string()),
})

/* Main function with parameters to trigger the opening and closing of the Dialog component on the index */
export default function Create({onSuccess}: {onSuccess?: () => void}) {

    /* Variable to store the props */
    const {categories} = usePage<PageProps>().props; 
    
    
    /* Dfocumentation code to define the form type to help autocomplete and mark type errors */
    const form = useForm<z.infer<typeof formSchema>> ({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            parent_id: ""
        },
    })
    
    return(
       
        <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => onSubmit(values,onSuccess))} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem> {/* One Item of the form (Label and Input) */}
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Name of Category" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="parent_id"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Parent Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                   <SelectTrigger>
                                     <SelectValue placeholder="Select the parent category" />
                                   </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    {/* We retrieve the database values to fill de select component */}
                                   <SelectItem value="null">None</SelectItem>
                                    {categories.data.map((category: Category) => (
                                    <SelectItem key={category.id} value={String(category.id)}>
                                        {category.name}
                                    </SelectItem>
                                   ))}
                                 </SelectContent>
                                 <FormDescription>
                                    Select the main category this sub-category will belong to.
                                 </FormDescription>
                            </Select>
                        </FormItem>
                    )}
                
                />
                <Button type="submit">Add</Button>
            </form>
        </Form>
       

    )
    
}