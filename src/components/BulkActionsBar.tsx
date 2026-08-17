import Button from './Button';
import './BulkActionsBar.css';

interface BulkActionsBarProps {
  count: number;
  onMarkDone: () => void;
  onDelete: () => void;
  onClear: () => void;
}

export default function BulkActionsBar({
  count,
  onMarkDone,
  onDelete,
  onClear,
}: BulkActionsBarProps) {
  return (
    <div className="bulk-bar" role="region" aria-label="Bulk actions">
      <span className="bulk-bar__count">
        {count} selected
      </span>
      <div className="bulk-bar__actions">
        <Button size="sm" onClick={onMarkDone}>
          Mark as done
        </Button>
        <Button size="sm" variant="danger" onClick={onDelete}>
          Delete
        </Button>
        <Button size="sm" variant="ghost" onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
