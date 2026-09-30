"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SORT_FIELDS, SearchQuerySchema, defaultQuery } from "@/lib/products";
import type { SearchQuery } from "@/lib/products";

type ProductSearchFormProps = {
  onSearch: (query: SearchQuery) => Promise<void>;
};

export default function ProductSearchForm({ onSearch }: ProductSearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchQuery>({
    resolver: zodResolver(SearchQuerySchema),
    mode: "onTouched",
    defaultValues: defaultQuery,
  });

  return (
    <div className="minimal-panel">
      <span className="panel-title">ค้นหารายการสินค้า</span>
      <form onSubmit={handleSubmit(onSearch)} noValidate>
        <div className="form-grid-layout">
          <div className="field-unit">
            <label htmlFor="q">คำค้น</label>
            <input
              id="q"
              className="field-input"
              {...register("q")}
              placeholder="พิมพ์ชื่อสินค้า เช่น phone"
            />
          </div>

          <div className="field-unit">
            <label htmlFor="limit">จำนวนรายการ (1-30)</label>
            <input
              id="limit"
              className="field-input"
              type="number"
              required
              {...register("limit", { valueAsNumber: true })}
              aria-invalid={!!errors.limit}
              aria-describedby="limit-error"
            />
            <span id="limit-error" role="alert" className="field-error">
              {errors.limit?.message}
            </span>
          </div>

          <div className="field-unit">
            <label htmlFor="sortBy">เรียงลำดับตาม</label>
            <select id="sortBy" className="field-input" {...register("sortBy")}>
              {SORT_FIELDS.map((field) => (
                <option key={field} value={field}>
                  {field.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="field-unit" style={{ justifyContent: "flex-end" }}>
            <button
              type="submit"
              className="btn-minimal btn-solid"
              disabled={isSubmitting}
            >
              {isSubmitting ? "กำลังค้นหา..." : "ค้นหา"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}