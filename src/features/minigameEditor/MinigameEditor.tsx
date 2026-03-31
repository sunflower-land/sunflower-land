import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useActor } from "@xstate/react";
import { useNavigate, useParams } from "react-router";
import Decimal from "decimal.js-light";
import * as AuthProvider from "features/auth/lib/Provider";
import { Context as GameContext } from "features/game/GameProvider";
import { CONFIG } from "lib/config";
import { randomID } from "lib/utils/random";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { TextInput } from "components/ui/TextInput";
import { NumberInput } from "components/ui/NumberInput";
import { Checkbox } from "components/ui/Checkbox";
import type { MinigameConfig } from "features/minigame/lib/types";

type MinigameConfigRow = {
  slug: string;
  farmId: number;
  config: MinigameConfig;
  createdAt: string;
  updatedAt: string;
};

type TokenAmount = { token: string; amount: number };
type ItemForm = {
  key: string;
  name: string;
  description: string;
  image: string;
  id?: number;
  tradeable: boolean;
  presignedPutUrl: string;
  uploadError?: string;
};
type ActionForm = {
  id: string;
  mint: TokenAmount[];
  burn: TokenAmount[];
  require: TokenAmount[];
};

type EditorFormState = {
  slug: string;
  playUrl: string;
  descriptionTitle: string;
  descriptionSubtitle: string;
  descriptionWelcome: string;
  descriptionRules: string;
  items: ItemForm[];
  actions: ActionForm[];
};

const EMPTY_FORM: EditorFormState = {
  slug: "",
  playUrl: "",
  descriptionTitle: "",
  descriptionSubtitle: "",
  descriptionWelcome: "",
  descriptionRules: "",
  items: [],
  actions: [],
};

function formToConfig(form: EditorFormState): MinigameConfig {
  const actions = form.actions.reduce(
    (acc, row) => {
      if (!row.id.trim()) return acc;
      const mint = row.mint.reduce(
        (map, token) => {
          if (!token.token.trim()) return map;
          map[token.token.trim()] = { amount: Math.max(0, token.amount || 0) };
          return map;
        },
        {} as Record<string, { amount: number }>,
      );
      const burn = row.burn.reduce(
        (map, token) => {
          if (!token.token.trim()) return map;
          map[token.token.trim()] = { amount: Math.max(0, token.amount || 0) };
          return map;
        },
        {} as Record<string, { amount: number }>,
      );
      const require = row.require.reduce(
        (map, token) => {
          if (!token.token.trim()) return map;
          map[token.token.trim()] = { amount: Math.max(0, token.amount || 0) };
          return map;
        },
        {} as Record<string, { amount: number }>,
      );
      acc[row.id.trim()] = {
        ...(Object.keys(mint).length ? { mint } : {}),
        ...(Object.keys(burn).length ? { burn } : {}),
        ...(Object.keys(require).length ? { require } : {}),
      };
      return acc;
    },
    {} as MinigameConfig["actions"],
  );

  const items = form.items.reduce(
    (acc, item) => {
      if (!item.key.trim()) return acc;
      acc[item.key.trim()] = {
        name: item.name,
        description: item.description,
        ...(item.image.trim() ? { image: item.image.trim() } : {}),
        ...(item.id !== undefined ? { id: item.id } : {}),
        ...(item.tradeable ? { tradeable: true } : {}),
      };
      return acc;
    },
    {} as NonNullable<MinigameConfig["items"]>,
  );

  return {
    actions,
    ...(Object.keys(items).length ? { items } : {}),
    descriptions: {
      title: form.descriptionTitle || undefined,
      subtitle: form.descriptionSubtitle || undefined,
      welcome: form.descriptionWelcome || undefined,
      rules: form.descriptionRules || undefined,
    },
    ...(form.playUrl.trim() ? { playUrl: form.playUrl.trim() } : {}),
  };
}

function configToForm(slug: string, config: MinigameConfig): EditorFormState {
  const actions: ActionForm[] = Object.entries(config.actions ?? {}).map(
    ([id, value]) => ({
      id,
      mint: Object.entries(value.mint ?? {}).map(([key, amount]) => ({
        token: key,
        amount: "amount" in amount ? amount.amount : 0,
      })),
      burn: Object.entries(value.burn ?? {}).map(([key, amount]) => ({
        token: key,
        amount: amount.amount,
      })),
      require: Object.entries(value.require ?? {}).map(([key, amount]) => ({
        token: key,
        amount: amount.amount,
      })),
    }),
  );

  const items: ItemForm[] = Object.entries(config.items ?? {}).map(([key, v]) => ({
    key,
    name: v.name,
    description: v.description,
    image: v.image ?? "",
    id: v.id,
    tradeable: v.tradeable === true,
    presignedPutUrl: "",
  }));

  return {
    slug,
    playUrl: config.playUrl ?? "",
    descriptionTitle: config.descriptions?.title ?? "",
    descriptionSubtitle: config.descriptions?.subtitle ?? "",
    descriptionWelcome: config.descriptions?.welcome ?? "",
    descriptionRules: config.descriptions?.rules ?? "",
    items,
    actions,
  };
}

function useEditorApi() {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const { gameService } = useContext(GameContext);
  const [gameState] = useActor(gameService);
  const farmId = gameState.context.farmId;
  const token = authState.context.user.rawToken as string;

  const listUrl = useMemo(
    () => `${CONFIG.API_URL}/data?type=mingame-editor&farmId=${farmId}`,
    [farmId],
  );

  const loadRows = async (): Promise<MinigameConfigRow[]> => {
    const response = await fetch(listUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const body = (await response.json().catch(() => ({}))) as {
      data?: MinigameConfigRow[];
    };
    if (!response.ok) throw new Error(`Load failed (${response.status})`);
    return Array.isArray(body.data) ? body.data : [];
  };

  const submitEvent = async (event: Record<string, unknown>) => {
    const response = await fetch(`${CONFIG.API_URL}/event/${farmId}`, {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "X-Transaction-ID": randomID(),
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
      body: JSON.stringify({
        event,
        createdAt: new Date().toISOString(),
      }),
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as {
        errorCode?: string;
      };
      throw new Error(body.errorCode ?? `Request failed (${response.status})`);
    }
  };

  return { loadRows, submitEvent };
}

const FormSection: React.FC<React.PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => (
  <Panel className="p-2 space-y-2">
    <Label type="default">{title}</Label>
    {children}
  </Panel>
);

const TokenAmountEditor: React.FC<{
  title: string;
  rows: TokenAmount[];
  onChange: (rows: TokenAmount[]) => void;
}> = ({ title, rows, onChange }) => {
  const setRow = (index: number, next: Partial<TokenAmount>) => {
    const copy = [...rows];
    copy[index] = { ...copy[index], ...next };
    onChange(copy);
  };

  return (
    <div className="space-y-1">
      <Label type="info">{title}</Label>
      {rows.map((row, index) => (
        <div key={`${title}-${index}`} className="grid grid-cols-12 gap-1 items-center">
          <div className="col-span-7">
            <TextInput
              value={row.token}
              onValueChange={(value) => setRow(index, { token: value })}
              placeholder="Token key"
            />
          </div>
          <div className="col-span-3">
            <NumberInput
              value={new Decimal(row.amount)}
              maxDecimalPlaces={0}
              onValueChange={(value) => setRow(index, { amount: value.toNumber() })}
            />
          </div>
          <div className="col-span-2">
            <Button
              onClick={() => onChange(rows.filter((_, i) => i !== index))}
              className="w-full"
            >
              X
            </Button>
          </div>
        </div>
      ))}
      <Button onClick={() => onChange([...rows, { token: "", amount: 0 }])}>
        Add Row
      </Button>
    </div>
  );
};

const MinigameEditorForm: React.FC<{
  mode: "create" | "edit";
  initial: EditorFormState;
  saving: boolean;
  error: string | null;
  onSave: (form: EditorFormState) => void;
}> = ({ mode, initial, saving, error, onSave }) => {
  const [form, setForm] = useState<EditorFormState>(initial);
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const uploadImage = async (index: number, file: File) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    const meta = await new Promise<{ width: number; height: number }>(
      (resolve, reject) => {
        image.onload = () =>
          resolve({ width: image.naturalWidth, height: image.naturalHeight });
        image.onerror = () => reject(new Error("Invalid image file"));
        image.src = objectUrl;
      },
    ).finally(() => URL.revokeObjectURL(objectUrl));

    if (meta.width > 64 || meta.height > 64) {
      throw new Error("Image must be 64x64 pixels or smaller");
    }

    const item = form.items[index];
    if (!item.presignedPutUrl.trim()) {
      throw new Error("Add a pre-signed S3 PUT URL first");
    }

    const response = await fetch(item.presignedPutUrl.trim(), {
      method: "PUT",
      headers: { "Content-Type": file.type || "image/png" },
      body: file,
    });
    if (!response.ok) {
      throw new Error(`Upload failed (${response.status})`);
    }

    const publicUrl = item.presignedPutUrl.split("?")[0] ?? item.presignedPutUrl;
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], image: publicUrl, uploadError: undefined };
      return { ...prev, items };
    });
  };

  return (
    <div className="p-2 space-y-2 h-full overflow-y-auto scrollable pb-20">
      <FormSection title="Basics">
        <div className="space-y-1">
          <Label type="info">Slug</Label>
          <TextInput
            value={form.slug}
            onValueChange={(slug) => setForm((prev) => ({ ...prev, slug }))}
            maxLength={60}
            placeholder="my-minigame-slug"
            className={mode === "edit" ? "pointer-events-none opacity-70" : ""}
          />
        </div>
        <div className="space-y-1">
          <Label type="info">Play URL</Label>
          <TextInput
            value={form.playUrl}
            onValueChange={(playUrl) =>
              setForm((prev) => ({ ...prev, playUrl }))
            }
            placeholder="https://my-game.minigames.sunflower-land.com"
          />
        </div>
      </FormSection>

      <FormSection title="Descriptions">
        {[
          ["Title", "descriptionTitle"],
          ["Subtitle", "descriptionSubtitle"],
          ["Welcome", "descriptionWelcome"],
          ["Rules", "descriptionRules"],
        ].map(([label, key]) => (
          <div className="space-y-1" key={key}>
            <Label type="info">{label}</Label>
            <TextInput
              value={form[key as keyof EditorFormState] as string}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, [key]: value }))
              }
            />
          </div>
        ))}
      </FormSection>

      <FormSection title="Items">
        {form.items.map((item, index) => (
          <Panel key={`${item.key}-${index}`} className="p-2 space-y-1">
            <Label type="warning">Item {index + 1}</Label>
            <TextInput
              value={item.key}
              onValueChange={(value) =>
                setForm((prev) => {
                  const items = [...prev.items];
                  items[index] = { ...items[index], key: value };
                  return { ...prev, items };
                })
              }
              placeholder="Token key (e.g. GoldenNugget)"
            />
            <TextInput
              value={item.name}
              onValueChange={(value) =>
                setForm((prev) => {
                  const items = [...prev.items];
                  items[index] = { ...items[index], name: value };
                  return { ...prev, items };
                })
              }
              placeholder="Display name"
            />
            <TextInput
              value={item.description}
              onValueChange={(value) =>
                setForm((prev) => {
                  const items = [...prev.items];
                  items[index] = { ...items[index], description: value };
                  return { ...prev, items };
                })
              }
              placeholder="Description"
            />
            <TextInput
              value={item.image}
              onValueChange={(value) =>
                setForm((prev) => {
                  const items = [...prev.items];
                  items[index] = { ...items[index], image: value };
                  return { ...prev, items };
                })
              }
              placeholder="Image URL"
            />
            <TextInput
              value={item.presignedPutUrl}
              onValueChange={(value) =>
                setForm((prev) => {
                  const items = [...prev.items];
                  items[index] = { ...items[index], presignedPutUrl: value };
                  return { ...prev, items };
                })
              }
              placeholder="Pre-signed S3 PUT URL"
            />
            <div className="flex items-center gap-2">
              <input
                ref={(el) => {
                  fileRefs.current[index] = el;
                }}
                type="file"
                accept="image/png,image/webp,image/gif,image/jpeg"
                className="hidden"
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0];
                  if (!file) return;
                  void uploadImage(index, file).catch((err) => {
                    setForm((prev) => {
                      const items = [...prev.items];
                      items[index] = {
                        ...items[index],
                        uploadError:
                          err instanceof Error ? err.message : "Upload failed",
                      };
                      return { ...prev, items };
                    });
                  });
                }}
              />
              <Button onClick={() => fileRefs.current[index]?.click()}>
                Upload Image
              </Button>
              <span className="text-xs opacity-70">Max 64x64 pixels</span>
            </div>
            {item.uploadError && <Label type="danger">{item.uploadError}</Label>}
            {item.image && (
              <div className="flex items-center gap-2">
                <img
                  src={item.image}
                  alt={item.name || item.key || "item preview"}
                  className="w-8 h-8 object-contain border border-brown-200"
                  style={{ imageRendering: "pixelated" }}
                />
                <span className="text-xs break-all">{item.image}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xs">Marketplace ID</span>
              <div className="w-28">
                <NumberInput
                  value={new Decimal(item.id ?? 0)}
                  maxDecimalPlaces={0}
                  onValueChange={(value) =>
                    setForm((prev) => {
                      const items = [...prev.items];
                      items[index] = {
                        ...items[index],
                        id: value.toNumber(),
                      };
                      return { ...prev, items };
                    })
                  }
                />
              </div>
              <span className="text-xs">Tradeable</span>
              <Checkbox
                checked={item.tradeable}
                onChange={(checked) =>
                  setForm((prev) => {
                    const items = [...prev.items];
                    items[index] = { ...items[index], tradeable: checked };
                    return { ...prev, items };
                  })
                }
              />
            </div>
            <Button
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  items: prev.items.filter((_, i) => i !== index),
                }))
              }
            >
              Remove Item
            </Button>
          </Panel>
        ))}
        <Button
          onClick={() =>
            setForm((prev) => ({
              ...prev,
              items: [
                ...prev.items,
                {
                  key: "",
                  name: "",
                  description: "",
                  image: "",
                  tradeable: false,
                  presignedPutUrl: "",
                },
              ],
            }))
          }
        >
          Add Item
        </Button>
      </FormSection>

      <FormSection title="Actions">
        {form.actions.map((action, index) => (
          <Panel key={`${action.id}-${index}`} className="p-2 space-y-1">
            <Label type="warning">Action {index + 1}</Label>
            <TextInput
              value={action.id}
              onValueChange={(value) =>
                setForm((prev) => {
                  const actions = [...prev.actions];
                  actions[index] = { ...actions[index], id: value };
                  return { ...prev, actions };
                })
              }
              placeholder="Action ID"
            />
            <TokenAmountEditor
              title="Require"
              rows={action.require}
              onChange={(rows) =>
                setForm((prev) => {
                  const actions = [...prev.actions];
                  actions[index] = { ...actions[index], require: rows };
                  return { ...prev, actions };
                })
              }
            />
            <TokenAmountEditor
              title="Burn"
              rows={action.burn}
              onChange={(rows) =>
                setForm((prev) => {
                  const actions = [...prev.actions];
                  actions[index] = { ...actions[index], burn: rows };
                  return { ...prev, actions };
                })
              }
            />
            <TokenAmountEditor
              title="Mint"
              rows={action.mint}
              onChange={(rows) =>
                setForm((prev) => {
                  const actions = [...prev.actions];
                  actions[index] = { ...actions[index], mint: rows };
                  return { ...prev, actions };
                })
              }
            />
            <Button
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  actions: prev.actions.filter((_, i) => i !== index),
                }))
              }
            >
              Remove Action
            </Button>
          </Panel>
        ))}
        <Button
          onClick={() =>
            setForm((prev) => ({
              ...prev,
              actions: [...prev.actions, { id: "", mint: [], burn: [], require: [] }],
            }))
          }
        >
          Add Action
        </Button>
      </FormSection>

      {error && <Label type="danger">{error}</Label>}
      <div className="flex gap-2">
        <Button disabled={saving} onClick={() => onSave(form)}>
          {saving ? "Saving..." : mode === "create" ? "Create" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export const MinigameEditor: React.FC = () => {
  const navigate = useNavigate();
  const { loadRows } = useEditorApi();
  const [rows, setRows] = useState<MinigameConfigRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await loadRows();
        if (!mounted) return;
        setRows(data);
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, [loadRows]);

  return (
    <div className="p-2 pb-16 space-y-2 relative h-full">
      <Panel className="p-2">
        <Label>My Minigames</Label>
        {loading && <p className="text-xs mt-2">Loading...</p>}
        {error && <Label type="danger">{error}</Label>}
        {!loading && rows.length === 0 && (
          <p className="text-xs mt-2">You have not created any minigames yet.</p>
        )}
        <div className="space-y-1 mt-2">
          {rows.map((row) => (
            <button
              key={row.slug}
              className="w-full text-left border border-brown-200 rounded p-2 hover:bg-brown-100"
              onClick={() => navigate(`/minigame-editor/edit/${row.slug}`)}
            >
              <div className="text-sm font-bold">{row.slug}</div>
              <div className="text-xs opacity-70">Updated: {row.updatedAt}</div>
            </button>
          ))}
        </div>
      </Panel>
      <div className="fixed bottom-2 left-0 right-0 px-2 z-10">
        <Button className="w-full" onClick={() => navigate("/minigame-editor/create")}>
          Create New
        </Button>
      </div>
    </div>
  );
};

export const MinigameEditorCreate: React.FC = () => {
  const navigate = useNavigate();
  const { submitEvent } = useEditorApi();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSave = async (form: EditorFormState) => {
    setSaving(true);
    setError(null);
    try {
      const slug = form.slug.trim();
      if (!slug) throw new Error("Slug is required");
      await submitEvent({
        type: "minigame.created",
        slug,
        config: formToConfig(form),
      });
      navigate("/minigame-editor");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create minigame");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full overflow-hidden">
      <MinigameEditorForm
        mode="create"
        initial={EMPTY_FORM}
        saving={saving}
        error={error}
        onSave={onSave}
      />
    </div>
  );
};

export const MinigameEditorEdit: React.FC = () => {
  const navigate = useNavigate();
  const { slug = "" } = useParams<{ slug: string }>();
  const { loadRows, submitEvent } = useEditorApi();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initial, setInitial] = useState<EditorFormState | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const rows = await loadRows();
        const row = rows.find((entry) => entry.slug === slug);
        if (!row) throw new Error("Minigame not found");
        if (!mounted) return;
        setInitial(configToForm(row.slug, row.config));
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Failed to load minigame");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (slug) void load();
    return () => {
      mounted = false;
    };
  }, [loadRows, slug]);

  const onSave = async (form: EditorFormState) => {
    setSaving(true);
    setError(null);
    try {
      await submitEvent({
        type: "minigame.edited",
        slug,
        config: formToConfig(form),
      });
      navigate("/minigame-editor");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update minigame");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-2">
        <Panel className="p-2">
          <p className="text-xs">Loading minigame...</p>
        </Panel>
      </div>
    );
  }

  if (!initial) {
    return (
      <div className="p-2">
        <Panel className="p-2 space-y-2">
          {error && <Label type="danger">{error}</Label>}
          <Button onClick={() => navigate("/minigame-editor")}>Back</Button>
        </Panel>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden">
      <MinigameEditorForm
        mode="edit"
        initial={initial}
        saving={saving}
        error={error}
        onSave={onSave}
      />
    </div>
  );
};
