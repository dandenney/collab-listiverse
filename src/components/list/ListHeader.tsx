import { ListActions } from "./ListActions";

interface ListHeaderProps {
  title: string;
  showArchived: boolean;
  onToggleArchived: () => void;
  onArchiveCompleted: () => void;
  hasCompletedItems: boolean;
}

export function ListHeader({
  title,
  showArchived,
  onToggleArchived,
  onArchiveCompleted,
  hasCompletedItems
}: ListHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <ListActions
        showArchived={showArchived}
        onToggleArchived={onToggleArchived}
        onArchiveCompleted={onArchiveCompleted}
        hasCompletedItems={hasCompletedItems}
      />
    </div>
  );
}