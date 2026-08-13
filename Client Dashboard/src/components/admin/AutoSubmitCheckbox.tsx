"use client";

export function AutoSubmitCheckbox({
  name,
  defaultChecked,
}: {
  name: string;
  defaultChecked: boolean;
}) {
  return (
    <>
      <input type="hidden" name={name} value="false" />
      <input
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={defaultChecked}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="h-5 w-5 shrink-0 accent-sage"
      />
    </>
  );
}
