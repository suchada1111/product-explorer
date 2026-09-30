"use client";

import { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import ProductSearchForm from "./ProductSearchForm";
import { defaultQuery, fetchProducts } from "@/lib/products";
import type { Product, ProductDraft, ProductList, SearchQuery } from "@/lib/products";

type LoadState = "loading" | "error" | "ready";

const CATEGORY_IMAGES: Record<string, string> = {
  beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=60",
  fragrances: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&auto=format&fit=crop&q=60",
  furniture: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60",
  groceries: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60",
  "home-decoration": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=60",
  "kitchen-accessories": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=60",
  laptops: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60",
  "mens-shirts": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=60",
  "mens-shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
  "mens-watches": "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&auto=format&fit=crop&q=60",
  "mobile-accessories": "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=500&auto=format&fit=crop&q=60",
  motorcycle: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=60",
  "skin-care": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60",
  smartphones: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60",
  "sports-accessories": "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=500&auto=format&fit=crop&q=60",
  sunglasses: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60",
  tablets: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60",
  tops: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&auto=format&fit=crop&q=60",
  vehicle: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&auto=format&fit=crop&q=60",
  "womens-bags": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=60",
  "womens-dresses": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=60",
  "womens-jewellery": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60",
  "womens-shoes": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=60",
  "womens-watches": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60",
};

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // เก็บรายการสินค้าที่ผู้ใช้เพิ่มเองไว้ ไม่ให้หายตอนค้นหา
  const [localAddedProducts, setLocalAddedProducts] = useState<Product[]>([]);

  function showResult(list: ProductList, currentQuery?: SearchQuery) {
    let combined = list.products;

    // ถ้ามีสินค้าที่ผู้ใช้เพิ่มเอง ให้ค้นหาในสินค้าที่เพิ่มเองด้วยภาษาไทยได้เลย
    if (localAddedProducts.length > 0) {
      const q = currentQuery?.q.trim().toLowerCase() || "";
      const matchedLocal = q
        ? localAddedProducts.filter((item) =>
            item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
          )
        : localAddedProducts;

      combined = [...matchedLocal, ...list.products];
    }

    setProducts(combined);
    setStatus("ready");
  }

  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ"
    );
    setStatus("error");
  }

  async function loadProducts(query: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetchProducts(query);
      showResult(res, query);
    } catch (error) {
      showError(error);
    }
  }

  useEffect(() => {
    fetchProducts(defaultQuery).then((res) => showResult(res, defaultQuery)).catch(showError);
  }, []);

  function saveProduct(draft: ProductDraft) {
    const categoryImage =
      CATEGORY_IMAGES[draft.category] ||
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60";

    if (editingId === null) {
      const newProduct: Product = {
        ...draft,
        id: Date.now(),
        thumbnail: draft.thumbnail || categoryImage,
      };
      setLocalAddedProducts([newProduct, ...localAddedProducts]);
      setProducts([newProduct, ...products]);
    } else {
      const updatedProducts = products.map((item) =>
        item.id === editingId
          ? { ...draft, id: editingId, thumbnail: item.thumbnail || categoryImage }
          : item
      );
      setProducts(updatedProducts);
      setLocalAddedProducts(
        localAddedProducts.map((item) =>
          item.id === editingId
            ? { ...draft, id: editingId, thumbnail: item.thumbnail || categoryImage }
            : item
        )
      );
      setEditingId(null);
    }
  }

  function removeProduct(id: number) {
    setProducts(products.filter((item) => item.id !== id));
    setLocalAddedProducts(localAddedProducts.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  }

  const editingProduct = products.find((item) => item.id === editingId) ?? null;

  return (
    <main className="page-wrapper">
      <header className="top-bar">
        <h1>Product Explorer</h1>
        <p>ค้นหาและเลือกดูรายการสินค้า</p>
      </header>

      <ProductSearchForm onSearch={loadProducts} />

      <ProductForm
        key={editingId ?? "new"}
        editing={editingProduct}
        onSave={saveProduct}
        onCancel={() => setEditingId(null)}
      />

      <div className="catalog-header">
        <span>รายการสินค้าที่พร้อมจำหน่าย ({products.length})</span>
        <button
          type="button"
          className="btn-minimal btn-outline"
          onClick={() => loadProducts(defaultQuery)}
          disabled={status === "loading"}
          style={{ padding: "6px 14px", fontSize: "0.8rem" }}
        >
          {status === "loading" ? "กำลังโหลด..." : "โหลดข้อมูลใหม่"}
        </button>
      </div>

      <section aria-live="polite">
        {status === "loading" && (
          <p style={{ textAlign: "center", padding: 48, color: "var(--text-muted)" }}>
            กำลังโหลดข้อมูลสินค้า...
          </p>
        )}

        {status === "error" && (
          <p role="alert" style={{ textAlign: "center", padding: 48, color: "var(--danger)" }}>
            {errorMessage}
          </p>
        )}

        {status === "ready" && products.length === 0 && (
          <div className="minimal-panel" style={{ textAlign: "center", padding: 48 }}>
            <p style={{ color: "var(--text-muted)" }}>
              ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหา
            </p>
          </div>
        )}

        {status === "ready" && products.length > 0 && (
          <div className="catalog-grid">
            {products.map((item) => (
              <div key={item.id} className="catalog-item">
                <div className="item-image-wrapper">
                  <span
                    className={`item-badge ${
                      item.stock < 10 ? "badge-lowstock" : "badge-instock"
                    }`}
                  >
                    {item.stock < 10 ? "เหลือน้อย" : "พร้อมส่ง"}
                  </span>
                  <img
                    src={
                      item.thumbnail ||
                      CATEGORY_IMAGES[item.category] ||
                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60"
                    }
                    alt={item.title}
                    className="item-image"
                    loading="lazy"
                  />
                </div>

                <div className="item-content">
                  <div className="item-main-info">
                    <span className="item-category-pill">{item.category}</span>
                    <h3 className="item-name">{item.title}</h3>
                  </div>

                  <div>
                    <div className="item-price-row">
                      <span className="item-price-val">${item.price.toFixed(2)}</span>
                      <span className="item-stock-val">คงเหลือ {item.stock} ชิ้น</span>
                    </div>

                    <div className="item-button-group">
                      <button
                        type="button"
                        className="btn-select-product"
                        onClick={() => alert(`เลือกสินค้า ${item.title} เรียบร้อย`)}
                      >
                        เลือกซื้อสินค้านี้
                      </button>
                    </div>

                    <div className="item-management-row">
                      <button
                        type="button"
                        className="btn-text"
                        onClick={() => {
                          setEditingId(item.id);
                          window.scrollTo({ top: 120, behavior: "smooth" });
                        }}
                      >
                        แก้ไข
                      </button>
                      <button
                        type="button"
                        className="btn-text"
                        style={{ color: "var(--danger)" }}
                        onClick={() => removeProduct(item.id)}
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}