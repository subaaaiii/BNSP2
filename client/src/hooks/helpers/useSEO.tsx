import { useEffect } from "react";

type SEOProps = {
  title?: string;
  description?: string;
};

export const useSEO = ({
  title = "SubGAME: Trusted Gaming Marketplace",
  description = "Buy and sell gaming accounts securely with trusted sellers and fast delivery on SubGAME.",
}: SEOProps) => {
  useEffect(() => {
    document.title = title;

    let meta = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement;

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }

    meta.content = description;
  }, [title, description]);
};