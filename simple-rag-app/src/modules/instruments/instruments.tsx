import { AlertCircleIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import InstrumentForm from './instrument-form';
import useInstrumentFormActions from './instrument-form.actions';
import InstrumentResults from './instrument-results';

const Instruments = () => {
  const { form, isRecommending, instrumentData, onReset } =
    useInstrumentFormActions();

  return (
    <div className="mx-auto w-full max-w-4xl py-10">
      <InstrumentForm
        form={form}
        isRecommending={isRecommending}
        onReset={onReset}
      />
      {!isRecommending && (
        <div className="mt-6 space-y-6">
          {instrumentData && instrumentData.status === 'success' && (
            <InstrumentResults results={instrumentData} />
          )}
          {instrumentData?.status === 'error' && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Unable to generate recommendations</AlertTitle>
              <AlertDescription>
                {instrumentData.error?.message ||
                  instrumentData.answer?.error?.message ||
                  'An error occurred while generating recommendations. Please try again.'}
              </AlertDescription>
            </Alert>
          )}
          {(instrumentData?.error?.code ||
            instrumentData?.answer?.error?.code) &&
            instrumentData?.status !== 'error' && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Unable to generate recommendations</AlertTitle>
                <AlertDescription>
                  {instrumentData.error?.message ||
                    instrumentData.answer?.error?.message ||
                    'An error occurred while generating recommendations. Please try again.'}
                </AlertDescription>
              </Alert>
            )}
        </div>
      )}
    </div>
  );
};

export default Instruments;

