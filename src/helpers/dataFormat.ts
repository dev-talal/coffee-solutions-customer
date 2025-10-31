import Cookies from "js-cookie";

type TData = {
  id: string | number;
  name: string;
};

type TUsersData = {
  id: string | number;
  first_name: string;
  last_name: string;
};

export const formatOptions = <T extends TData>(
  data: T[] | undefined
): { label: string; value: string }[] => {
  if (!Array.isArray(data)) return [];

  return data.map((item) => ({
    label: item.name,
    value: item.id.toString(),
  }));
};

export const formatUsersOptions = <T extends TUsersData>(
  data: T[] | undefined
): { label: string; value: string }[] => {
  if (!Array.isArray(data)) return [];

  return data.map((item) => ({
    label: `${item.first_name} ${item.last_name}`,
    value: item.id.toString(),
  }));
};

export function getAvatarText(text: string): string {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export function getValueByPath(
  obj: Record<string, unknown>,
  path: string
): unknown {
  return path.split(".").reduce((acc, key) => {
    if (typeof acc !== "object" || acc === null) return undefined;

    const match = key.match(/^(\w+)\[(\d+)\]$/);
    if (match) {
      const [, arrKey, index] = match;
      const array = (acc as Record<string, unknown>)[arrKey];
      if (Array.isArray(array)) {
        return array[Number(index)];
      }
      return undefined;
    }

    return (acc as Record<string, unknown>)[key];
  }, obj);
}

export function formatStringToDateTime(date: string) {
  const dateTime = date ? new Date(date) : new Date();
  return dateTime.toLocaleDateString() + " " + dateTime.toLocaleTimeString();
}

function generateUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const getGuestId = () => {
  return Cookies.get(process.env.NEXT_PUBLIC_COOKIE_GUEST_ID as string);
};

export const removeGuestId = () => {
  Cookies.remove(process.env.NEXT_PUBLIC_COOKIE_GUEST_ID as string);
};

export const createGuestId = () => {
  const guestIdKey = process.env.NEXT_PUBLIC_COOKIE_GUEST_ID as string;
  let guestId = Cookies.get(guestIdKey);
  if (!guestId) {
    const newGuestId = generateUuid();

    Cookies.set(guestIdKey, newGuestId, {
      expires: 7,
    });

    guestId = newGuestId;
  }
};

export const formatCurrency = (value: number) => {
  return Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export function buildQueryParams(params: Record<string, unknown>): string {
  const filtered: Record<string, string> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      filtered[key] = String(value);
    }
  }

  const query = new URLSearchParams(filtered).toString();
  return query ? `?${query}` : "";
}

export const mergePiecesToBoxes = (
  pieces: number,
  piecesPerBox: number
): number => {
  const qty = Number(pieces);
  const perBox = Number(piecesPerBox);

  if (perBox > 0 && qty > 0) {
    return Math.floor(qty / perBox);
  } else if (qty === 0) {
    return 0;
  } else {
    return 0;
  }
};
