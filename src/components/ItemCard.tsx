import React, { useState } from "react";
import type { Item } from "../types";
import { useCart } from "../context/CartContext";
import { getPlaceholderImage } from "../utils/images";

type Props = {
  item: Item;
  onAdd?: (id: string) => void; // optional local handler
};
export default function ItemCard({ item, onAdd }: Props) {
  const { addItem, openCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    if (adding) return;
    setAdding(true);
    if (onAdd) {
      onAdd(item.id);
      // brief disable to avoid rapid clicks
      setTimeout(() => setAdding(false), 600);
    } else {
      // add minimal item info to cart (CartItem expects itemId,name,price,qty)
      addItem({ itemId: item.id, name: item.name, price: item.price });
      // open cart drawer so user sees the added item
      openCart();
      // brief disable to avoid rapid clicks
      setTimeout(() => setAdding(false), 600);
    }
  };
  return (
    <div className="item-card" style={{border:"1px solid #eee", padding:16, borderRadius:8, width:200}}>
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.name} style={{width:"100%", height:120, objectFit:"cover", marginBottom:8}}/>
      ) : (
        <img src={getPlaceholderImage(item.name, 400, 240)} alt={item.name} style={{width:"100%", height:120, objectFit:"cover", marginBottom:8}}/>
      )}
      <h3 style={{margin:"8px 0"}}>{item.name}</h3>
      <div>₹{item.price}</div>
      <button onClick={handleAdd} style={{marginTop:8}} disabled={adding}>{adding ? "Adding…" : "Add"}</button>
    </div>
  );
}
