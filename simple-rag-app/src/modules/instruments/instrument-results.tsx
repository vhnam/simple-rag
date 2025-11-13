import { useState } from 'react';
import { MusicIcon, SparklesIcon, ExternalLinkIcon, StarIcon } from 'lucide-react';

import type {
  AskInstrumentResponse,
  RecommendedInstrument,
  RecommendedModel,
} from '@/queries/rag/rag.types';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface InstrumentResultsProps {
  results: AskInstrumentResponse;
}

const formatModelPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

const InstrumentResults = ({ results }: InstrumentResultsProps) => {
  const [selectedInstrument, setSelectedInstrument] =
    useState<RecommendedInstrument | null>(null);

  // Handle the answer which can be null or an object with instruments
  const answerInstruments =
    results.answer && 'instruments' in results.answer
      ? results.answer.instruments || []
      : [];
  const recommendedInstruments = answerInstruments;

  if (recommendedInstruments.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            No recommendations found. Please try adjusting your preferences.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <SparklesIcon className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Recommended Instruments</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {recommendedInstruments.map((instrument: RecommendedInstrument) => (
          <Card
            key={instrument.name}
            className="border-2 transition-shadow hover:shadow-lg"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-xl mb-2">
                    <MusicIcon className="h-6 w-6 text-primary" />
                    {instrument.name}
                  </CardTitle>
                  <div className="flex gap-2 mb-3">
                    <Badge variant="outline">{instrument.family}</Badge>
                    <Badge
                      variant={
                        instrument.difficulty === 'beginner'
                          ? 'default'
                          : instrument.difficulty === 'intermediate'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {instrument.difficulty}
                    </Badge>
                  </div>
                  {instrument.relevanceScore !== undefined && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Relevance Score
                        </span>
                        <span className="font-semibold">
                          {instrument.relevanceScore}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${instrument.relevanceScore}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary */}
              {instrument.summary && (
                <div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {instrument.summary}
                  </p>
                </div>
              )}

              {/* Reasons */}
              {instrument.reasons && instrument.reasons.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Why this fits you:</p>
                  <ul className="space-y-1.5">
                    {instrument.reasons.map((reason, index) => (
                      <li
                        key={index}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <StarIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Price Range */}
              <div>
                <p className="text-sm font-semibold mb-1">Price Range:</p>
                <p className="text-sm text-muted-foreground">
                  {instrument.priceRange}
                </p>
              </div>

              {/* Beginner Models */}
              {instrument.recommendedModels &&
                instrument.recommendedModels.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-semibold mb-3">
                        Beginner Models:
                      </p>
                      <div className="space-y-2">
                        {instrument.recommendedModels
                          .slice(0, 2)
                          .map((model: RecommendedModel, index: number) => (
                            <div
                              key={index}
                              className="bg-muted/50 rounded-lg p-3 text-sm"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-semibold">
                                    {model.brand} {model.model}
                                  </p>
                                  {model.recommendedFor && (
                                    <Badge
                                      variant="secondary"
                                      className="mt-1 text-xs"
                                    >
                                      {model.recommendedFor}
                                    </Badge>
                                  )}
                                  {model.notes && (
                                    <p className="text-muted-foreground mt-1 text-xs">
                                      {model.notes}
                                    </p>
                                  )}
                                </div>
                                {model.price && (
                                  <p className="font-medium text-primary ml-2">
                                    {formatModelPrice(model.price)}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        {instrument.recommendedModels.length > 2 && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => setSelectedInstrument(instrument)}
                              >
                                View All Models ({instrument.recommendedModels.length})
                                <ExternalLinkIcon className="ml-2 h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  {instrument.name} - All Models
                                </DialogTitle>
                                <DialogDescription>
                                  Browse all recommended models for this instrument
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-3 mt-4">
                                {instrument.recommendedModels.map(
                                  (model: RecommendedModel, index: number) => (
                                    <Card key={index}>
                                      <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <p className="font-semibold">
                                              {model.brand} {model.model}
                                            </p>
                                            {model.recommendedFor && (
                                              <Badge
                                                variant="secondary"
                                                className="mt-2"
                                              >
                                                {model.recommendedFor}
                                              </Badge>
                                            )}
                                            {model.notes && (
                                              <p className="text-muted-foreground mt-2 text-sm">
                                                {model.notes}
                                              </p>
                                            )}
                                          </div>
                                          {model.price && (
                                            <p className="font-semibold text-primary ml-4">
                                              {formatModelPrice(model.price)}
                                            </p>
                                          )}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  </>
                )}

              {/* Considerations */}
              {instrument.considerations &&
                instrument.considerations.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-semibold mb-2">Considerations:</p>
                      <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        {instrument.considerations.map((consideration, index) => (
                          <li key={index}>{consideration}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Meta Information */}
      {results.meta && (
        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>
            Found {results.meta.retrievedCount || 0} similar instruments in{' '}
            {results.meta.durationMs.toFixed(0)}ms
          </p>
        </div>
      )}
    </div>
  );
};

export default InstrumentResults;
