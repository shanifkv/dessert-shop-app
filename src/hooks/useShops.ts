import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../app/firebase";
import { Shop } from "../types";

export function useShops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ref = collection(db, "shops");

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const list: Shop[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Shop, "id">),
        }));
        setShops(list);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching shops:", err);
        setError("Failed to load shops");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { shops, loading, error };
}

