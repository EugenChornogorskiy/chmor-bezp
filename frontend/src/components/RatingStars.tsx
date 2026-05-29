"use client"; 
export function RatingStars({ value, setValue,formik }: any) {
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[...Array(10)].map((_, i) => {
        const n = i + 1;
        return (
          <span
            key={n}
            onClick={() => {
              setValue(n);
              formik.setFieldValue('rating', n); // Оновити значення в Formik
            }}
            style={{
              cursor: "pointer",
              fontSize: "22px",
              color: n <= value ? "#ffc107" : "#ccc",
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
