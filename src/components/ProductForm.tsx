"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "@/lib/products";
import type { Product, ProductDraft } from "@/lib/products";

type ProductFormProps = {
  editing: Product | null;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
};

export default function ProductForm({ editing, onSave, onCancel }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductDraftSchema),
    mode: "onTouched",
    defaultValues: editing
      ? {
          title: editing.title,
          price: editing.price,
          stock: editing.stock,
          category: editing.category,
        }
      : {
          title: "",
          price: undefined,
          stock: undefined,
        },
  });

  function saveProduct(values: ProductDraft) {
    onSave(values);
    reset();
  }

  return (
    <div className="minimal-panel">
      <span className="panel-title">
        {editing ? "แก้ไขข้อมูลสินค้า" : "เพิ่มสินค้าใหม่"}
      </span>
      <form onSubmit={handleSubmit(saveProduct)} noValidate>
        <div className="form-grid-layout">
          <div className="field-unit">
            <label htmlFor="title">ชื่อสินค้า</label>
            <input
              id="title"
              className="field-input"
              required
              {...register("title")}
              placeholder="ระบุชื่อสินค้า"
              aria-invalid={!!errors.title}
              aria-describedby="title-error"
            />
            <span id="title-error" role="alert" className="field-error">
              {errors.title?.message}
            </span>
          </div>

          <div className="field-unit">
            <label htmlFor="price">ราคา ($)</label>
            <input
              id="price"
              className="field-input"
              type="number"
              step="0.01"
              required
              {...register("price", { valueAsNumber: true })}
              placeholder="0.00"
              aria-invalid={!!errors.price}
              aria-describedby="price-error"
            />
            <span id="price-error" role="alert" className="field-error">
              {errors.price?.message}
            </span>
          </div>

          <div className="field-unit">
            <label htmlFor="stock">จำนวนคงเหลือ</label>
            <input
              id="stock"
              className="field-input"
              type="number"
              required
              {...register("stock", { valueAsNumber: true })}
              placeholder="0"
              aria-invalid={!!errors.stock}
              aria-describedby="stock-error"
            />
            <span id="stock-error" role="alert" className="field-error">
              {errors.stock?.message}
            </span>
          </div>

          <div className="field-unit">
            <label htmlFor="category">หมวดหมู่</label>
            <select
              id="category"
              className="field-input"
              required
              {...register("category")}
              aria-invalid={!!errors.category}
              aria-describedby="category-error"
            >
              <option value="">เลือกหมวดหมู่</option>
              {CATEGORIES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <span id="category-error" role="alert" className="field-error">
              {errors.category?.message}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            type="submit"
            className="btn-minimal btn-solid"
            disabled={!isDirty || !isValid}
          >
            {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
          </button>
          {editing && (
            <button
              type="button"
              className="btn-minimal btn-outline"
              onClick={onCancel}
            >
              ยกเลิก
            </button>
          )}
        </div>
      </form>
    </div>
  );
}