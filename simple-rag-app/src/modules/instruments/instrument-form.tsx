import type { FormEvent } from 'react';

import type { ReactFormExtendedApi } from '@tanstack/react-form';

import type { InstrumentFormSchema } from '@/schemas/instrument-form.schema';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface InstrumentFormProps {
  form: ReactFormExtendedApi<
    InstrumentFormSchema,
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
  >;
  isRecommending: boolean;
  onReset: () => void;
}

const GENRES = [
  'Jazz',
  'Classical',
  'Pop',
  'Rock',
  'Blues',
  'Latin',
  'Folk',
  'Marching',
  'World Music',
  'Electronic',
];

const InstrumentForm = ({
  form,
  isRecommending,
  onReset,
}: InstrumentFormProps) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const handleClear = () => {
    onReset();
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Find Your Perfect Instrument</CardTitle>
        <CardDescription className="text-base">
          Tell us about your preferences and we'll recommend the ideal instrument
          for you.
        </CardDescription>
      </CardHeader>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <FieldGroup className="space-y-6">
            {/* Budget */}
            <form.Field
              name="budget"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} orientation="vertical">
                    <FieldLabel htmlFor={field.name}>
                      What's your budget?
                    </FieldLabel>
                    <Input
                      disabled={isRecommending}
                      id={field.name}
                      type="text"
                      placeholder="e.g., 10,000,000 VND"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full"
                    />
                    <p className="text-muted-foreground text-sm">
                      Enter your budget in VND (Vietnamese Dong)
                    </p>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Favorite Genres */}
            <form.Field
              name="favoriteGenres"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                const selectedGenres = field.state.value || [];
                return (
                  <Field data-invalid={isInvalid} orientation="vertical">
                    <FieldLabel>What genres do you enjoy? (Select 1-5)</FieldLabel>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                      {GENRES.map((genre) => {
                        const isChecked = selectedGenres.includes(genre);
                        return (
                          <div
                            key={genre}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`genre-${genre}`}
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.handleChange([
                                    ...selectedGenres,
                                    genre,
                                  ]);
                                } else {
                                  field.handleChange(
                                    selectedGenres.filter((g) => g !== genre)
                                  );
                                }
                              }}
                              disabled={isRecommending}
                            />
                            <Label
                              htmlFor={`genre-${genre}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {genre}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Experience Level */}
            <form.Field
              name="experienceLevel"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} orientation="vertical">
                    <FieldLabel htmlFor={field.name}>
                      What's your experience level?
                    </FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as 'beginner' | 'intermediate' | 'advanced')
                      }
                      disabled={isRecommending}
                    >
                      <SelectTrigger id={field.name} className="w-full">
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Airflow Strength */}
            <form.Field
              name="airflowStrength"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} orientation="vertical">
                    <FieldLabel htmlFor={field.name}>
                      How strong is your airflow?
                    </FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as 'low' | 'medium' | 'high')
                      }
                      disabled={isRecommending}
                    >
                      <SelectTrigger id={field.name} className="w-full">
                        <SelectValue placeholder="Select airflow strength" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Gentle breath</SelectItem>
                        <SelectItem value="medium">Medium - Moderate breath</SelectItem>
                        <SelectItem value="high">High - Strong breath</SelectItem>
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Tone Preference */}
            <form.Field
              name="tonePreference"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} orientation="vertical">
                    <FieldLabel htmlFor={field.name}>
                      What tone do you prefer?
                    </FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(
                          value as 'bright' | 'warm' | 'mellow' | 'versatile'
                        )
                      }
                      disabled={isRecommending}
                    >
                      <SelectTrigger id={field.name} className="w-full">
                        <SelectValue placeholder="Select tone preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bright">Bright - Clear and sharp</SelectItem>
                        <SelectItem value="warm">Warm - Rich and full</SelectItem>
                        <SelectItem value="mellow">Mellow - Soft and smooth</SelectItem>
                        <SelectItem value="versatile">Versatile - Adaptable</SelectItem>
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Playing Environment */}
            <form.Field
              name="playingEnvironment"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} orientation="vertical">
                    <FieldLabel htmlFor={field.name}>
                      Where will you primarily play?
                    </FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(
                          value as 'home' | 'studio' | 'outdoor' | 'concert'
                        )
                      }
                      disabled={isRecommending}
                    >
                      <SelectTrigger id={field.name} className="w-full">
                        <SelectValue placeholder="Select playing environment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home - Private practice</SelectItem>
                        <SelectItem value="studio">Studio - Recording</SelectItem>
                        <SelectItem value="outdoor">Outdoor - Marching/Events</SelectItem>
                        <SelectItem value="concert">Concert - Performance hall</SelectItem>
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Weight Tolerance */}
            <form.Field
              name="weightTolerance"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} orientation="vertical">
                    <FieldLabel htmlFor={field.name}>
                      How much weight can you handle?
                    </FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as 'light' | 'medium' | 'heavy')
                      }
                      disabled={isRecommending}
                    >
                      <SelectTrigger id={field.name} className="w-full">
                        <SelectValue placeholder="Select weight tolerance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light - Easy to carry</SelectItem>
                        <SelectItem value="medium">Medium - Moderate weight</SelectItem>
                        <SelectItem value="heavy">Heavy - No issue with weight</SelectItem>
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex justify-end gap-4 pt-6">
          <Button
            variant="outline"
            type="button"
            onClick={handleClear}
            disabled={isRecommending}
          >
            Clear
          </Button>
          <Button type="submit" disabled={isRecommending} size="lg">
            {isRecommending ? (
              <>
                <Spinner className="mr-2" /> Getting Recommendations...
              </>
            ) : (
              'Get Recommendation'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default InstrumentForm;
