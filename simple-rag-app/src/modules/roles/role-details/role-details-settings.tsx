import { FormEvent, useMemo } from 'react';
import useRoleDetailsSettingsFormActions from './role-details-settings.actions';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { type RoleDetailsSettingsFormSchema } from '@/schemas/role-details-form.shema';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface RoleDetailsSettingsProps {
  data: RoleDetailsSettingsFormSchema;
  roleId: string;
}

const RoleDetailsSettings = ({ data, roleId }: RoleDetailsSettingsProps) => {
  const { form, isSubmitting } = useRoleDetailsSettingsFormActions({ data, roleId });

  const isDisabled = useMemo(
    () => data.name === 'admin' || isSubmitting,
    [data.name, isSubmitting]
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <>
      <Card className="mb-12 w-1/2">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FieldGroup>
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        id={field.name}
                        placeholder="Enter name"
                        value={field.state.value}
                        disabled={isDisabled}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
            <FieldGroup>
              <form.Field
                name="description"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Textarea
                        id={field.name}
                        disabled={isSubmitting}
                        placeholder="Enter description"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
            <div className="flex justify-end">
              <Button variant="default" type="submit" disabled={isSubmitting}>
                {isSubmitting && <Spinner />}
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <h2 className="mb-4">Danger zone</h2>

      <Card className="w-full">
        <CardContent className="space-between flex items-center">
          <Alert variant="destructive" className="border-none p-0">
            <AlertTitle>Delete Role</AlertTitle>
            <AlertDescription>
              Once confirmed, this operation can't be undone!
            </AlertDescription>
          </Alert>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" type="button" disabled={isDisabled}>
                Delete this role
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Role</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete role "{data.name}"?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: 'destructive' })}
                >
                  Delete role
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </>
  );
};

export default RoleDetailsSettings;
