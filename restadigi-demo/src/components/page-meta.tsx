import { useEffect } from "react";

type PageMetaProps = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
};

/** Sync document title + meta description when locale/page content changes. */
export function PageMeta({ title, description, ogTitle, ogDescription }: PageMetaProps) {
  useEffect(() => {
    document.title = title;

    const ensureMeta = (attr: "name" | "property", key: string, content: string) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    ensureMeta("name", "description", description);
    ensureMeta("property", "og:title", ogTitle ?? title);
    ensureMeta("property", "og:description", ogDescription ?? description);
  }, [title, description, ogTitle, ogDescription]);

  return null;
}
