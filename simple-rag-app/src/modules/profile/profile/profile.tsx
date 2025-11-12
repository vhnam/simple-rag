import { useMemo } from 'react';
import type { FormEvent } from 'react';

import { AvatarImage } from '@radix-ui/react-avatar';

import crypto from 'node:crypto';

import { useAuthContext } from '@/integrations/auth/auth-provider';

import { useMyProfile } from '@/queries/users';

import {
  ProtectedLayoutContent,
  ProtectedLayoutHeader,
} from '@/layouts/protected-layout';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

import useProfileActions from './profile.actions';

const Profile = () => {
  const { user } = useAuthContext();

  const { data: profileData, isLoading: isLoadingProfile } = useMyProfile();
  const { form, isSubmitting } = useProfileActions({
    data: profileData,
  });

  const avatar = useMemo(() => {
    if (user?.picture) {
      return user.picture;
    }

    if (profileData?.user) {
      const hashedEmail = crypto
        .createHash('sha256')
        .update(profileData.user.email)
        .digest('hex');
      return `https://www.gravatar.com/avatar/${hashedEmail}`;
    }

    return undefined;
  }, [user, profileData]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <ProtectedLayoutHeader title="Profile">
        <Button
          variant="default"
          size="sm"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting && <Spinner />}
          Save
        </Button>
      </ProtectedLayoutHeader>

      <ProtectedLayoutContent>
        {isLoadingProfile && (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}

        {!isLoadingProfile && (
          <div className="w-2/3 space-y-6">
            <Card>
              <CardContent className="grid grid-cols-2 gap-4 pt-6">
                <div className="flex items-center">
                  <Avatar className="size-32">
                    <AvatarImage src={avatar} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-6">
                  <FieldGroup>
                    <form.Field
                      name="name"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                            <Input
                              id={field.name}
                              placeholder="Enter name"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
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
                      name="email"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                            <Input
                              id={field.name}
                              placeholder="Enter email"
                              value={field.state.value}
                              disabled={true}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    />
                  </FieldGroup>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Choose your preferred theme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup>
                    <form.Field
                      name="interface_theme"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Color theme
                            </FieldLabel>
                            <Select
                              value={field.state.value}
                              onValueChange={(
                                value: 'light' | 'dark' | 'system'
                              ) => field.handleChange(value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  id={field.name}
                                  placeholder="Select a theme"
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                              </SelectContent>
                            </Select>
                          </Field>
                        );
                      }}
                    />
                  </FieldGroup>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Language</CardTitle>
                <CardDescription>
                  Manage language settings for the interface and AI-generated
                  content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup>
                    <form.Field
                      name="interface_language"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Interface language
                            </FieldLabel>
                            <Select
                              value={field.state.value}
                              onValueChange={(value: 'en-US' | 'vi-VN') =>
                                field.handleChange(value)
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  id={field.name}
                                  placeholder="Select a language"
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en-US">English</SelectItem>
                                <SelectItem value="vi-VN">
                                  Tiếng Việt
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </Field>
                        );
                      }}
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <form.Field
                      name="ai_language"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              AI language
                            </FieldLabel>
                            <Select
                              value={field.state.value}
                              onValueChange={(value: 'en-US' | 'vi-VN') =>
                                field.handleChange(value)
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  id={field.name}
                                  placeholder="Select a language"
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en-US">English</SelectItem>
                                <SelectItem value="vi-VN">
                                  Tiếng Việt
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </Field>
                        );
                      }}
                    />
                  </FieldGroup>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </ProtectedLayoutContent>
    </form>
  );
};

export default Profile;
