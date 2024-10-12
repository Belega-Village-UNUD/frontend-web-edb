import { type ClassValue, clsx } from "clsx";
import { Metadata } from "next";
import qs from "query-string";
import { twMerge } from "tailwind-merge";
interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function constructMetadata({
  title = "Painting & Beadwork Manacika Bali",
  description = "Exquisite beaded bags and Balinese paintings",
  image = "/thumbnail.png",
  icons = "/logo.png",
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@manacikabali",
    },
    icons,
    metadataBase: new URL("https://.vercel.app/"),
  };
}

export function formatRupiah(number: number | null | undefined) {
  if (number === null || number === undefined) {
    return "-";
  }

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  return formatter.format(number);
}

export function formatFileSize(size: number) {
  if (size > 1024) {
    if (size > 1048576) {
      return Math.round(size / 1048576) + "mb";
    } else {
      return Math.round(size / 1024) + "kb";
    }
  } else {
    return size + "b";
  }
}

export function capitalizeFirstLetter(string: string | undefined) {
  if (!string) string = "";
  string = string.replace(/_/g, " ");
  return string.toLowerCase().replace(/(^|\s)\S/g, function (firstLetter) {
    return firstLetter.toUpperCase();
  });
}

export const formUrlQuery = ({
  params,
  key,
  value,
}: UrlQueryParams): string => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`;
}

export function extractFileKey(url: string) {
  return url.split("/f/").pop();
}

export async function urlToBlobFile(
  fileUrl: string[] | string | null,
  fileKey: string[] | string | null
): Promise<File[]> {
  if (!fileUrl || !fileKey) {
    return [];
  }

  const fetchFile = async (url: string, key: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], key, { type: blob.type });
  };

  if (Array.isArray(fileUrl) && Array.isArray(fileKey)) {
    const filePromises = fileUrl.map((url, index) => {
      const key = fileKey[index];
      return fetchFile(url, key);
    });
    return await Promise.all(filePromises);
  } else if (typeof fileUrl === "string" && typeof fileKey === "string") {
    const file = await fetchFile(fileUrl, fileKey);
    return [file];
  } else {
    throw new Error(
      "fileUrl and fileKey must both be either arrays of the same length or single strings."
    );
  }
}

export function limitWords(
  text: string | undefined | null,
  maxWords: number
): string {
  if (!text) {
    return "";
  }
  const words: string[] = text.trim().split(/\s+/);
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + " ...";
  } else {
    return text;
  }
}
