import React, { useState, useEffect } from "react";
import { CardMedia, type CardMediaProps } from "@mui/material";

export type ImageType = "store" | "item" | "review";

const FALLBACKS: Record<ImageType, string> = {
  store: "/images/placeholder.png",
  item: "/images/placeholder-item.png",
  review: "/images/placeholder-reviews.png",
};

interface ImageWithFallbackProps extends CardMediaProps<"img"> {
  type?: ImageType;
  fallbackSrc?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  type = "item",
  fallbackSrc,
  sx,
  ...props
}) => {
  const defaultPlaceholder = fallbackSrc || FALLBACKS[type];

  const [imgSrc, setImgSrc] = useState<string | undefined>(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <CardMedia
      component="img"
      src={imgSrc || defaultPlaceholder}
      onError={() => setImgSrc(defaultPlaceholder)}
      {...props}
      sx={{
        objectFit: "cover",
        width: "100%",
        ...sx,
      }}
    />
  );
};

export default ImageWithFallback;
