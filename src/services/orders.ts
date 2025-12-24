// src/services/orders.ts
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../app/firebase";

export const listenOrdersByStatus = (
  status: string,
  callback: (orders: any[]) => void
) => {
  const q = query(collection(db, "orders"), where("status", "==", status));
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(list);
  });
};

export const updateOrder = async (
  orderId: string,
  data: Record<string, any>
) => {
  const ref = doc(db, "orders", orderId);
  await updateDoc(ref, data);
};
