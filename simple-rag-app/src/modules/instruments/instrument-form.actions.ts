import { useState } from 'react';

import { useForm } from '@tanstack/react-form';

import { AxiosError } from 'axios';
import { toast } from 'sonner';

import type { InstrumentFormSchema } from '@/schemas/instrument-form.schema';
import { instrumentFormSchema } from '@/schemas/instrument-form.schema';

import { useRecommendInstrumentsMutation } from '@/queries/rag';
import type { AskInstrumentResponse } from '@/queries/rag/rag.types';

const defaultValues: InstrumentFormSchema = {
  budget: '',
  favoriteGenres: [],
  airflowStrength: undefined,
  tonePreference: undefined,
  experienceLevel: undefined,
  playingEnvironment: undefined,
  weightTolerance: undefined,
};

const useInstrumentFormActions = () => {
  const [instrumentData, setInstrumentData] = useState<AskInstrumentResponse>();

  const { mutate: recommendInstruments, isPending: isRecommending } =
    useRecommendInstrumentsMutation();

  const handleSubmit = ({ value }: { value: InstrumentFormSchema }) => {
    // Send structured payload directly to backend
    recommendInstruments(value, {
      onSuccess: (data: AskInstrumentResponse) => {
        setInstrumentData(data);

        if (data.error?.code === 'INVALID_INPUT') {
          toast.error(data.error.message);
        } else if (data.answer?.error?.code === 'INVALID_INPUT') {
          toast.error(data.answer.error.message);
        } else if (data.status === 'success') {
          toast.success('Đã tạo tư vấn nhạc cụ thành công');
        } else {
          toast.error('Không thể tạo tư vấn. Vui lòng thử lại.');
        }
      },
      onError: (error: unknown) => {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.error?.message ||
              'Không thể lấy tư vấn nhạc cụ',
          );
        } else {
          toast.error('Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.');
        }
      },
    });
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: instrumentFormSchema,
    },
    onSubmit: handleSubmit,
  });

  const handleResetForm = () => {
    setInstrumentData(undefined);
    form.reset();
  };

  return {
    form,
    isRecommending,
    instrumentData,
    onReset: handleResetForm,
  };
};

export default useInstrumentFormActions;

