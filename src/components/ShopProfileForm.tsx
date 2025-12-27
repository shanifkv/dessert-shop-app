import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../app/firebase";
import { getPlaceholderImage } from "../utils/images";

interface ShopProfileFormProps {
    shopId: string;
    onProfileSaved?: () => void;
}

const ShopProfileForm: React.FC<ShopProfileFormProps> = ({ shopId, onProfileSaved }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // Load existing profile if any
    useEffect(() => {
        if (!shopId) return;
        const fetchProfile = async () => {
            try {
                const docRef = doc(db, "shops", shopId);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    const data = snap.data();
                    setName(data.name || "");
                    setDescription(data.description || "");
                    setImageUrl(data.image || "");
                }
            } catch (err) {
                console.error("Error fetching shop profile:", err);
            }
        };
        fetchProfile();
    }, [shopId]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (!name.trim()) {
                throw new Error("Shop Name is required");
            }

            const shopData = {
                name: name.trim(),
                description: description.trim(),
                image: imageUrl.trim() || getPlaceholderImage(name.trim()),
                id: shopId, // Ensure ID is saved in the doc
            };

            await setDoc(doc(db, "shops", shopId), shopData, { merge: true });
            setMessage("Shop profile saved successfully!");
            if (onProfileSaved) onProfileSaved();
        } catch (err: any) {
            console.error("Error saving profile:", err);
            setMessage(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
            <h3 className="section-title" style={{ marginTop: 0 }}>Shop Settings</h3>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                <div className="form-group">
                    <label className="form-label">Shop Name</label>
                    <input
                        className="form-input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. The Velvet Bakery"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tell customers about your shop..."
                        rows={3}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Cover Image URL</label>
                    <input
                        className="form-input"
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                    />
                    <small style={{ color: "#666", marginTop: "4px", display: "block" }}>
                        Leave blank to use a cool placeholder.
                    </small>
                </div>

                {message && (
                    <div style={{
                        padding: "12px",
                        borderRadius: "8px",
                        backgroundColor: message.includes("Error") ? "#fee2e2" : "#dcfce7",
                        color: message.includes("Error") ? "#dc2626" : "#166534"
                    }}>
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{ alignSelf: "flex-start" }}
                >
                    {loading ? "Saving..." : "Save Shop Profile"}
                </button>
            </form>
        </div>
    );
};

export default ShopProfileForm;
