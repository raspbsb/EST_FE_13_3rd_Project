import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../../utils/supabase";

import Text from "@mui/material/Typography";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

import { toUrl } from "../../services/toUrl";

export default function HeroImage({}) {
  const [selectedImg, setSelectedImg] = useState(0);
  const { data } = useSelector(state => state.portfolio);
  const images = data?.portfolio_images;

  function setThumbnail() {
    return data?.portfolio_images?.find(i => i.is_thumbnail === true)?.display_order ?? 0;
  }
  useEffect(() => {
    setSelectedImg(setThumbnail());
  }, [data?.project_id]);

  if (!images || images.length <= 0) {
    return (
      <Text component={"p"} color="textDisabled" variant="h6" align="center">
        등록된 이미지가 없습니다.
      </Text>
    );
  }

  return (
    <>
      <img src={toUrl(images[selectedImg]?.image_path)} alt={images[selectedImg]?.alt_text} />
      <ImageList cols={5} gap={1} sx={{ maxWidth: "100%" }}>
        {images?.map(img => (
          <ImageListItem>
            <img
              key={img.display_order}
              src={toUrl("portfolio_images", img.image_path)}
              alt={img.alt_text}
              onClick={() => setSelectedImg(img.display_order)}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
}
