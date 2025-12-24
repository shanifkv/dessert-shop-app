import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../app/firebase";

type Props = {
  shopId?: string;
  onCreated?: () => void;
};

const AddItemForm: React.FC<Props> = ({ shopId = "demo-shop", onCreated }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setPrice("");
    setImageUrl("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    const parsedPrice = typeof price === "string" ? Number(price) : price;
    if (!parsedPrice || parsedPrice <= 0) {
      setError("Price must be a positive number");
      return;
    }

    if (imageUrl && !/^https?:\/\//i.test(imageUrl)) {
      setError("Image URL must start with http:// or https://");
      return;
    }

    setLoading(true);
    try {
      const itemsRef = collection(db, "items");
      await addDoc(itemsRef, {
        name: name.trim(),
        price: parsedPrice,
        imageUrl: imageUrl || null,
        shopId,
        createdAt: new Date(),
      });
      reset();
      onCreated?.();
    } catch (err) {
      console.error("Failed to add item", err);
      setError("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 480, display: "grid", gap: 8 }}>
      <div>
        <label style={{ display: "block", fontSize: 13 }}>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%" }} />
      </div>

      <div>
        <label style={{ display: "block", fontSize: 13 }}>Price</label>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
          type="number"
          step="0.01"
          style={{ width: "100%" }}
        />
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <div>
        <button type="submit" disabled={loading}>
          {loading ? "Adding…" : "Add Item"}
        </button>
      </div>
    </form>
  );
};

export default AddItemForm;
