import chairCognac from "@/assets/chair-cognac.jpg";
import chairIvory from "@/assets/chair-ivory.jpg";
import chairMidnight from "@/assets/chair-midnight.jpg";
import chairOxblood from "@/assets/chair-oxblood.jpg";
import heroChair from "@/assets/hero-chair.jpg";
import materialBrass from "@/assets/material-brass.jpg";
import materialLeather from "@/assets/material-leather.jpg";
import materialMarble from "@/assets/material-marble.jpg";
import materialWalnut from "@/assets/material-walnut.jpg";
import productChair from "@/assets/product-chair.jpg";
import productLamp from "@/assets/product-lamp.jpg";
import productSofa from "@/assets/product-sofa.jpg";
import productTable from "@/assets/product-table.jpg";

const assetMap: Record<string, string> = {
  chairCognac,
  chairIvory,
  chairMidnight,
  chairOxblood,
  heroChair,
  materialBrass,
  materialLeather,
  materialMarble,
  materialWalnut,
  productChair,
  productLamp,
  productSofa,
  productTable,
};

export function resolveAsset(imageKey: string) {
  return assetMap[imageKey] ?? "";
}
