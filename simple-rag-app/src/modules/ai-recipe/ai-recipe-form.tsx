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
import { Spinner } from '@/components/ui/spinner'
import { type AIRecipeFormSchema } from '@/schemas/ai-recipe-form.schema'
import { type ReactFormExtendedApi } from '@tanstack/react-form'
import { FormEvent } from 'react'

interface AIRecipeFormProps {
  form: ReactFormExtendedApi<
    AIRecipeFormSchema,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
  isCreatingRecipe: boolean
}

const AIRecipeForm = ({ form, isCreatingRecipe }: AIRecipeFormProps) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cook with AI</CardTitle>
        <CardDescription>
          Generate a recipe for your food with AI
        </CardDescription>
      </CardHeader>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <CardContent>
          <FieldGroup>
            <form.Field
              name="ingredients"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Ingredients</FieldLabel>
                    <Textarea
                      disabled={isCreatingRecipe}
                      id={field.name}
                      placeholder="Enter ingredients"
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
          <Button
            variant="outline"
            type="button"
            onClick={() => form.reset()}
            disabled={isCreatingRecipe}
          >
            Clear
          </Button>
          <Button type="submit" disabled={isCreatingRecipe}>
            {isCreatingRecipe ? (
              <>
                <Spinner /> Generating...
              </>
            ) : (
              'Generate'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default AIRecipeForm
