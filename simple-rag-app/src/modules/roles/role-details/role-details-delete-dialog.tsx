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
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface RoleDetailsDeleteDialogProps {
  roleName: string;
  roleId: string;
  isDisabled: boolean;
  onDelete: (roleId: string) => void;
}

const RoleDetailsDeleteDialog = ({
  roleName,
  roleId,
  isDisabled,
  onDelete,
}: RoleDetailsDeleteDialogProps) => {
  return (
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
                Are you sure you want to delete role "{roleName}"?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className={buttonVariants({ variant: 'destructive' })}
                onClick={() => onDelete(roleId)}
              >
                Delete role
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default RoleDetailsDeleteDialog;
