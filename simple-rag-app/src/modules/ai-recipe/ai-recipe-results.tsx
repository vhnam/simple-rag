import { BookmarkIcon, LinkIcon } from 'lucide-react';
import type { AskRecipeResponse, Dish } from '@/queries/rag/rag.types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AIRecipeResultsProps {
  results: AskRecipeResponse;
}

const AIRecipeResults = ({ results }: AIRecipeResultsProps) => {
  return (
    <div className="space-y-6">
      {results.answer.dishes.length > 0 && (
        <div className="mt-6 space-y-6">
          <h2 className="text-2xl font-bold">Suggested Recipes</h2>
          <div className="space-y-6">
            {results.answer.dishes.map((dish: Dish) => (
              <Card key={dish.name}>
                <CardHeader>
                  <CardTitle>{dish.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-gray-500">Ingredients:</p>
                  <p className="whitespace-pre-wrap">
                    {dish.usedIngredients.join(', ')}
                  </p>
                  <Separator className="my-2" />
                  <p className="font-medium text-gray-500">
                    Extra Ingredients:
                  </p>
                  <p className="whitespace-pre-wrap">
                    {dish.extraIngredients.join(', ')}
                  </p>
                  <Separator className="my-2" />
                  <p className="font-medium text-gray-500">Instructions:</p>
                  <ol className="list-inside list-decimal">
                    {dish.steps.map((step, index) => (
                      <li
                        key={`${dish.name}__step--${index}`}
                        className="text-base"
                      >
                        {step}
                      </li>
                    ))}
                  </ol>
                </CardContent>
                <CardFooter className="flex justify-end gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <BookmarkIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Bookmark this recipe</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <LinkIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share this recipe</p>
                    </TooltipContent>
                  </Tooltip>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecipeResults;
