import React, { useRef, useState } from "react";
import { InnerPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import type { EditorFormState, ItemForm } from "../lib/types";
import { SectionHeader } from "../components/SectionHeader";
import { ItemCard } from "../components/ItemCard";

export const ItemsTab: React.FC<{
  form: EditorFormState;
  onUpdateItem: (index: number, next: Partial<ItemForm>) => void;
  onAddItem: () => void;
  onDeleteItem: (index: number) => void;
  onUploadImage: (index: number, file: File) => void;
}> = ({ form, onUpdateItem, onAddItem, onDeleteItem, onUploadImage }) => {
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const confirmDeleteItem = () => {
    if (itemToDelete === null) return;
    onDeleteItem(itemToDelete);
    setItemToDelete(null);
  };

  return (
    <div className="space-y-3">
      {/* Delete confirmation modal */}
      <ConfirmationModal
        show={itemToDelete !== null}
        onHide={() => setItemToDelete(null)}
        messages={[
          `Are you sure you want to remove "${form.items[itemToDelete ?? 0]?.name || form.items[itemToDelete ?? 0]?.key || `Item ${(itemToDelete ?? 0) + 1}`}"?`,
          "This action cannot be undone.",
        ]}
        onCancel={() => setItemToDelete(null)}
        onConfirm={confirmDeleteItem}
        confirmButtonLabel="Remove Item"
      />

      <div className="flex items-center justify-between mb-1">
        <SectionHeader type="warning">
          {form.items.length} Item{form.items.length !== 1 ? "s" : ""} Defined
        </SectionHeader>
      </div>

      {form.items.length === 0 && (
        <InnerPanel className="p-4 text-center">
          <p className="text-xs opacity-60 mb-2">
            No items yet. Items are the tokens and collectibles in your
            minigame.
          </p>
        </InnerPanel>
      )}

      {/* Responsive grid: 1 col mobile, 3 cols desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {form.items.map((item, index) => (
          <ItemCard
            key={`item-${index}`}
            item={item}
            index={index}
            fileRef={{ current: fileRefs.current[index] ?? null } as React.RefObject<HTMLInputElement | null>}
            onUpdate={(next) => onUpdateItem(index, next)}
            onDelete={() => setItemToDelete(index)}
            onUpload={(file) => {
              onUploadImage(index, file);
            }}
          />
        ))}
      </div>

      <Button onClick={onAddItem}>
        <span className="text-xs">+ Add Item</span>
      </Button>
    </div>
  );
};
