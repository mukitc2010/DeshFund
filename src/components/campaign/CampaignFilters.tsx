"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useDebounce } from "@/hooks/useDebounce";
import { CATEGORIES } from "@/lib/validators/campaign";
import { Search } from "lucide-react";

interface CampaignFiltersProps {
  search?: string;
  category?: string;
  sort?: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

const categoryOptions = [
  { label: "All Categories", value: "" },
  ...CATEGORIES.map((c) => ({ label: c, value: c })),
];

const sortOptions = [
  { label: "Most Recent", value: "recent" },
  { label: "Most Funded", value: "funded" },
  { label: "Trending", value: "trending" },
];

function CampaignFilters({
  search = "",
  category = "",
  sort = "recent",
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: CampaignFiltersProps) {
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch !== search) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, onSearchChange, search]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <Input
          placeholder="Search campaigns..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          icon={<Search className="h-4 w-4" />}
        />
      </div>
      <div className="flex items-center gap-3 sm:flex-shrink-0">
        <Select
          options={categoryOptions}
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full sm:w-44"
        />
        <Select
          options={sortOptions}
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full sm:w-40"
        />
      </div>
    </div>
  );
}

export { CampaignFilters };
export type { CampaignFiltersProps };
