import { useMemo, useState } from 'react';
import type {User} from '@/queries/users';
import {  useUsers } from '@/queries/users';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import SearchInput from '@/components/search-input';

interface RoleDetailsAssignUserDialogProps {
  roleName: string;
  onAssignUsers: (userIds: Array<string>) => void;
}

const RoleDetailsAssignUserDialog = ({
  roleName,
  onAssignUsers,
}: RoleDetailsAssignUserDialogProps) => {
  const [search, setSearch] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<Array<User>>([]);

  const searchUsersQuery = useUsers(
    {
      page: 1,
      limit: 10,
      search: search || undefined,
    },
    { enabled: search.length > 0 }
  );

  const handleSelectUser = (user: User) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (userId: string | number) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
  };

  const handleAssignUsers = () => {
    onAssignUsers(selectedUsers.map((user) => user.id));
  };

  const filteredResults = useMemo(
    () =>
      searchUsersQuery.data?.data.filter(
        (user) => !selectedUsers.find((u) => u.id === user.id)
      ) || [],
    [searchUsersQuery.data?.data, selectedUsers]
  );

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Assign users to "{roleName}"</DialogTitle>
        <DialogDescription>
          Select users to assign this role to
        </DialogDescription>
      </DialogHeader>
      <SearchInput<User>
        placeholder="Typing to search users..."
        results={filteredResults}
        isLoading={searchUsersQuery.isLoading}
        onSearch={setSearch}
        onSelect={handleSelectUser}
        getItemKey={(user) => user.id}
        selectedItems={selectedUsers}
        onRemoveItem={handleRemoveUser}
        searchKeyword={search}
        emptyResultsMessage="No users matched your search."
        renderItem={(user) => (
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-muted-foreground text-sm">{user.email}</span>
          </div>
        )}
      />
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </DialogClose>
        <Button
          variant="default"
          type="button"
          disabled={selectedUsers.length === 0}
          onClick={handleAssignUsers}
        >
          Assign
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default RoleDetailsAssignUserDialog;
