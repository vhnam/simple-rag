import { Button } from '@/components/ui/button'
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import useAIRecipeFormActions from './ai-recipe-form.actions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const categories = [
  'MÓN DÙNG NƯỚC (NƯỚC, CANH, XÚP)',
  'MÓN CHÁO',
  'MÓN CHẾ BIẾN KHÔ (KHO, RÁN, XÀO, NƯỚNG)',
  'MÓN TRỘN, CUỐN, HẤP & CƠM (ĐỊNH DẠNG ĐẶC BIỆT)',
  'MÓN KHẨU PHẦN ĐẶC BIỆT VÀ MỤC ĐÍCH SỬ DỤNG',
]

const AIRecipeForm = () => {
  const { form } = useAIRecipeFormActions()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cook with AI</CardTitle>
        <CardDescription>
          Generate a recipe for your food with AI
        </CardDescription>
      </CardHeader>

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <CardContent>
          <FieldGroup>
            <form.Field
              name="category"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                    {/* <Combobox
                      id="category"
                      options={categories.map((category) => ({
                        value: category,
                        label: category,
                      }))}
                      value={field.state.value}
                      onChange={(value) => field.handleChange(value)}
                    /> */}
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <SelectTrigger className="w-full" id={field.name}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name="description"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Textarea
                      id={field.name}
                      placeholder="Enter description"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => form.reset()}>
            Clear
          </Button>
          <Button type="submit">Generate</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default AIRecipeForm
