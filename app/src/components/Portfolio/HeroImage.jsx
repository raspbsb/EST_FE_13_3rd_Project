import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../../utils/supabase";

import Text from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

import { toUrl } from "../../services/toUrl";
import styles from "./HeroImage.module.css";

export default function HeroImage({}) {
  const [selectedImg, setSelectedImg] = useState(0);
  const { data } = useSelector(state => state.portfolio);
  const images = data?.portfolio_images;

  function setThumbnail() {
    return data?.portfolio_images?.find(i => i.is_thumbnail === true)?.display_order - 1 ?? 0;
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
    <Box component={"div"} className={`${styles["hero-image-section-container"]}`}>
      <Box component={"div"} className={`${styles["hero-image-selected-wrapper"]}`}>
        <Box
          component={"img"}
          src={toUrl("portfolio_images", images[selectedImg]?.image_path)}
          alt={images[selectedImg]?.alt_text}
          className={`${styles["hero-image-selected-image"]}`}
        />
      </Box>
      <ImageList cols={5} gap={8} className={`${styles["hero-image-list"]}`}>
        {images?.map(img => (
          <ImageListItem
            key={img.display_order}
            onClick={() => setSelectedImg(img.display_order - 1)}
            className={`${styles["hero-image-list-item-wrapper"]} ${selectedImg === img.display_order - 1 ? styles["active"] : ""}`}
          >
            <Box
              component={"img"}
              src={toUrl("portfolio_images", img.image_path)}
              alt={img.alt_text}
              className={`${styles["hero-image-list-item-image"]}`}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}
