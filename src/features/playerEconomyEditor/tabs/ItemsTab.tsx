import React, { useRef, useState } from "react";
import { InnerPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import type { EditorFormState, ItemForm } from "../lib/types";
import { ItemCard } from "../components/ItemCard";

export const ItemsTab: React.FC<{
  form: EditorFormState;
  onUpdateItem: (index: number, next: Partial<ItemForm>) => void;
  onAddItem: () => void;
  onDeleteItem: (index: number) => void;
  onUploadImage: (index: number, file: File) => void | Promise<void>;
}> = ({ form, onUpdateItem, onAddItem, onDeleteItem, onUploadImage }) => {
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const visibleItemCount = form.items.filter((i) => !i.deleted).length;

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
          `Hide "${form.items[itemToDelete ?? 0]?.name || form.items[itemToDelete ?? 0]?.key || `Item ${(itemToDelete ?? 0) + 1}`}" from the editor?`,
          "It will not appear in lists or saved config, but its ID stays reserved so new items keep sequential numbering.",
        ]}
        onCancel={() => setItemToDelete(null)}
        onConfirm={confirmDeleteItem}
        confirmButtonLabel="Hide item"
      />

      {visibleItemCount === 0 && (
        <InnerPanel className="p-4 text-center">
          <p className="text-xs opacity-60 mb-2">
            No items yet. Items are the tokens and collectibles in your
            minigame.
          </p>
        </InnerPanel>
      )}

      {/* Responsive grid: 1 col mobile, 3 cols desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {form.items.map((item, index) =>
          item.deleted ? null : (
            <ItemCard
              key={
                item.id !== undefined ? `item-${item.id}` : `item-idx-${index}`
              }
              item={item}
              index={index}
              fileRef={
                {
                  current: fileRefs.current[index] ?? null,
                } as React.RefObject<HTMLInputElement | null>
              }
              onUpdate={(next) => onUpdateItem(index, next)}
              onDelete={() => setItemToDelete(index)}
              onUpload={(file) => {
                void onUploadImage(index, file);
              }}
            />
          ),
        )}
      </div>

      <Button onClick={onAddItem}>
        <span className="text-xs">+ Add Item</span>
      </Button>
    </div>
  );
};
