import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function useFilterSearchParam(identifier: string) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("filters") === "") {
      searchParams.delete("filters");
      setSearchParams(searchParams);
    }
  });

  const allFilters = searchParams.get("filters")?.split(",") || [];

  function handleCheck(e: React.ChangeEvent<HTMLInputElement>) {
    const filter = e.target.checked
      ? [...allFilters, `${identifier}${e.target.value}`]
      : allFilters.filter((el) => el !== `${identifier}${e.target.value}`);

    searchParams.set("filters", filter.join(","));
    setSearchParams(searchParams);
  }

  return { allFilters, handleCheck };
}
